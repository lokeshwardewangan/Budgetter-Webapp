import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import * as reportService from '../../report/report.service.js';
import ExpenseModel from '../../expense/expense.model.js';
import PocketMoneyModel from '../../pocketMoney/pocketMoney.model.js';
import LentMoneyModel from '../../lentMoney/lentMoney.model.js';
import { monthRange } from '../../../shared/lib/date.js';

export function getReportTools(userId: string) {
  const getSpendingAnalytics = tool(
    async ({ month, year }) => {
      try {
        const report = await reportService.monthlyReport(userId, { month, year });
        return JSON.stringify(report);
      } catch (err: any) {
        return `Error fetching monthly report: ${err.message || err}`;
      }
    },
    {
      name: 'get_spending_analytics',
      description:
        'Get deep spending analytics for a specific month and year, including categories breakdown, weekday/weekend split, and peak spending days.',
      schema: z.object({
        month: z.number().describe('Month (1-12).'),
        year: z.number().describe('Year (4-digit, e.g., 2026).'),
      }),
    },
  );

  const generateReport = tool(
    async ({ type, month, year }) => {
      try {
        const now = new Date();
        const y = year || now.getFullYear();
        const m = month || now.getMonth() + 1;

        if (type === 'monthly') {
          const report = await reportService.monthlyReport(userId, { month: m, year: y });
          return JSON.stringify({
            period: `Month ${m}/${y}`,
            ...report,
          });
        }

        if (type === 'weekly') {
          // Calculate last 7 days range
          const endDate = new Date();
          const startDate = new Date();
          startDate.setDate(endDate.getDate() - 7);

          const match = { user: userId, date: { $gte: startDate, $lte: endDate } };
          const [expenses, pocket, lent] = await Promise.all([
            ExpenseModel.find(match).sort({ date: -1 }).lean(),
            PocketMoneyModel.find(match).sort({ date: -1 }).lean(),
            LentMoneyModel.find({ user: userId, date: { $gte: startDate, $lte: endDate } })
              .sort({ date: -1 })
              .lean(),
          ]);

          const totalExpenses = expenses.reduce((sum, e) => sum + e.price, 0);
          const totalIncome = pocket.reduce((sum, p) => sum + p.amount, 0);
          const totalLent = lent.reduce((sum, l) => sum + l.price, 0);

          return JSON.stringify({
            period: 'Last 7 Days',
            startDate: startDate.toISOString().split('T')[0],
            endDate: endDate.toISOString().split('T')[0],
            totalExpenses,
            totalIncome,
            totalLent,
            expensesList: expenses.map((e) => ({
              name: e.name,
              price: e.price,
              category: e.category,
              date: e.date,
            })),
          });
        }

        if (type === 'yearly') {
          // Aggregate monthly totals for the entire year
          const match = {
            user: userId,
            date: {
              $gte: new Date(Date.UTC(y, 0, 1)),
              $lt: new Date(Date.UTC(y + 1, 0, 1)),
            },
          };

          const [expensesAgg, pocketAgg] = await Promise.all([
            ExpenseModel.aggregate<{ _id: number; total: number }>([
              { $match: match },
              { $group: { _id: { $month: '$date' }, total: { $sum: '$price' } } },
              { $sort: { _id: 1 } },
            ]),
            PocketMoneyModel.aggregate<{ _id: number; total: number }>([
              { $match: match },
              { $group: { _id: { $month: '$date' }, total: { $sum: '$amount' } } },
              { $sort: { _id: 1 } },
            ]),
          ]);

          return JSON.stringify({
            period: `Year ${y}`,
            expensesByMonth: expensesAgg,
            incomeByMonth: pocketAgg,
          });
        }

        return `Error: Unknown report type "${type}".`;
      } catch (err: any) {
        return `Error generating report: ${err.message || err}`;
      }
    },
    {
      name: 'generate_report',
      description:
        'Generates a structured weekly, monthly, or yearly financial report aggregating expenses, incomes, and trends.',
      schema: z.object({
        type: z.enum(['weekly', 'monthly', 'yearly']).describe('Period type of the report.'),
        month: z
          .number()
          .optional()
          .describe('Month (required for monthly report, optional otherwise).'),
        year: z.number().describe('Year.'),
      }),
    },
  );

  const financialInsights = tool(
    async () => {
      try {
        const now = new Date();
        const m = now.getMonth() + 1;
        const y = now.getFullYear();

        const { gte, lt } = monthRange(m, y);

        // Fetch current month report
        const report = await reportService.monthlyReport(userId, { month: m, year: y });

        // Fetch recent 15 transactions
        const recentExpenses = await ExpenseModel.find({ user: userId })
          .sort({ date: -1, createdAt: -1 })
          .limit(15)
          .lean();

        return JSON.stringify({
          currentMonth: `${m}/${y}`,
          reportSummary: {
            totalExpenses: report.totalExpenses,
            totalIncome: report.totalAddedMoney,
            savingsRate:
              report.totalAddedMoney > 0
                ? ((report.totalAddedMoney - report.totalExpenses) / report.totalAddedMoney) * 100
                : 0,
            categoryBreakdown: report.categoryWiseExpensesData,
          },
          recentExpenses: recentExpenses.map((e) => ({
            name: e.name,
            price: e.price,
            category: e.category,
            date: e.date,
          })),
        });
      } catch (err: any) {
        return `Error calculating insights context: ${err.message || err}`;
      }
    },
    {
      name: 'financial_insights',
      description:
        "Fetch general context about the user's recent spending behaviors, category distribution, and income status to provide personalized insights.",
      schema: z.object({}),
    },
  );

  return [getSpendingAnalytics, generateReport, financialInsights];
}
