import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as expenseService from './expense.service.js';
import type { ExpenseCategory } from './expense.model.js';

export const addToday = asyncHandler(async (req, res) => {
  const data = await expenseService.addTodayExpenses(req.userId as string, req.body?.productsArray);
  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, data, 'Expenses created successfully'));
});

export const addBulk = asyncHandler(async (req, res) => {
  const data = await expenseService.addPastDateExpensesBulk(
    req.userId as string,
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
  const expenses = await expenseService.getTodayExpenses(req.userId as string);
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
  const expenses = await expenseService.getExpensesByDate(
    req.userId as string,
    req.query.date as unknown as Date,
  );
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
  const expenses = await expenseService.getAllExpenses(req.userId as string);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, expenses, 'All expenses retrieved'));
});

export const feed = asyncHandler(async (req, res) => {
  const data = await expenseService.getExpensesFeed(req.userId as string, {
    page: Number(req.query.page) || 0,
    limit: Math.min(Number(req.query.limit) || 10, 100),
    month: (req.query.month as string) || undefined,
    year: (req.query.year as string) || undefined,
    search: (req.query.search as string) || undefined,
    category: (req.query.category as ExpenseCategory) || undefined,
  });
  res.status(StatusCodes.OK).json(new ApiResponse(StatusCodes.OK, data, 'Expenses feed retrieved'));
});

export const update = asyncHandler(async (req, res) => {
  const data = await expenseService.updateExpense(
    req.userId as string,
    req.params.productId as string,
    {
      expenseName: req.body.expenseName,
      selectedLabel: req.body.selectedLabel,
      expensePrice: req.body.expensePrice,
      expenseCategory: req.body.expenseCategory,
      expenseDate: req.body.expenseDate,
    },
  );
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, data, 'Expense updated successfully'));
});

export const remove = asyncHandler(async (req, res) => {
  const data = await expenseService.deleteExpense(
    req.userId as string,
    req.params.productId as string,
    {
      isAddPriceToPocketMoney: req.body.isAddPriceToPocketMoney ?? false,
    },
  );
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, data, 'Expense deleted successfully'));
});
