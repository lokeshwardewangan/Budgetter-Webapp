import ExpenseModel from './expense.model.js';
import { ApiError } from '../../shared/lib/ApiError.js';
import { dayRange, monthRange, startOfToday } from '../../shared/lib/date.js';
import { adjustBalance } from '../user/user.service.js';

// Finds the user's expense doc for the calendar day of `date`. `date` is a Date.
async function findExpenseDocForDay(userId, date) {
  const { gte, lt } = dayRange(date);
  return ExpenseModel.findOne({ user: userId, date: { $gte: gte, $lt: lt } });
}

async function upsertProductsForDate(userId, date, productsArray) {
  const existing = await findExpenseDocForDay(userId, date);
  if (!existing) {
    return ExpenseModel.create({ user: userId, date, products: productsArray });
  }
  existing.products.push(...productsArray);
  await existing.save();
  return existing;
}

export async function addTodayExpenses(userId, productsArray) {
  const total = productsArray.reduce((sum, p) => sum + p.price, 0);
  const expense = await upsertProductsForDate(userId, startOfToday(), productsArray);
  const currentPocketMoney = await adjustBalance(userId, -total);
  return { expense, currentPocketMoney, totalDeducted: total };
}

export async function addPastDateExpensesBulk(userId, daysArray) {
  let totalDeducted = 0;
  let daysProcessed = 0;

  for (const { date, productsArray } of daysArray) {
    const dayTotal = productsArray.reduce((sum, p) => sum + p.price, 0);
    await upsertProductsForDate(userId, date, productsArray);
    totalDeducted += dayTotal;
    daysProcessed++;
  }

  const currentPocketMoney = await adjustBalance(userId, -totalDeducted);
  return { daysProcessed, totalDeducted, currentPocketMoney };
}

export async function getTodayExpenses(userId) {
  const doc = await findExpenseDocForDay(userId, startOfToday());
  return doc?.products || [];
}

export async function getExpensesByDate(userId, date) {
  const { gte, lt } = dayRange(date);
  return ExpenseModel.findOne({ user: userId, date: { $gte: gte, $lt: lt } }).lean();
}

export async function getAllExpenses(userId) {
  return ExpenseModel.find({ user: userId }).sort({ date: -1 }).lean();
}

// Paginated product-level feed with month/year/search/category filters.
export async function getExpensesFeed(
  userId,
  { page = 0, limit = 10, month, year, search, category },
) {
  const match = { user: userId };
  if (month && year) {
    const { gte, lt } = monthRange(month, year);
    match.date = { $gte: gte, $lt: lt };
  } else if (year) {
    const y = Number(year);
    match.date = { $gte: new Date(Date.UTC(y, 0, 1)), $lt: new Date(Date.UTC(y + 1, 0, 1)) };
  } else if (month) {
    match.$expr = { $eq: [{ $month: '$date' }, Number(month)] };
  }

  const productMatch = {};
  if (category) productMatch['product.category'] = category;
  if (search) productMatch['product.name'] = { $regex: search, $options: 'i' };

  const pipeline = [
    { $match: match },
    { $unwind: '$products' },
    { $project: { _id: 0, date: 1, parentId: '$_id', product: '$products' } },
    ...(Object.keys(productMatch).length ? [{ $match: productMatch }] : []),
    {
      $facet: {
        items: [
          { $sort: { date: -1, 'product.createdAt': -1 } },
          { $skip: page * limit },
          { $limit: limit },
        ],
        total: [{ $count: 'count' }],
      },
    },
  ];

  const [result] = await ExpenseModel.aggregate(pipeline);
  const items = result?.items || [];
  const total = result?.total?.[0]?.count || 0;
  return { items, total, page, limit, hasMore: (page + 1) * limit < total };
}

export async function updateExpenseProduct(userId, body) {
  const {
    expenseId,
    actualDate,
    expenseName,
    selectedLabel,
    expensePrice,
    expenseCategory,
    expenseDate,
  } = body;

  const existing = await findExpenseDocForDay(userId, actualDate);
  if (!existing) throw new ApiError(404, 'Expense document not found for actualDate');

  const product = existing.products.find((p) => p._id.toString() === expenseId);
  if (!product) throw new ApiError(404, 'Expense product not found');

  const previousPrice = product.price;
  const sameDay = dayRange(actualDate).gte.getTime() === dayRange(expenseDate).gte.getTime();

  if (sameDay) {
    product.name = expenseName;
    product.price = expensePrice;
    product.category = expenseCategory;
    product.label = selectedLabel;
    await existing.save();
  } else {
    existing.products.pull({ _id: expenseId });
    if (existing.products.length === 0) {
      await ExpenseModel.deleteOne({ _id: existing._id });
    } else {
      await existing.save();
    }
    await upsertProductsForDate(userId, expenseDate, [
      { name: expenseName, price: expensePrice, category: expenseCategory, label: selectedLabel },
    ]);
  }

  const delta = previousPrice - expensePrice;
  const currentPocketMoney = await adjustBalance(userId, delta);
  return { currentPocketMoney };
}

export async function deleteExpenseProduct(userId, body) {
  const { expenseId, expenseDate, isAddPriceToPocketMoney } = body;
  const { gte, lt } = dayRange(expenseDate);

  const doc = await ExpenseModel.findOne(
    { user: userId, date: { $gte: gte, $lt: lt }, 'products._id': expenseId },
    { 'products.$': 1 },
  );
  const product = doc?.products?.[0];
  if (!product) throw new ApiError(404, 'Expense not found');

  const price = product.price;

  const updated = await ExpenseModel.findOneAndUpdate(
    { user: userId, date: { $gte: gte, $lt: lt } },
    { $pull: { products: { _id: expenseId } } },
    { new: true },
  );

  if (updated && updated.products.length === 0) {
    await ExpenseModel.deleteOne({ _id: updated._id });
  }

  let currentPocketMoney;
  if (isAddPriceToPocketMoney) {
    currentPocketMoney = await adjustBalance(userId, price || 0);
  }
  return { currentPocketMoney, refunded: !!isAddPriceToPocketMoney };
}
