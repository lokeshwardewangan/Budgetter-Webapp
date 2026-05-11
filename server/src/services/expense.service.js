import ExpenseModel, { EXPENSE_CATEGORIES } from '../models/expenses.model.js';
import { ApiError } from '../utils/ApiError.js';
import { getTodayDate } from '../utils/getCurrentDate.js';
import { adjustBalance } from './user.service.js';

const DATE_REGEX = /^([0-2][0-9]|3[01])-(0[1-9]|1[0-2])-\d{4}$/;

function validateProducts(productsArray) {
  if (!Array.isArray(productsArray) || productsArray.length === 0) {
    throw new ApiError(400, 'productsArray must be a non-empty array');
  }
  for (const p of productsArray) {
    if (!p?.name || typeof p.price !== 'number' || Number.isNaN(p.price)) {
      throw new ApiError(400, 'Each product needs a name and numeric price');
    }
    if (!EXPENSE_CATEGORIES.includes(p.category)) {
      throw new ApiError(400, `Invalid category: ${p.category}`);
    }
  }
}

async function upsertProductsForDate(userId, date, productsArray) {
  const existing = await ExpenseModel.findOne({ user: userId, date });
  if (!existing) {
    return ExpenseModel.create({ user: userId, date, products: productsArray });
  }
  existing.products.push(...productsArray);
  await existing.save();
  return existing;
}

export async function addTodayExpenses(userId, productsArray) {
  validateProducts(productsArray);
  const date = getTodayDate();
  const total = productsArray.reduce((sum, p) => sum + p.price, 0);
  const expense = await upsertProductsForDate(userId, date, productsArray);
  const currentPocketMoney = await adjustBalance(userId, -total);
  return { expense, currentPocketMoney, totalDeducted: total };
}

export async function addPastDateExpensesBulk(userId, daysArray) {
  if (!Array.isArray(daysArray) || daysArray.length === 0) {
    throw new ApiError(400, 'pastDaysExpensesArray must be a non-empty array');
  }

  let totalDeducted = 0;
  let daysProcessed = 0;

  for (const day of daysArray) {
    const { date, productsArray } = day || {};
    if (!date || !DATE_REGEX.test(date)) {
      throw new ApiError(400, `Invalid date "${date}", expected dd-mm-yyyy`);
    }
    if (!Array.isArray(productsArray) || productsArray.length === 0) continue;
    validateProducts(productsArray);
    const dayTotal = productsArray.reduce((sum, p) => sum + p.price, 0);
    await upsertProductsForDate(userId, date, productsArray);
    totalDeducted += dayTotal;
    daysProcessed++;
  }

  const currentPocketMoney = await adjustBalance(userId, -totalDeducted);
  return { daysProcessed, totalDeducted, currentPocketMoney };
}

export async function getTodayExpenses(userId) {
  const today = getTodayDate();
  const doc = await ExpenseModel.findOne({ user: userId, date: today }).lean();
  return doc?.products || [];
}

export async function getExpensesByDate(userId, date) {
  if (!date) throw new ApiError(400, 'Date is required');
  return ExpenseModel.findOne({ user: userId, date }).lean();
}

export async function getAllExpenses(userId) {
  return ExpenseModel.find({ user: userId }).sort({ date: -1 }).lean();
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

  if (
    !expenseName ||
    !EXPENSE_CATEGORIES.includes(expenseCategory) ||
    !expenseDate ||
    typeof expensePrice !== 'number' ||
    !DATE_REGEX.test(actualDate) ||
    !DATE_REGEX.test(expenseDate)
  ) {
    throw new ApiError(400, 'Invalid input values');
  }

  const existing = await ExpenseModel.findOne({ user: userId, date: actualDate });
  if (!existing) throw new ApiError(404, 'Expense document not found for actualDate');

  const product = existing.products.find((p) => p._id.toString() === expenseId);
  if (!product) throw new ApiError(404, 'Expense product not found');

  const previousPrice = product.price;
  if (typeof previousPrice !== 'number') throw new ApiError(500, 'Previous price is invalid');

  if (actualDate === expenseDate) {
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
      {
        name: expenseName,
        price: expensePrice,
        category: expenseCategory,
        label: selectedLabel,
      },
    ]);
  }

  // Refund the old price, charge the new one (net effect: refund delta).
  const delta = previousPrice - expensePrice;
  const currentPocketMoney = await adjustBalance(userId, delta);
  return { currentPocketMoney };
}

export async function deleteExpenseProduct(userId, body) {
  const { expenseId, expenseDate, isAddPriceToPocketMoney } = body;
  if (!expenseDate || !DATE_REGEX.test(expenseDate)) {
    throw new ApiError(400, 'Invalid expenseDate, expected dd-mm-yyyy');
  }

  const doc = await ExpenseModel.findOne(
    { user: userId, date: expenseDate, 'products._id': expenseId },
    { 'products.$': 1 },
  );
  const product = doc?.products?.[0];
  if (!product) throw new ApiError(404, 'Expense not found');

  const price = product.price;

  const updated = await ExpenseModel.findOneAndUpdate(
    { user: userId, date: expenseDate },
    { $pull: { products: { _id: expenseId } } },
    { new: true },
  );

  if (updated && updated.products.length === 0) {
    await ExpenseModel.deleteOne({ _id: updated._id });
  }

  let currentPocketMoney;
  if (isAddPriceToPocketMoney) {
    currentPocketMoney = await adjustBalance(userId, Number(price) || 0);
  }
  return { currentPocketMoney, refunded: !!isAddPriceToPocketMoney };
}
