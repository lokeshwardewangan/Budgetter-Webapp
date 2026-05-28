import { Skeleton } from '@/components/ui/skeleton';

export default function TopHeaderLoader() {
  return (
    <div className="sticky top-0 z-10 flex h-16 w-full items-center justify-between bg-bg_primary_light px-4 shadow-sm dark:bg-bg_primary_dark sm:px-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-7 w-7" />
        <Skeleton className="h-5 w-32 sm:w-40" />
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="hidden h-10 w-10 rounded-full sm:block" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    </div>
  );
}
