import { useQuery, useQueryClient } from '@tanstack/react-query';
import { qk } from '@/shared/lib/queryKeys';
import { getCurrentUser } from '@/services/auth';

// Single source of truth for "who am I" once Redux is gone. Components call
// `useMe()` directly; mutations elsewhere invalidate `qk.me` to refresh.
export function useMe() {
  return useQuery({
    queryKey: qk.me,
    queryFn: getCurrentUser,
    select: (res) => res.data,
  });
}

export function useInvalidateMe() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: qk.me });
}
