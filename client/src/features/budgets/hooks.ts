import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qk } from '@/shared/lib/queryKeys';
import {
  createBudget,
  deleteBudget,
  getBudgetStatus,
  getBudgets,
  updateBudget,
} from './api';

export function useBudgets(month: number, year: number) {
  return useQuery({
    queryKey: qk.budgets.list(month, year),
    queryFn: () => getBudgets(month, year),
    select: (res) => res.data,
  });
}

export function useBudgetStatus(month: number, year: number) {
  return useQuery({
    queryKey: qk.budgets.status(month, year),
    queryFn: () => getBudgetStatus(month, year),
    select: (res) => res.data,
  });
}

function useInvalidateBudgets() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: qk.budgets.all });
    queryClient.invalidateQueries({ queryKey: qk.expenses.all });
    queryClient.invalidateQueries({ queryKey: qk.me });
  };
}

export function useCreateBudget() {
  const invalidate = useInvalidateBudgets();
  return useMutation({
    mutationFn: createBudget,
    onSuccess: invalidate,
  });
}

export function useUpdateBudget() {
  const invalidate = useInvalidateBudgets();
  return useMutation({
    mutationFn: updateBudget,
    onSuccess: invalidate,
  });
}

export function useDeleteBudget() {
  const invalidate = useInvalidateBudgets();
  return useMutation({
    mutationFn: deleteBudget,
    onSuccess: invalidate,
  });
}
