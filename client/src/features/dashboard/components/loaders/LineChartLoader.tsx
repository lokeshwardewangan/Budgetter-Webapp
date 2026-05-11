export default function LineChartLoader() {
  return (
    <div className="grid w-full grid-cols-7 items-end gap-3 px-2">
      {[120, 80, 45, 95, 60, 30, 140].map((height, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div
            className="col-span-1 animate-pulse rounded-t-sm bg-slate-400 dark:bg-slate-700"
            style={{ height: `${height}px` }}
          />
          <span className="h-2.5 w-full rounded-sm bg-slate-400 dark:bg-slate-700" />
        </div>
      ))}
    </div>
  );
}
