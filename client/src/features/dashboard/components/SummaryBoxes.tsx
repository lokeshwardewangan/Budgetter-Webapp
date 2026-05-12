import { useMe } from '@/features/user/hooks';

type Props = {
  totalExpenses: number;
  totalAddedMoney: number;
  totalLentMoney: number;
  isLoading: boolean;
};

export default function SummaryBoxes({
  totalExpenses,
  totalAddedMoney,
  totalLentMoney,
  isLoading,
}: Props) {
  const { data: user } = useMe();
  const remainingBalance = Number(user?.currentPocketMoney) || 0;

  const cards = [
    {
      title: 'Total Expenses',
      value: totalExpenses,
      bg: 'bg-gradient-to-br from-[#9f78ff] to-[#32cafe] hover:bg-gradient-to-tl',
    },
    {
      title: 'Remain Balance',
      value: remainingBalance,
      bg: 'bg-gradient-to-br from-[#a376fc] to-[#f96f9b] hover:bg-gradient-to-tl',
    },
    {
      title: 'Added Balance',
      value: totalAddedMoney,
      bg: 'bg-gradient-to-br from-[#00cef9] to-[#00e6af] hover:bg-gradient-to-tl',
    },
    {
      title: 'Lent Money',
      value: totalLentMoney,
      bg: 'bg-gradient-to-br from-[#f95058] to-[#fc9197] hover:bg-gradient-to-tl',
    },
  ];

  return (
    <div className="summarize_box_container flex w-full flex-col items-start justify-start gap-4 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
      <h4 className="text-base font-semibold">Summaries Information</h4>
      <div
        id="summarize_budget_section"
        className="summary_boxes_outer flex w-full flex-wrap items-center justify-start gap-7 lg:justify-start"
      >
        {cards.map(({ title, value, bg }) => (
          <div
            key={title}
            className={`flex w-full max-w-full flex-col flex-wrap items-center justify-center gap-0 rounded-[10px] p-3 md:max-w-[13rem] 2xl:max-w-[14rem] ${bg}`}
          >
            <p className="text-center text-lg font-semibold text-white">
              {title}
            </p>
            {isLoading && title !== 'Remain Balance' ? (
              <p className="mt-1 h-7 w-2/5 animate-pulse rounded-md bg-slate-500 text-center text-2xl font-bold text-white dark:bg-slate-800" />
            ) : (
              <p className="text-center text-2xl font-bold text-white">
                {value}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
