import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qk } from '@/shared/lib/queryKeys';
import {
  addExpensesBulk,
  deleteExpense,
  editExpense,
  getAllExpenses,
  getExpensesByDate,
  getTodayExpenses,
} from './api';

export function useTodayExpenses() {
  return useQuery({
    queryKey: qk.expenses.today(),
    queryFn: getTodayExpenses,
    select: (res) => res.data,
  });
}

export function useExpensesByDate(date: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: qk.expenses.byDate(date),
    queryFn: () => getExpensesByDate(date),
    select: (res) => res.data,
    enabled: options?.enabled ?? !!date,
  });
}

export function useAllExpenses() {
  return useQuery({
    queryKey: qk.expenses.list(),
    queryFn: getAllExpenses,
    select: (res) => res.data,
  });
}

// Single broad invalidator used by every mutation. Hits today, by-date, list,
// and paged variants in one go since they all share the `qk.expenses.all`
// prefix. Also nudges `/me` so the running balance refreshes.
function useInvalidateExpenses() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: qk.expenses.all });
    queryClient.invalidateQueries({ queryKey: qk.me });
  };
}

export function useAddExpenses() {
  const invalidate = useInvalidateExpenses();
  return useMutation({
    mutationFn: addExpensesBulk,
    onSuccess: invalidate,
  });
}

export function useEditExpense() {
  const invalidate = useInvalidateExpenses();
  return useMutation({
    mutationFn: editExpense,
    onSuccess: invalidate,
  });
}

export function useDeleteExpense() {
  const invalidate = useInvalidateExpenses();
  return useMutation({
    mutationFn: deleteExpense,
    onSuccess: invalidate,
  });
}
