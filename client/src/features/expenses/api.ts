import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { ExpenseEntry, ExpenseProduct } from '@/types/api/expenses/expenses';

// One product row inside the bulk envelope.
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
  expenseId: string; // product _id
  actualDate: string; // parent doc date (dd-mm-yyyy)
  expenseName: string;
  expensePrice: number;
  expenseCategory: string;
  expenseDate: string; // new dd-mm-yyyy (may differ from actualDate)
  selectedLabel: string | null;
};

export type DeleteExpenseInput = {
  expenseId: string; // product _id
  expenseDate: string; // dd-mm-yyyy
  isAddPriceToPocketMoney: boolean;
};

// --- Queries ---------------------------------------------------------------

export async function getTodayExpenses(): Promise<ApiResponse<ExpenseProduct[]>> {
  const { data } = await apiURL.get<ApiResponse<ExpenseProduct[]>>(endpoints.expenses.today);
  return data;
}

export async function getExpensesByDate(
  date: string,
): Promise<ApiResponse<ExpenseEntry | null>> {
  const { data } = await apiURL.get<ApiResponse<ExpenseEntry | null>>(
    endpoints.expenses.byDate,
    { params: { date } },
  );
  return data;
}

export async function getAllExpenses(): Promise<ApiResponse<ExpenseEntry[]>> {
  const { data } = await apiURL.get<ApiResponse<ExpenseEntry[]>>(endpoints.expenses.list);
  return data;
}

// --- Mutations -------------------------------------------------------------

export async function addExpensesBulk(input: BulkAddInput): Promise<ApiResponse<unknown>> {
  const { data } = await apiURL.post<ApiResponse<unknown>>(endpoints.expenses.bulk, input);
  return data;
}

export async function editExpense(input: EditExpenseInput): Promise<ApiResponse<unknown>> {
  const { expenseId, ...body } = input;
  const { data } = await apiURL.patch<ApiResponse<unknown>>(
    endpoints.expenses.product(expenseId),
    body,
  );
  return data;
}

export async function deleteExpense(input: DeleteExpenseInput): Promise<ApiResponse<unknown>> {
  const { expenseId, ...body } = input;
  const { data } = await apiURL.delete<ApiResponse<unknown>>(
    endpoints.expenses.product(expenseId),
    { data: body },
  );
  return data;
}
