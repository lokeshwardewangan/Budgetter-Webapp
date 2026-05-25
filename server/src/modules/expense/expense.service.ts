import { StatusCodes } from 'http-status-codes';
import ExpenseModel from './expense.model.js';
import { ApiError } from '../../shared/lib/ApiError.js';
import { dayRange, monthRange, startOfToday } from '../../shared/lib/date.js';
import { adjustBalance } from '../user/user.service.js';
import type { ExpenseCategory } from './expense.model.js';

interface Product {
  name: string;
  price: number;
  category: ExpenseCategory;
  label?: string | null;
}

interface DayBucket {
  date: Date;
  productsArray: Product[];
}

export async function addTodayExpenses(userId: string, productsArray: Product[]) {
  const date = startOfToday();
  const total = productsArray.reduce((sum, p) => sum + p.price, 0);
  const expenses = await ExpenseModel.insertMany(
    productsArray.map((p) => ({ user: userId, date, ...p })),
  );
  const currentPocketMoney = await adjustBalance(userId, -total);
  return { expenses, currentPocketMoney, totalDeducted: total };
}

export async function addPastDateExpensesBulk(userId: string, daysArray: DayBucket[]) {
  const docs: Array<Product & { user: string; date: Date }> = [];
  let totalDeducted = 0;

  for (const { date, productsArray } of daysArray) {
    for (const p of productsArray) {
      docs.push({ user: userId, date, ...p });
      totalDeducted += p.price;
    }
  }

  const expenses = await ExpenseModel.insertMany(docs);
  const currentPocketMoney = await adjustBalance(userId, -totalDeducted);
  return { daysProcessed: daysArray.length, totalDeducted, currentPocketMoney, expenses };
}

export async function getTodayExpenses(userId: string) {
  const { gte, lt } = dayRange(startOfToday());
  return ExpenseModel.find({ user: userId, date: { $gte: gte, $lt: lt } })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getExpensesByDate(userId: string, date: Date) {
  const { gte, lt } = dayRange(date);
  return ExpenseModel.find({ user: userId, date: { $gte: gte, $lt: lt } })
    .sort({ createdAt: -1 })
    .lean();
}

export async function getAllExpenses(userId: string) {
  return ExpenseModel.find({ user: userId }).sort({ date: -1, createdAt: -1 }).lean();
}

interface FeedFilters {
  page?: number;
  limit?: number;
  month?: string;
  year?: string;
  search?: string;
  category?: ExpenseCategory;
}

export async function getExpensesFeed(
  userId: string,
  { page = 0, limit = 10, month, year, search, category }: FeedFilters,
) {
  const match: Record<string, unknown> = { user: userId };
  if (month && year) {
    const { gte, lt } = monthRange(month, year);
    match.date = { $gte: gte, $lt: lt };
  } else if (year) {
    const y = Number(year);
    match.date = { $gte: new Date(Date.UTC(y, 0, 1)), $lt: new Date(Date.UTC(y + 1, 0, 1)) };
  } else if (month) {
    match.$expr = { $eq: [{ $month: '$date' }, Number(month)] };
  }
  if (category) match.category = category;
  if (search) match.name = { $regex: search, $options: 'i' };

  const [items, total] = await Promise.all([
    ExpenseModel.find(match)
      .sort({ date: -1, createdAt: -1 })
      .skip(page * limit)
      .limit(limit)
      .lean(),
    ExpenseModel.countDocuments(match),
  ]);

  return { items, total, page, limit, hasMore: (page + 1) * limit < total };
}

interface UpdateExpenseBody {
  expenseName: string;
  selectedLabel?: string | null;
  expensePrice: number;
  expenseCategory: ExpenseCategory;
  expenseDate?: Date;
}

export async function updateExpense(userId: string, expenseId: string, body: UpdateExpenseBody) {
  const { expenseName, expensePrice, expenseCategory, expenseDate, selectedLabel } = body;

  const existing = await ExpenseModel.findOne({ _id: expenseId, user: userId });
  if (!existing) throw new ApiError(StatusCodes.NOT_FOUND, 'Expense not found');

  const previousPrice = existing.price;
  existing.name = expenseName;
  existing.price = expensePrice;
  existing.category = expenseCategory;
  if (expenseDate) existing.date = expenseDate;
  if (selectedLabel !== undefined) existing.label = selectedLabel;
  await existing.save();

  const delta = previousPrice - expensePrice;
  const currentPocketMoney = await adjustBalance(userId, delta);
  return { expense: existing, currentPocketMoney };
}

export async function deleteExpense(
  userId: string,
  expenseId: string,
  { isAddPriceToPocketMoney }: { isAddPriceToPocketMoney: boolean },
) {
  const existing = await ExpenseModel.findOneAndDelete({ _id: expenseId, user: userId });
  if (!existing) throw new ApiError(StatusCodes.NOT_FOUND, 'Expense not found');

  let currentPocketMoney: number | undefined;
  if (isAddPriceToPocketMoney) {
    currentPocketMoney = await adjustBalance(userId, existing.price || 0);
  }
  return { currentPocketMoney, refunded: !!isAddPriceToPocketMoney };
}
