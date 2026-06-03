type Props = {
  label?: string;
};

const BAR_DELAYS = ['0s', '-0.95s', '-0.8s', '-0.65s', '-0.5s'];

export function TableLoader({ label = 'Loading data…' }: Props) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-3 py-12">
      <div
        role="status"
        aria-label={label}
        className="flex h-8 items-end gap-[3px]"
      >
        {BAR_DELAYS.map((delay, i) => (
          <span
            key={i}
            style={{ animationDelay: delay }}
            className="block h-full w-[3px] origin-bottom animate-eq-bar rounded-sm bg-gradient-to-t from-emerald-600 to-emerald-400"
          />
        ))}
      </div>
      <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500 dark:text-gray-400">
        {label}
      </span>
    </div>
  );
}
