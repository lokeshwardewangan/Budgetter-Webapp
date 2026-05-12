import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { ExpenseProduct } from '@/types/api/expenses/expenses';

export type ExpenseFeedRow = {
  date: string;
  parentId: string;
  product: ExpenseProduct;
};

export type ExpenseFeedPage = {
  items: ExpenseFeedRow[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
};

export type ExpenseFeedFilters = {
  page?: number;
  limit?: number;
  month?: string;
  year?: string;
  search?: string;
  category?: string;
};

export async function getExpensesFeed(
  filters: ExpenseFeedFilters
): Promise<ApiResponse<ExpenseFeedPage>> {
  const { data } = await apiURL.get<ApiResponse<ExpenseFeedPage>>(
    endpoints.expenses.feed,
    {
      params: filters,
    }
  );
  return data;
}
