import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  totalExpenses: number;
  totalAddedMoney: number;
  totalLentMoney: number;
  prevMonthExpenses?: number;
  isLoading: boolean;
};

export default function SummaryBoxes({
  totalExpenses,
  totalAddedMoney,
  totalLentMoney,
  prevMonthExpenses = 0,
  isLoading,
}: Props) {
  const netSavings = totalAddedMoney - totalExpenses;

  const getMoMComparison = () => {
    if (!prevMonthExpenses) return null;
    const diff = totalExpenses - prevMonthExpenses;
    const pct = ((Math.abs(diff) / prevMonthExpenses) * 100).toFixed(0);
    const label = diff > 0 ? `▲ up by ${pct}%` : `▼ down by ${pct}%`;
    return { label, isUp: diff > 0 };
  };

  const momStats = getMoMComparison();

  const cards = [
    {
      title: 'Total Expenses',
      value: totalExpenses,
      bg: 'bg-gradient-to-br from-[#9f78ff] to-[#32cafe] hover:bg-gradient-to-tl',
      mom: momStats,
    },
    {
      title: 'Net Savings',
      value: netSavings,
      bg: 'bg-gradient-to-br from-[#a376fc] to-[#f96f9b] hover:bg-gradient-to-tl',
      mom: null,
    },
    {
      title: 'Added Balance',
      value: totalAddedMoney,
      bg: 'bg-gradient-to-br from-[#00cef9] to-[#00e6af] hover:bg-gradient-to-tl',
      mom: null,
    },
    {
      title: 'Lent Money',
      value: totalLentMoney,
      bg: 'bg-gradient-to-br from-[#f95058] to-[#fc9197] hover:bg-gradient-to-tl',
      mom: null,
    },
  ];

  return (
    <div className="summarize_box_container flex w-full flex-col items-start justify-start gap-4 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
      <h4 className="text-base font-semibold">Summaries Information</h4>
      <div
        id="summarize_budget_section"
        className="summary_boxes_outer flex w-full flex-wrap items-center justify-start gap-7 lg:justify-start"
      >
        {cards.map(({ title, value, bg, mom }) => {
          const cardContent = (
            <div
              key={title}
              className={`flex w-full max-w-full flex-col flex-wrap items-center justify-center gap-0 rounded-[10px] p-3 transition-all duration-300 md:max-w-[13rem] 2xl:max-w-[14rem] ${bg}`}
            >
              <p className="text-center text-lg font-semibold text-white">
                {title}
              </p>
              {isLoading ? (
                <p className="mt-1 h-7 w-2/5 animate-pulse rounded-md bg-slate-500 text-center text-2xl font-bold text-white dark:bg-slate-800" />
              ) : (
                <p className="text-center text-2xl font-bold text-white">
                  {value < 0 ? `-₹${Math.abs(value)}` : `₹${value}`}
                </p>
              )}
            </div>
          );

          if (mom) {
            return (
              <TooltipProvider key={title} delayDuration={100}>
                <Tooltip>
                  <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{mom.label} compared to last month</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          }

          return cardContent;
        })}
      </div>
    </div>
  );
}
