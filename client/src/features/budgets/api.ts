import { apiURL } from '@/lib/http';

export interface Budget {
  _id: string;
  category: string;
  limit: number;
  month: number;
  year: number;
  createdAt: string;
  updatedAt: string;
}

export interface BudgetStatusItem {
  category: string;
  limit: number;
  spent: number;
  remaining: number;
  percentageSpent: number;
  status: 'UNDER_LIMIT' | 'RUNNING_HOT' | 'EXHAUSTED';
}

export interface BudgetStatusResponse {
  overall: {
    limit: number;
    spent: number;
    remaining: number;
    percentageSpent: number;
    status: 'UNDER_LIMIT' | 'RUNNING_HOT' | 'EXHAUSTED';
  };
  categories: BudgetStatusItem[];
}

export async function getBudgets(month: number, year: number) {
  const res = await apiURL.get<{ data: Budget[] }>('/budgets', {
    params: { month, year },
  });
  return res.data;
}

export async function getBudgetStatus(month: number, year: number) {
  const res = await apiURL.get<{ data: BudgetStatusResponse }>(
    '/budgets/status',
    {
      params: { month, year },
    }
  );
  return res.data;
}

export async function createBudget(data: {
  category: string;
  limit: number;
  month: number;
  year: number;
}) {
  const res = await apiURL.post<{ data: Budget }>('/budgets', data);
  return res.data;
}

export async function updateBudget({
  budgetId,
  limit,
}: {
  budgetId: string;
  limit: number;
}) {
  const res = await apiURL.patch<{ data: Budget }>(`/budgets/${budgetId}`, {
    limit,
  });
  return res.data;
}

export async function deleteBudget(budgetId: string) {
  const res = await apiURL.delete(`/budgets/${budgetId}`);
  return res.data;
}
