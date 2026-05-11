import ExpenseModel, { EXPENSE_CATEGORIES } from '../models/expenses.model.js';
import PocketMoneyModel from '../models/pocketMoney.model.js';
import LentMoneyModel from '../models/lentMoney.model.js';
import { ApiError } from '../utils/ApiError.js';

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
  if (typeof month !== 'string' || typeof year !== 'string') {
    throw new ApiError(400, 'month and year must be strings (e.g. month="03", year="2025")');
  }

  const dateRegex = `^\\d{2}-${month}-${year}`;

  const [monthExpenses, lastExpenseDoc, pocketAgg, lentAgg] = await Promise.all([
    ExpenseModel.find({ user: userId, date: { $regex: dateRegex } }).lean(),
    ExpenseModel.findOne({ user: userId }).sort({ _id: -1 }).lean(),
    PocketMoneyModel.aggregate([
      { $match: { user: userId } },
      {
        $addFields: {
          parts: { $split: ['$date', '-'] },
        },
      },
      { $match: { 'parts.1': month } },
      { $group: { _id: null, total: { $sum: { $toDouble: '$amount' } } } },
    ]),
    LentMoneyModel.aggregate([
      { $match: { user: userId } },
      {
        $addFields: {
          parts: { $split: ['$date', '-'] },
        },
      },
      { $match: { 'parts.1': month } },
      { $group: { _id: null, total: { $sum: { $toDouble: '$price' } } } },
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
    lastExpenseDoc?.products?.reduce((acc, p) => acc + (Number(p.price) || 0), 0) || 0;

  return {
    totalExpenses,
    totalAddedMoney: pocketAgg[0]?.total || 0,
    totalLentMoney: lentAgg[0]?.total || 0,
    lastTotalExpenses,
    categoryWiseExpensesData,
  };
}
