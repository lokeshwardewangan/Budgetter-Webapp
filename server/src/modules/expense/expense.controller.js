import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as expenseService from './expense.service.js';

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
  const expenses = await expenseService.getTodayExpenses(req.user._id);
  res
    .status(200)
    .json(
      new ApiResponse(
        200,
        expenses,
        expenses.length ? "Today's expenses found" : 'No expenses for today',
      ),
    );
});

export const getByDate = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getExpensesByDate(req.user._id, req.query.date);
  res
    .status(200)
    .json(
      new ApiResponse(200, expenses, expenses.length ? 'Expenses found' : 'No expenses found'),
    );
});

export const getAll = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getAllExpenses(req.user._id);
  res.status(200).json(new ApiResponse(200, expenses, 'All expenses retrieved'));
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
  const data = await expenseService.updateExpense(req.user._id, req.params.productId, {
    expenseName: req.body.expenseName,
    selectedLabel: req.body.selectedLabel,
    expensePrice: req.body.expensePrice,
    expenseCategory: req.body.expenseCategory,
    expenseDate: req.body.expenseDate,
  });
  res.status(200).json(new ApiResponse(200, data, 'Expense updated successfully'));
});

export const remove = asyncHandler(async (req, res) => {
  const data = await expenseService.deleteExpense(req.user._id, req.params.productId, {
    isAddPriceToPocketMoney: req.body.isAddPriceToPocketMoney ?? false,
  });
  res.status(200).json(new ApiResponse(200, data, 'Expense deleted successfully'));
});
