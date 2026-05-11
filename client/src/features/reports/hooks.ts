import { useInfiniteQuery } from '@tanstack/react-query';
import { qk, type ExpenseFilters } from '@/shared/lib/queryKeys';
import { getExpensesFeed } from './api';

// Top-10 (or whatever limit) per page, fetched lazily as the user scrolls.
// React Query handles caching + dedupe across filter changes.
export function useExpensesFeed(filters: ExpenseFilters) {
  const limit = filters.limit ?? 10;
  return useInfiniteQuery({
    queryKey: qk.expenses.paged(filters),
    queryFn: ({ pageParam = 0 }) =>
      getExpensesFeed({ ...filters, page: pageParam as number, limit }),
    initialPageParam: 0,
    getNextPageParam: (last) =>
      last.data.hasMore ? last.data.page + 1 : undefined,
  });
}
