import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { EXPENSE_CATEGORIES } from '../../expense/expense.model.js';
import * as expenseService from '../../expense/expense.service.js';
import * as pocketMoneyService from '../../pocketMoney/pocketMoney.service.js';
import * as lentMoneyService from '../../lentMoney/lentMoney.service.js';
import PocketMoneyModel from '../../pocketMoney/pocketMoney.model.js';
import LentMoneyModel from '../../lentMoney/lentMoney.model.js';
import { adjustBalance } from '../../user/user.service.js';

export function getTransactionTools(userId: string) {
  const searchTransactions = tool(
    async ({ query, category, month, year, limit = 10, page = 0, type }) => {
      try {
        if (type === 'pocket-money') {
          const entries = await pocketMoneyService.listEntries(userId);
          let filtered = entries;
          if (query) {
            filtered = entries.filter((e) => e.source.toLowerCase().includes(query.toLowerCase()));
          }
          return JSON.stringify(filtered.slice(page * limit, (page + 1) * limit));
        }

        if (type === 'lent-money') {
          const entries = await lentMoneyService.listEntries(userId);
          let filtered = entries;
          if (query) {
            filtered = entries.filter((e) =>
              e.personName.toLowerCase().includes(query.toLowerCase()),
            );
          }
          return JSON.stringify(filtered.slice(page * limit, (page + 1) * limit));
        }

        // Default to expenses
        const feed = await expenseService.getExpensesFeed(userId, {
          search: query,
          category,
          month,
          year,
          limit,
          page,
        });
        return JSON.stringify(feed);
      } catch (err: any) {
        return `Error searching transactions: ${err.message || err}`;
      }
    },
    {
      name: 'search_transactions',
      description:
        'Search transaction records. Supports searching expenses (default), pocket-money (deposits/income), or lent-money.',
      schema: z.object({
        type: z
          .enum(['expense', 'pocket-money', 'lent-money'])
          .optional()
          .describe('The type of transactions to search (defaults to expense).'),
        query: z
          .string()
          .optional()
          .describe(
            'Text search match for expense names/labels, pocket-money source, or lent-money personName.',
          ),
        category: z.enum(EXPENSE_CATEGORIES).optional().describe('Filter expenses by category.'),
        month: z
          .string()
          .optional()
          .describe('Filter by month (2-digit format, e.g., "07" for July).'),
        year: z.string().optional().describe('Filter by year (4-digit format, e.g., "2026").'),
        limit: z.number().optional().describe('Limit the number of records returned (default 10).'),
        page: z.number().optional().describe('Page index for pagination (default 0).'),
      }),
    },
  );

  const createTransaction = tool(
    async ({ type, name, amount, category, date, label }) => {
      try {
        const txDate = date ? new Date(date) : new Date();

        if (type === 'expense') {
          if (!category) {
            return 'Error: Category is required for creating an expense.';
          }
          const result = await expenseService.addPastDateExpensesBulk(userId, [
            {
              date: txDate,
              productsArray: [
                {
                  name,
                  price: amount,
                  category,
                  label: label || null,
                },
              ],
            },
          ]);
          return `Successfully added expense: ${name} (₹${amount}) in category ${category}. Current pocket money balance is now ₹${result.currentPocketMoney}.`;
        }

        if (type === 'pocket-money') {
          const result = await pocketMoneyService.addEntry(userId, {
            date: txDate,
            amount,
            source: name,
          });
          return `Successfully added pocket money deposit: ${name} (₹${amount}). Current pocket money balance is now ₹${result.currentPocketMoney}.`;
        }

        if (type === 'lent-money') {
          const result = await lentMoneyService.addEntry(userId, {
            personName: name,
            price: amount,
            date: txDate,
          });
          return `Successfully logged lent money: ₹${amount} lent to ${name}. Total outstanding lent money is now ₹${result.totalLentMoney}. Current pocket money balance is now ₹${result.currentPocketMoney}.`;
        }

        return `Error: Unknown transaction type "${type}".`;
      } catch (err: any) {
        return `Error creating transaction: ${err.message || err}`;
      }
    },
    {
      name: 'create_transaction',
      description:
        'Create a new transaction. Can be an expense (deducts from pocket money), a pocket-money entry (deposit/income, adds to pocket money), or a lent-money entry (money lent to someone, deducts from pocket money).',
      schema: z.object({
        type: z
          .enum(['expense', 'pocket-money', 'lent-money'])
          .describe('Type of transaction to create.'),
        name: z
          .string()
          .describe('The name of the expense product, source of pocket money, or person lent to.'),
        amount: z.number().positive().describe('The monetary amount in INR.'),
        category: z
          .enum(EXPENSE_CATEGORIES)
          .optional()
          .describe('Expense category (required for expense type).'),
        date: z
          .string()
          .optional()
          .describe('Date in YYYY-MM-DD format (defaults to current date).'),
        label: z.string().optional().describe('Optional label for the expense.'),
      }),
    },
  );

  const updateTransaction = tool(
    async ({ type, id, updates }) => {
      try {
        if (type === 'expense') {
          const existing = await expenseService.updateExpense(userId, id, {
            expenseName: updates.name as string,
            expensePrice: updates.amount as number,
            expenseCategory: updates.category as any,
            expenseDate: updates.date ? new Date(updates.date) : undefined,
            selectedLabel: updates.label,
          });
          return `Successfully updated expense. Updated record: ${JSON.stringify(existing.expense)}. Current pocket money: ₹${existing.currentPocketMoney}`;
        }

        if (type === 'pocket-money') {
          const entry = await PocketMoneyModel.findOne({ _id: id, user: userId });
          if (!entry) return 'Error: Pocket money entry not found.';

          const oldAmount = entry.amount;
          if (updates.name) entry.source = updates.name;
          if (updates.amount !== undefined) entry.amount = updates.amount;
          if (updates.date) entry.date = new Date(updates.date);

          await entry.save();

          let currentPocketMoney = 0;
          if (updates.amount !== undefined) {
            const delta = updates.amount - oldAmount;
            currentPocketMoney = await adjustBalance(userId, delta);
          }

          return `Successfully updated pocket money entry. Current pocket money: ₹${currentPocketMoney}`;
        }

        if (type === 'lent-money') {
          if (updates.isReceived) {
            const result = await lentMoneyService.markReceived(userId, id);
            return `Successfully marked lent money as received. Refunded ₹${result.entry.price} to pocket money. Current pocket money: ₹${result.currentPocketMoney}`;
          }

          const entry = await LentMoneyModel.findOne({ _id: id, user: userId });
          if (!entry) return 'Error: Lent money entry not found.';

          const oldPrice = entry.price;
          if (updates.name) entry.personName = updates.name;
          if (updates.amount !== undefined) entry.price = updates.amount;
          if (updates.date) entry.date = new Date(updates.date);

          await entry.save();

          let currentPocketMoney = 0;
          if (updates.amount !== undefined) {
            const delta = oldPrice - updates.amount; // reduction in lent price refunds pocket money
            currentPocketMoney = await adjustBalance(userId, delta);
          }

          return `Successfully updated lent money entry. Current pocket money: ₹${currentPocketMoney}`;
        }

        return `Error: Unknown transaction type "${type}".`;
      } catch (err: any) {
        return `Error updating transaction: ${err.message || err}`;
      }
    },
    {
      name: 'update_transaction',
      description:
        'Update an existing transaction record by ID. Supports updating expense details, pocket-money amount/date/source, or lent-money (including marking it as received).',
      schema: z.object({
        type: z.enum(['expense', 'pocket-money', 'lent-money']).describe('The transaction type.'),
        id: z.string().describe('The Mongo database ID of the transaction.'),
        updates: z.object({
          name: z.string().optional().describe('Updated name, source, or personName.'),
          amount: z.number().positive().optional().describe('Updated amount in INR.'),
          category: z
            .enum(EXPENSE_CATEGORIES)
            .optional()
            .describe('Updated category (expenses only).'),
          date: z.string().optional().describe('Updated date in YYYY-MM-DD.'),
          label: z.string().optional().nullable().describe('Updated label (expenses only).'),
          isReceived: z
            .boolean()
            .optional()
            .describe('Lent-money only: set to true to mark outstanding loan as received back.'),
        }),
      }),
    },
  );

  const deleteTransaction = tool(
    async ({ type, id }) => {
      try {
        if (type === 'expense') {
          const result = await expenseService.deleteExpense(userId, id, {
            isAddPriceToPocketMoney: true,
          });
          return `Successfully deleted expense. Refunded price to pocket money. Current pocket money: ₹${result.currentPocketMoney}`;
        }

        if (type === 'pocket-money') {
          const entry = await PocketMoneyModel.findOneAndDelete({ _id: id, user: userId });
          if (!entry) return 'Error: Pocket money entry not found.';
          const currentPocketMoney = await adjustBalance(userId, -entry.amount);
          return `Successfully deleted pocket money deposit of ₹${entry.amount}. Deducted from pocket money. Current pocket money: ₹${currentPocketMoney}`;
        }

        if (type === 'lent-money') {
          const entry = await LentMoneyModel.findOneAndDelete({ _id: id, user: userId });
          if (!entry) return 'Error: Lent money entry not found.';

          let currentPocketMoney;
          if (!entry.isReceived) {
            // Refund the money since we delete the unreceived debt entry
            currentPocketMoney = await adjustBalance(userId, entry.price);
          }
          return `Successfully deleted lent money entry. Current pocket money: ₹${currentPocketMoney || 'unchanged'}`;
        }

        return `Error: Unknown transaction type "${type}".`;
      } catch (err: any) {
        return `Error deleting transaction: ${err.message || err}`;
      }
    },
    {
      name: 'delete_transaction',
      description:
        'Delete an existing transaction record by ID. Reconciles running pocket money balance accordingly.',
      schema: z.object({
        type: z.enum(['expense', 'pocket-money', 'lent-money']).describe('The transaction type.'),
        id: z.string().describe('The Mongo database ID of the transaction.'),
      }),
    },
  );

  return [searchTransactions, createTransaction, updateTransaction, deleteTransaction];
}
