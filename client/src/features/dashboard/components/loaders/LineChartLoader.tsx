import { Skeleton } from '@/components/ui/skeleton';

export default function LineChartLoader() {
  return (
    <div className="grid w-full grid-cols-7 items-end gap-3 px-2">
      {[120, 80, 45, 95, 60, 30, 140].map((height, index) => (
        <div key={index} className="flex flex-col items-center gap-2">
          <Skeleton
            className="w-full rounded-t-sm"
            style={{ height: `${height}px` }}
          />
          <Skeleton className="h-2.5 w-full" />
        </div>
      ))}
    </div>
  );
}
