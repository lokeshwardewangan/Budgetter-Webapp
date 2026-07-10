import { StatusCodes } from 'http-status-codes';
import asyncHandler from '../../shared/lib/asyncHandler.js';
import { ApiResponse } from '../../shared/lib/ApiResponse.js';
import * as budgetService from './budget.service.js';

export const create = asyncHandler(async (req, res) => {
  const budget = await budgetService.createBudget(req.userId as string, req.body);
  res
    .status(StatusCodes.CREATED)
    .json(new ApiResponse(StatusCodes.CREATED, budget, 'Budget created successfully'));
});

export const update = asyncHandler(async (req, res) => {
  const budgetId = req.params.budgetId as string;
  const { limit } = req.body;
  const budget = await budgetService.updateBudget(req.userId as string, budgetId, limit);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, budget, 'Budget updated successfully'));
});

export const remove = asyncHandler(async (req, res) => {
  const budgetId = req.params.budgetId as string;
  const budget = await budgetService.deleteBudget(req.userId as string, budgetId);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, budget, 'Budget deleted successfully'));
});

export const list = asyncHandler(async (req, res) => {
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  const budgets = await budgetService.getBudgets(req.userId as string, month, year);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, budgets, 'Budgets retrieved successfully'));
});

export const status = asyncHandler(async (req, res) => {
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  const statusInfo = await budgetService.getBudgetStatus(req.userId as string, month, year);
  res
    .status(StatusCodes.OK)
    .json(new ApiResponse(StatusCodes.OK, statusInfo, 'Budget status calculated successfully'));
});
