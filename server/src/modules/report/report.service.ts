import ExpenseModel, {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from '../expense/expense.model.js';
import PocketMoneyModel from '../pocketMoney/pocketMoney.model.js';
import LentMoneyModel from '../lentMoney/lentMoney.model.js';
import { monthRange } from '../../shared/lib/date.js';

const CATEGORY_KEY_MAP: Record<ExpenseCategory, string> = {
  Groceries: 'GroceriesExpenses',
  'Housing & Utilities': 'Housing_UtilitiesExpenses',
  Medical: 'MedicalExpenses',
  Food: 'FoodExpenses',
  Personal: 'PersonalExpenses',
  Educational: 'EducationalExpenses',
  Transportation: 'TransportationExpenses',
  Miscellaneous: 'MiscellaneousExpenses',
};

function emptyCategoryBreakdown(): Record<string, number> {
  return EXPENSE_CATEGORIES.reduce<Record<string, number>>((acc, cat) => {
    acc[CATEGORY_KEY_MAP[cat]] = 0;
    return acc;
  }, {});
}

interface MonthlyReportArgs {
  month: string | number;
  year: string | number;
}

export async function monthlyReport(userId: string, { month, year }: MonthlyReportArgs) {
  const { gte, lt } = monthRange(month, year);
  const range = { $gte: gte, $lt: lt };

  // Last month with any expense activity, used as the "previous period" total.
  const lastEntry = await ExpenseModel.findOne({ user: userId }).sort({ date: -1 }).lean();
  let lastTotalExpenses = 0;
  if (lastEntry) {
    const prev = monthRange(lastEntry.date.getUTCMonth() + 1, lastEntry.date.getUTCFullYear());
    const lastAgg = await ExpenseModel.aggregate<{ _id: null; total: number }>([
      { $match: { user: userId, date: { $gte: prev.gte, $lt: prev.lt } } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]);
    lastTotalExpenses = lastAgg[0]?.total || 0;
  }

  const [expensesAgg, pocketAgg, lentAgg] = await Promise.all([
    ExpenseModel.aggregate<{ _id: ExpenseCategory; total: number }>([
      { $match: { user: userId, date: range } },
      { $group: { _id: '$category', total: { $sum: '$price' } } },
    ]),
    PocketMoneyModel.aggregate<{ _id: null; total: number }>([
      { $match: { user: userId, date: range } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    LentMoneyModel.aggregate<{ _id: null; total: number }>([
      { $match: { user: userId, date: range } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]),
  ]);

  const categoryWiseExpensesData = emptyCategoryBreakdown();
  let totalExpenses = 0;
  for (const row of expensesAgg) {
    const key = CATEGORY_KEY_MAP[row._id];
    if (key) categoryWiseExpensesData[key] = row.total;
    totalExpenses += row.total;
  }

  return {
    totalExpenses,
    totalAddedMoney: pocketAgg[0]?.total || 0,
    totalLentMoney: lentAgg[0]?.total || 0,
    lastTotalExpenses,
    categoryWiseExpensesData,
  };
}
