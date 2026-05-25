import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { Expense } from '@/types/api/expenses/expenses';

export type ProductInput = {
  name: string;
  price: number;
  category: string;
  label: string | null;
};

export type BulkAddInput = {
  pastDaysExpensesArray: Array<{
    date: string;
    productsArray: ProductInput[];
  }>;
};

export type EditExpenseInput = {
  expenseId: string;
  expenseName: string;
  expensePrice: number;
  expenseCategory: string;
  expenseDate?: string;
  selectedLabel: string | null;
};

export type DeleteExpenseInput = {
  expenseId: string;
  isAddPriceToPocketMoney: boolean;
};

// --- Queries ---------------------------------------------------------------

export async function getTodayExpenses(): Promise<ApiResponse<Expense[]>> {
  const { data } = await apiURL.get<ApiResponse<Expense[]>>(
    endpoints.expenses.today
  );
  return data;
}

export async function getExpensesByDate(
  date: string
): Promise<ApiResponse<Expense[]>> {
  const { data } = await apiURL.get<ApiResponse<Expense[]>>(
    endpoints.expenses.byDate,
    {
      params: { date },
    }
  );
  return data;
}

export async function getAllExpenses(): Promise<ApiResponse<Expense[]>> {
  const { data } = await apiURL.get<ApiResponse<Expense[]>>(
    endpoints.expenses.list
  );
  return data;
}

// --- Mutations -------------------------------------------------------------

export async function addExpensesBulk(
  input: BulkAddInput
): Promise<ApiResponse<unknown>> {
  const { data } = await apiURL.post<ApiResponse<unknown>>(
    endpoints.expenses.bulk,
    input
  );
  return data;
}

export async function editExpense(
  input: EditExpenseInput
): Promise<ApiResponse<unknown>> {
  const { expenseId, ...body } = input;
  const { data } = await apiURL.patch<ApiResponse<unknown>>(
    endpoints.expenses.product(expenseId),
    body
  );
  return data;
}

export async function deleteExpense(
  input: DeleteExpenseInput
): Promise<ApiResponse<unknown>> {
  const { expenseId, ...body } = input;
  const { data } = await apiURL.delete<ApiResponse<unknown>>(
    endpoints.expenses.product(expenseId),
    { data: body }
  );
  return data;
}
