import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import * as expenseService from '../services/expense.service.js';

export const addToday = asyncHandler(async (req, res) => {
  const data = await expenseService.addTodayExpenses(req.user._id, req.body?.productsArray);
  res.status(201).json(new ApiResponse(201, data, 'Expenses created successfully'));
});

export const addBulk = asyncHandler(async (req, res) => {
  const data = await expenseService.addPastDateExpensesBulk(
    req.user._id,
    req.body?.pastDaysExpensesArray,
  );
  res
    .status(201)
    .json(new ApiResponse(201, data, `${data.daysProcessed} day(s) of expenses created`));
});

export const getToday = asyncHandler(async (req, res) => {
  const products = await expenseService.getTodayExpenses(req.user._id);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        products,
        products.length ? "Today's expenses found" : 'No expenses for today',
      ),
    );
});

export const getByDate = asyncHandler(async (req, res) => {
  const date = req.query.date || req.body?.date;
  const doc = await expenseService.getExpensesByDate(req.user._id, date);
  res.status(200).json(new ApiResponse(200, doc, doc ? 'Expenses found' : 'No expenses found'));
});

export const getAll = asyncHandler(async (req, res) => {
  const docs = await expenseService.getAllExpenses(req.user._id);
  res.status(200).json(new ApiResponse(200, docs, 'All expenses retrieved'));
});

export const feed = asyncHandler(async (req, res) => {
  const data = await expenseService.getExpensesFeed(req.user._id, {
    page: Number(req.query.page) || 0,
    limit: Math.min(Number(req.query.limit) || 10, 100),
    month: req.query.month || undefined,
    year: req.query.year || undefined,
    search: req.query.search || undefined,
    category: req.query.category || undefined,
  });
  res.status(200).json(new ApiResponse(200, data, 'Expenses feed retrieved'));
});

export const update = asyncHandler(async (req, res) => {
  const data = await expenseService.updateExpenseProduct(req.user._id, {
    expenseId: req.params.productId,
    actualDate: req.body.actualDate,
    expenseName: req.body.expenseName,
    selectedLabel: req.body.selectedLabel,
    expensePrice: req.body.expensePrice,
    expenseCategory: req.body.expenseCategory,
    expenseDate: req.body.expenseDate,
  });
  res.status(200).json(new ApiResponse(200, data, 'Expense updated successfully'));
});

export const remove = asyncHandler(async (req, res) => {
  const data = await expenseService.deleteExpenseProduct(req.user._id, {
    expenseId: req.params.productId,
    expenseDate: req.body.expenseDate,
    isAddPriceToPocketMoney: req.body.isAddPriceToPocketMoney ?? false,
  });
  res.status(200).json(new ApiResponse(200, data, 'Expense deleted successfully'));
});
