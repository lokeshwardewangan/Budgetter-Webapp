import ExpenseModel, { EXPENSE_CATEGORIES } from '../expense/expense.model.js';
import PocketMoneyModel from '../pocketMoney/pocketMoney.model.js';
import LentMoneyModel from '../lentMoney/lentMoney.model.js';
import { monthRange } from '../../shared/lib/date.js';

const CATEGORY_KEY_MAP = {
  Groceries: 'GroceriesExpenses',
  'Housing & Utilities': 'Housing_UtilitiesExpenses',
  Medical: 'MedicalExpenses',
  Food: 'FoodExpenses',
  Personal: 'PersonalExpenses',
  Educational: 'EducationalExpenses',
  Transportation: 'TransportationExpenses',
  Miscellaneous: 'MiscellaneousExpenses',
};

function emptyCategoryBreakdown() {
  return EXPENSE_CATEGORIES.reduce((acc, cat) => {
    acc[CATEGORY_KEY_MAP[cat]] = 0;
    return acc;
  }, {});
}

export async function monthlyReport(userId, { month, year }) {
  const { gte, lt } = monthRange(month, year);
  const range = { $gte: gte, $lt: lt };

  const [monthExpenses, lastExpenseDoc, pocketAgg, lentAgg] = await Promise.all([
    ExpenseModel.find({ user: userId, date: range }).lean(),
    ExpenseModel.findOne({ user: userId }).sort({ _id: -1 }).lean(),
    PocketMoneyModel.aggregate([
      { $match: { user: userId, date: range } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]),
    LentMoneyModel.aggregate([
      { $match: { user: userId, date: range } },
      { $group: { _id: null, total: { $sum: '$price' } } },
    ]),
  ]);

  const categoryWiseExpensesData = emptyCategoryBreakdown();
  let totalExpenses = 0;
  for (const doc of monthExpenses) {
    for (const product of doc.products || []) {
      const key = CATEGORY_KEY_MAP[product.category];
      if (key) categoryWiseExpensesData[key] += product.price;
      totalExpenses += product.price;
    }
  }

  const lastTotalExpenses =
    lastExpenseDoc?.products?.reduce((acc, p) => acc + (p.price || 0), 0) || 0;

  return {
    totalExpenses,
    totalAddedMoney: pocketAgg[0]?.total || 0,
    totalLentMoney: lentAgg[0]?.total || 0,
    lastTotalExpenses,
    categoryWiseExpensesData,
  };
}
