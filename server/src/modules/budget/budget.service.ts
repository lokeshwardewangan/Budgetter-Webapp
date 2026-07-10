import { StatusCodes } from 'http-status-codes';
import { Types } from 'mongoose';
import BudgetModel from './budget.model.js';
import ExpenseModel from '../expense/expense.model.js';
import { ApiError } from '../../shared/lib/ApiError.js';
import { monthRange } from '../../shared/lib/date.js';

interface CreateBudgetDto {
  category: string;
  limit: number;
  month: number;
  year: number;
}

export async function createBudget(userId: string, data: CreateBudgetDto) {
  const { category, limit, month, year } = data;

  const existing = await BudgetModel.findOne({
    user: userId,
    category,
    month,
    year,
  });

  if (existing) {
    throw new ApiError(
      StatusCodes.CONFLICT,
      `A budget for category "${category}" in ${month}/${year} already exists.`,
    );
  }

  return BudgetModel.create({
    user: userId,
    category,
    limit,
    month,
    year,
  });
}

export async function upsertBudget(userId: string, data: CreateBudgetDto) {
  const { category, limit, month, year } = data;

  return BudgetModel.findOneAndUpdate(
    { user: userId, category, month, year },
    { $set: { limit } },
    { new: true, upsert: true },
  );
}

export async function updateBudget(userId: string, budgetId: string, limit: number) {
  const budget = await BudgetModel.findOne({ _id: budgetId, user: userId });
  if (!budget) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Budget not found.');
  }

  budget.limit = limit;
  await budget.save();
  return budget;
}

export async function deleteBudget(userId: string, budgetId: string) {
  const deleted = await BudgetModel.findOneAndDelete({ _id: budgetId, user: userId });
  if (!deleted) {
    throw new ApiError(StatusCodes.NOT_FOUND, 'Budget not found.');
  }
  return deleted;
}

export async function getBudgets(userId: string, month: number, year: number) {
  return BudgetModel.find({ user: userId, month, year }).sort({ category: 1 }).lean();
}

export interface BudgetStatusItem {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  pacingPercentage: number;
  status: 'Under Control' | 'Running Hot' | 'Budget Exhausted';
}

export async function getBudgetStatus(userId: string, month: number, year: number) {
  const userObj = new Types.ObjectId(userId);
  const { gte, lt } = monthRange(month, year);

  // 1. Get all budgets for the user for this month
  const budgets = await BudgetModel.find({ user: userId, month, year }).lean();

  // 2. Aggregate actual expenses for this month
  const expensesAgg = await ExpenseModel.aggregate<{ _id: string; total: number }>([
    { $match: { user: userObj, date: { $gte: gte, $lt: lt } } },
    { $group: { _id: '$category', total: { $sum: '$price' } } },
  ]);

  const expenseMap = new Map<string, number>();
  let totalSpent = 0;
  for (const row of expensesAgg) {
    expenseMap.set(row._id, row.total);
    totalSpent += row.total;
  }

  const items: BudgetStatusItem[] = [];
  let overallBudget = budgets.find((b) => b.category === 'Overall');

  for (const budget of budgets) {
    if (budget.category === 'Overall') continue;

    const spent = expenseMap.get(budget.category) || 0;
    const remaining = Math.max(0, budget.limit - spent);
    const pacingPercentage = budget.limit > 0 ? (spent / budget.limit) * 100 : 0;

    let status: BudgetStatusItem['status'] = 'Under Control';
    if (pacingPercentage > 90) {
      status = 'Budget Exhausted';
    } else if (pacingPercentage > 70) {
      status = 'Running Hot';
    }

    items.push({
      category: budget.category,
      limit: budget.limit,
      spent,
      remaining,
      pacingPercentage,
      status,
    });
  }

  // Handle Overall budget
  const overallLimit = overallBudget
    ? overallBudget.limit
    : budgets.reduce((sum, b) => sum + (b.category !== 'Overall' ? b.limit : 0), 0);

  const overallRemaining = Math.max(0, overallLimit - totalSpent);
  const overallPacingPercentage = overallLimit > 0 ? (totalSpent / overallLimit) * 100 : 0;
  let overallStatus: BudgetStatusItem['status'] = 'Under Control';
  if (overallPacingPercentage > 90) {
    overallStatus = 'Budget Exhausted';
  } else if (overallPacingPercentage > 70) {
    overallStatus = 'Running Hot';
  }

  const overallStatusItem: BudgetStatusItem = {
    category: 'Overall',
    limit: overallLimit,
    spent: totalSpent,
    remaining: overallRemaining,
    pacingPercentage: overallPacingPercentage,
    status: overallStatus,
  };

  return {
    overall: overallStatusItem,
    categories: items,
    month,
    year,
  };
}
