export default function DonutChartLoader() {
  return (
    <div className="chart_element_container flex w-full animate-pulse flex-col items-center justify-center gap-x-7 gap-y-5 px-3 py-6 sm:flex-row">
      <div className="left_chart_container flex items-center justify-center">
        <div className="chart_loader relative h-40 w-40 rounded-full">
          <div className="absolute inset-7 flex items-center justify-center rounded-full bg-white dark:bg-bg_primary_dark">
            <div className="flex flex-col items-center justify-center gap-2 text-center">
              <p className="h-6 w-16 rounded-sm bg-slate-400 dark:bg-slate-600" />
              <p className="h-6 w-10 rounded-sm bg-slate-400 dark:bg-slate-600" />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-3 text-sm sm:flex-col sm:items-start sm:justify-start">
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="flex items-center space-x-2">
            <div className="h-5 w-5 rounded-sm bg-slate-400 dark:bg-slate-700" />
            <span className="h-5 w-20 rounded-sm bg-slate-400 dark:bg-slate-700" />
          </div>
        ))}
      </div>
    </div>
  );
}
