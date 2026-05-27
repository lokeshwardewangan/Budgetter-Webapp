import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { qk } from '@/shared/lib/queryKeys';
import { deleteOtherSessions, deleteSession, getSessions } from './api';

// `enabled` lets a popover decide when to actually fetch — by default the
// query stays idle until consumer opts in (avoids loading the list before
// the user opens the popover).
export function useSessions(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: qk.sessions.all,
    queryFn: getSessions,
    select: (res) => res.data,
    enabled: options?.enabled ?? true,
  });
}

export function useDeleteSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.sessions.all });
    },
  });
}

export function useDeleteOtherSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteOtherSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: qk.sessions.all });
    },
  });
}
