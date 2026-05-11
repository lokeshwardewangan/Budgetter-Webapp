import { useQuery } from '@tanstack/react-query';
import { qk } from '@/shared/lib/queryKeys';
import { getMonthlyReport } from './api';

// useMonthlyReport(month, year) — replaces the old useMutation pattern.
// React Query automatically refetches when month/year change and caches by
// (month, year) so jumping back to a previous filter is instant.
export function useMonthlyReport(month: string, year: string) {
  return useQuery({
    queryKey: qk.reports.monthly(month, year),
    queryFn: () => getMonthlyReport({ month, year }),
    select: (res) => res.data,
    enabled: Boolean(month && year),
  });
}
