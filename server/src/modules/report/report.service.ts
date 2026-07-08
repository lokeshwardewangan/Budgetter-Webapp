import { Types } from 'mongoose';
import ExpenseModel, {
  EXPENSE_CATEGORIES,
  type ExpenseCategory,
} from '../expense/expense.model.js';
import PocketMoneyModel from '../pocketMoney/pocketMoney.model.js';
import LentMoneyModel from '../lentMoney/lentMoney.model.js';
import { monthRange, getElapsedAndRemainingDays } from '../../shared/lib/date.js';

export function getCategoryKey(category: string): string {
  return category.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') + 'Expenses';
}

const CATEGORY_KEY_MAP = Object.fromEntries(
  EXPENSE_CATEGORIES.map((cat) => [cat, getCategoryKey(cat)]),
) as Record<ExpenseCategory, string>;

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
  const userObj = new Types.ObjectId(userId);
  const monthNum = Number(month);
  const yearNum = Number(year);
  const { gte, lt } = monthRange(monthNum, yearNum);
  const range = { $gte: gte, $lt: lt };

  // Calculate elapsed & remaining days in month
  const { elapsed, remaining, total: totalDays } = getElapsedAndRemainingDays(monthNum, yearNum);

  // Immediately preceding month for MoM velocity
  let prevMonth = monthNum - 1;
  let prevYear = yearNum;
  if (prevMonth === 0) {
    prevMonth = 12;
    prevYear -= 1;
  }
  const prevRange = monthRange(prevMonth, prevYear);

  // Last month with any expense activity, used as the "previous period" total for backward compat.
  const lastEntry = await ExpenseModel.findOne({ user: userObj }).sort({ date: -1 }).lean();
  let lastTotalExpenses = 0;
  if (lastEntry) {
    const lastDate = lastEntry.date instanceof Date ? lastEntry.date : new Date(lastEntry.date);
    if (!Number.isNaN(lastDate.getTime())) {
      const prev = monthRange(lastDate.getUTCMonth() + 1, lastDate.getUTCFullYear());
      const lastAgg = await ExpenseModel.aggregate<{ _id: null; total: number }>([
        { $match: { user: userObj, date: { $gte: prev.gte, $lt: prev.lt } } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]);
      lastTotalExpenses = lastAgg[0]?.total || 0;
    }
  }

  const [expensesAgg, pocketAgg, lentAgg, prevMonthAgg, weekendAgg, highestSpendAgg] =
    await Promise.all([
      ExpenseModel.aggregate<{ _id: ExpenseCategory; total: number }>([
        { $match: { user: userObj, date: range } },
        { $group: { _id: '$category', total: { $sum: '$price' } } },
      ]),
      PocketMoneyModel.aggregate<{ _id: null; total: number }>([
        { $match: { user: userObj, date: range } },
        { $group: { _id: null, total: { $sum: '$amount' } } },
      ]),
      // Lent money is outstanding debt — sum ALL unreceived regardless of when
      // it was lent. The month filter doesn't fit "money still owed to you".
      LentMoneyModel.aggregate<{ _id: null; total: number }>([
        { $match: { user: userObj, isReceived: false } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
      ExpenseModel.aggregate<{ _id: null; total: number }>([
        { $match: { user: userObj, date: { $gte: prevRange.gte, $lt: prevRange.lt } } },
        { $group: { _id: null, total: { $sum: '$price' } } },
      ]),
      ExpenseModel.aggregate<{ _id: 'weekend' | 'weekday'; total: number }>([
        { $match: { user: userObj, date: range } },
        {
          $project: {
            price: 1,
            dayOfWeek: { $dayOfWeek: '$date' },
          },
        },
        {
          $group: {
            _id: {
              $cond: {
                if: { $in: ['$dayOfWeek', [1, 7]] }, // Sunday (1) or Saturday (7)
                then: 'weekend',
                else: 'weekday',
              },
            },
            total: { $sum: '$price' },
          },
        },
      ]),
      ExpenseModel.aggregate<{ _id: number; total: number }>([
        { $match: { user: userObj, date: range } },
        {
          $group: {
            _id: { $dayOfMonth: '$date' },
            total: { $sum: '$price' },
          },
        },
        { $sort: { total: -1 } },
        { $limit: 1 },
      ]),
    ]);

  const categoryWiseExpensesData = emptyCategoryBreakdown();
  let totalExpenses = 0;
  for (const row of expensesAgg) {
    const key = CATEGORY_KEY_MAP[row._id];
    if (key) categoryWiseExpensesData[key] = row.total;
    totalExpenses += row.total;
  }

  const weekendExpenses = weekendAgg.find((r) => r._id === 'weekend')?.total || 0;
  const weekdayExpenses = weekendAgg.find((r) => r._id === 'weekday')?.total || 0;
  const highestSpendDay = highestSpendAgg[0]
    ? { day: highestSpendAgg[0]._id, amount: highestSpendAgg[0].total }
    : null;

  return {
    totalExpenses,
    totalAddedMoney: pocketAgg[0]?.total || 0,
    totalLentMoney: lentAgg[0]?.total || 0,
    lastTotalExpenses,
    prevMonthExpenses: prevMonthAgg[0]?.total || 0,
    categoryWiseExpensesData,
    totalDays,
    elapsedDays: elapsed,
    remainingDays: remaining,
    weekendExpenses,
    weekdayExpenses,
    highestSpendDay,
  };
}
