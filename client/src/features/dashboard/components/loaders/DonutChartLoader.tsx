import { Skeleton } from '@/components/ui/skeleton';

export default function DonutChartLoader() {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-6 px-3 py-6 sm:flex-row sm:gap-7">
      <div className="relative flex items-center justify-center">
        <Skeleton className="h-40 w-40 rounded-full" />
        <div className="absolute inset-7 flex flex-col items-center justify-center gap-1 rounded-full bg-bg_primary_light dark:bg-bg_primary_dark">
          <Skeleton className="h-5 w-14" />
          <Skeleton className="h-5 w-10" />
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:flex-col sm:items-start sm:justify-start">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4 rounded-sm" />
            <Skeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}
