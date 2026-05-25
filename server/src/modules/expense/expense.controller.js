import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as expenseService from './expense.service.js';

export const addToday = asyncHandler(async (req, res) => {
  const data = await expenseService.addTodayExpenses(req.userId, req.body?.productsArray);
  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, data, 'Expenses created successfully'));
});

export const addBulk = asyncHandler(async (req, res) => {
  const data = await expenseService.addPastDateExpensesBulk(
    req.userId,
    req.body?.pastDaysExpensesArray,
  );
  res
    .status(StatusCodes.CREATED)
    .json(
      new ApiResponse(
        StatusCodes.CREATED,
        data,
        `${data.daysProcessed} day(s) of expenses created`,
      ),
    );
});

export const getToday = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getTodayExpenses(req.userId);
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        expenses,
        expenses.length ? "Today's expenses found" : 'No expenses for today',
      ),
    );
});

export const getByDate = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getExpensesByDate(req.userId, req.query.date);
  res
    .status(StatusCodes.OK)
    .json(
      new ApiResponse(
        StatusCodes.OK,
        expenses,
        expenses.length ? 'Expenses found' : 'No expenses found',
      ),
    );
});

export const getAll = asyncHandler(async (req, res) => {
  const expenses = await expenseService.getAllExpenses(req.userId);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, expenses, 'All expenses retrieved'));
});

export const feed = asyncHandler(async (req, res) => {
  const data = await expenseService.getExpensesFeed(req.userId, {
    page: Number(req.query.page) || 0,
    limit: Math.min(Number(req.query.limit) || 10, 100),
    month: req.query.month || undefined,
    year: req.query.year || undefined,
    search: req.query.search || undefined,
    category: req.query.category || undefined,
  });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, data, 'Expenses feed retrieved'));
});

export const update = asyncHandler(async (req, res) => {
  const data = await expenseService.updateExpense(req.userId, req.params.productId, {
    expenseName: req.body.expenseName,
    selectedLabel: req.body.selectedLabel,
    expensePrice: req.body.expensePrice,
    expenseCategory: req.body.expenseCategory,
    expenseDate: req.body.expenseDate,
  });
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, data, 'Expense updated successfully'));
});

export const remove = asyncHandler(async (req, res) => {
  const data = await expenseService.deleteExpense(req.userId, req.params.productId, {
    isAddPriceToPocketMoney: req.body.isAddPriceToPocketMoney ?? false,
  });
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, data, 'Expense deleted successfully'));
});
