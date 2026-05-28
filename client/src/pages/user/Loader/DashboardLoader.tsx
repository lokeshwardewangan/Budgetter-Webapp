import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardLoader() {
  return (
    <div className="flex w-full flex-col items-start justify-start gap-5">
      <Skeleton className="h-8 w-56 sm:w-72" />

      <div className="flex w-full flex-wrap items-center gap-3 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      <div className="flex w-full flex-col gap-4 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
        <Skeleton className="h-5 w-44" />
        <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full rounded-[10px]" />
          ))}
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-md border border-border_light bg-bg_primary_light p-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
          <Skeleton className="mb-5 h-5 w-40" />
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
            <Skeleton className="h-40 w-40 rounded-full" />
            <div className="flex w-full flex-col gap-3 sm:w-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-md border border-border_light bg-bg_primary_light p-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
          <Skeleton className="mb-5 h-5 w-40" />
          <div className="grid w-full grid-cols-7 items-end gap-3 px-1">
            {[120, 80, 45, 95, 60, 30, 140].map((h, i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <Skeleton
                  className="w-full rounded-t-sm"
                  style={{ height: `${h}px` }}
                />
                <Skeleton className="h-2.5 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full rounded-md border border-border_light bg-bg_primary_light p-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
        <Skeleton className="mb-5 h-5 w-56" />
        <div className="flex w-full flex-col gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
