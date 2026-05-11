import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qk } from '@/shared/lib/queryKeys';
import { addLentMoney, getLentMoneyHistory, markLentMoneyReceived } from './api';

export function useLentMoneyHistory() {
  return useQuery({
    queryKey: qk.lentMoney.all,
    queryFn: getLentMoneyHistory,
    select: (res) => res.data,
  });
}

export function useAddLentMoney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addLentMoney,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.lentMoney.all });
      queryClient.invalidateQueries({ queryKey: qk.me });
    },
  });
}

export function useMarkLentMoneyReceived() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markLentMoneyReceived,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.lentMoney.all });
      queryClient.invalidateQueries({ queryKey: qk.me });
    },
  });
}
