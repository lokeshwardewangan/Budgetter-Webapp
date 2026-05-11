import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qk } from '@/shared/lib/queryKeys';
import { addPocketMoney, getPocketMoneyHistory } from './api';

export function usePocketMoneyHistory() {
  return useQuery({
    queryKey: qk.pocketMoney.all,
    queryFn: getPocketMoneyHistory,
    select: (res) => res.data,
  });
}

export function useAddPocketMoney() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addPocketMoney,
    onSuccess: () => {
      // Pocket-money list and the user's running balance both change.
      queryClient.invalidateQueries({ queryKey: qk.pocketMoney.all });
      queryClient.invalidateQueries({ queryKey: qk.me });
    },
  });
}
