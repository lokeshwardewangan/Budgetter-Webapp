import type { MonthlyReportData } from '../api';
import { getCategoryKey } from '@/shared/lib/expenseCategories';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type Props = {
  data?: MonthlyReportData;
  isLoading: boolean;
};

type MetricProps = {
  label: string;
  value: string | number;
  subtext: string;
  tooltipText: string;
  cardBgClass: string;
  valueColorClass: string;
};

function MetricWithTooltip({
  label,
  value,
  subtext,
  tooltipText,
  cardBgClass,
  valueColorClass,
}: MetricProps) {
  return (
    <TooltipProvider delayDuration={150}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={`group flex cursor-pointer flex-col gap-1 rounded-lg border p-4 transition-all duration-200 ${cardBgClass}`}
          >
            <span className="text-sm font-medium text-gray-500 transition-colors duration-200 group-hover:text-text_primary_light dark:text-gray-400 dark:group-hover:text-text_primary_dark">
              {label}
            </span>
            <span className={`text-2xl font-bold ${valueColorClass}`}>
              {value}
            </span>
            <p className="text-xs text-gray-400 dark:text-gray-500">
              {subtext}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>{tooltipText}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function PacingAdvisorCard({ data, isLoading }: Props) {
  if (isLoading || !data) {
    return (
      <div className="pacing_advisor_container w-full animate-pulse rounded-md border border-border_light bg-bg_primary_light p-6 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
        <div className="mb-6 h-6 w-1/4 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="grid w-full grid-cols-2 gap-6 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-20 rounded bg-slate-100 dark:bg-slate-800/50"
            />
          ))}
        </div>
      </div>
    );
  }

  const {
    totalExpenses,
    totalAddedMoney,
    elapsedDays,
    remainingDays,
    totalDays,
    weekendExpenses,
    weekdayExpenses,
    highestSpendDay,
  } = data;

  const investmentKey = getCategoryKey('Investment');
  const investmentExpenses = data.categoryWiseExpensesData[investmentKey] ?? 0;

  // Consumption expenses exclude investments
  const consumptionExpenses = Math.max(0, totalExpenses - investmentExpenses);
  const dailyAverage = elapsedDays > 0 ? consumptionExpenses / elapsedDays : 0;

  const remainingBudget = Math.max(0, totalAddedMoney - totalExpenses);
  const safeDailyLimit =
    remainingDays > 0 ? remainingBudget / remainingDays : 0;

  const projectedConsumption = dailyAverage * totalDays;
  const isOverrunning =
    totalAddedMoney > 0 && projectedConsumption > totalAddedMoney;

  const totalCombined = weekendExpenses + weekdayExpenses;
  const weekendPct =
    totalCombined > 0 ? (weekendExpenses / totalCombined) * 100 : 0;
  const weekdayPct =
    totalCombined > 0 ? (weekdayExpenses / totalCombined) * 100 : 0;

  const pacingPct =
    totalAddedMoney > 0
      ? Math.min(100, (totalExpenses / totalAddedMoney) * 100)
      : 0;

  let pacingColorClass = 'bg-[#10B981]';
  let pacingText = 'Under Control';
  let pacingTextClass = 'text-[#10B981]';

  if (pacingPct > 90) {
    pacingColorClass = 'bg-rose-500';
    pacingText = 'Budget Exhausted';
    pacingTextClass = 'text-rose-600 dark:text-rose-400';
  } else if (pacingPct > 70) {
    pacingColorClass = 'bg-amber-500';
    pacingText = 'Running Hot';
    pacingTextClass = 'text-amber-600 dark:text-amber-400';
  }

  // Net Savings Rate treats investments as saved funds (not consumption)
  const savingsRate =
    totalAddedMoney > 0
      ? ((totalAddedMoney - consumptionExpenses) / totalAddedMoney) * 100
      : 0;

  const isSavingsNegative = savingsRate < 0;

  return (
    <div className="pacing_advisor_container flex w-full flex-col gap-6 rounded-md border border-border_light bg-bg_primary_light p-6 font-karla shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
      <div className="flex w-full items-center justify-between">
        <h3 className="text-lg font-semibold text-text_primary_light dark:text-text_primary_dark">
          Daily Spending & Pacing Advisor
        </h3>
        {isOverrunning && (
          <span className="animate-pulse text-sm font-semibold text-rose-600 dark:text-rose-400">
            Projected Overrun Warning
          </span>
        )}
      </div>

      {/* Flat metrics grid mimicking existing category insight layout */}
      <div className="grid w-full grid-cols-2 gap-6 border-b border-border_light dark:border-border_dark md:grid-cols-4">
        <MetricWithTooltip
          label="Daily Burn Rate"
          value={`₹${dailyAverage.toFixed(0)}`}
          subtext="Consumable spend avg"
          tooltipText="Your average daily spending, excluding asset-building investments."
          cardBgClass="bg-indigo-50/30 border-indigo-100/50 hover:bg-indigo-50/55 dark:bg-indigo-950/10 dark:border-indigo-900/30 dark:hover:bg-indigo-950/20"
          valueColorClass="text-indigo-600 dark:text-indigo-400"
        />

        <MetricWithTooltip
          label="Today's Safe Limit"
          value={`₹${safeDailyLimit.toFixed(0)}`}
          subtext={`${remainingDays} days remaining`}
          tooltipText="The maximum you can spend daily for the rest of the month to stay within your added budget."
          cardBgClass={
            remainingBudget === 0
              ? 'bg-rose-50/30 border-rose-100/50 hover:bg-rose-50/55 dark:bg-rose-950/10 dark:border-rose-900/30 dark:hover:bg-rose-950/20'
              : 'bg-emerald-50/30 border-emerald-100/50 hover:bg-emerald-50/55 dark:bg-emerald-950/10 dark:border-emerald-900/30 dark:hover:bg-emerald-950/20'
          }
          valueColorClass={
            remainingBudget === 0
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-emerald-600 dark:text-emerald-400'
          }
        />

        <MetricWithTooltip
          label="Projected Spend"
          value={`₹${projectedConsumption.toFixed(0)}`}
          subtext="Est. month-end total"
          tooltipText="Estimated total expenses at the end of the month based on your current daily spending rate."
          cardBgClass={
            isOverrunning
              ? 'bg-amber-50/30 border-amber-100/50 hover:bg-amber-50/55 dark:bg-amber-950/10 dark:border-amber-900/30 dark:hover:bg-amber-950/20'
              : 'bg-blue-50/30 border-blue-100/50 hover:bg-blue-50/55 dark:bg-blue-950/10 dark:border-blue-900/30 dark:hover:bg-blue-950/20'
          }
          valueColorClass={
            isOverrunning
              ? 'text-amber-600 dark:text-amber-400'
              : 'text-blue-600 dark:text-blue-400'
          }
        />

        <MetricWithTooltip
          label="Net Savings Rate"
          value={`${savingsRate.toFixed(0)}%`}
          subtext="Includes 'Investment' category"
          tooltipText="The percentage of your budget saved. Expenses under the 'Investment' category are automatically counted as savings rather than consumption loss."
          cardBgClass={
            isSavingsNegative
              ? 'bg-rose-50/30 border-rose-100/50 hover:bg-rose-50/55 dark:bg-rose-950/10 dark:border-rose-900/30 dark:hover:bg-rose-950/20'
              : 'bg-teal-50/30 border-teal-100/50 hover:bg-teal-50/55 dark:bg-teal-950/10 dark:border-teal-900/30 dark:hover:bg-teal-950/20'
          }
          valueColorClass={
            isSavingsNegative
              ? 'text-rose-600 dark:text-rose-400'
              : 'text-teal-600 dark:text-teal-400'
          }
        />
      </div>

      {/* Monthly Pacing Slider bar - full width */}
      <div className="flex w-full flex-col gap-2">
        <div className="flex justify-between text-sm font-semibold text-text_primary_light dark:text-text_primary_dark">
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span className="cursor-pointer font-medium text-gray-500 transition-colors duration-200 hover:text-text_primary_light dark:text-gray-400 dark:hover:text-text_primary_dark">
                  Monthly Budget Pacing
                </span>
              </TooltipTrigger>
              <TooltipContent side="top">
                <p>
                  Percentage of your total added budget spent so far this month.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span className={`${pacingTextClass} font-bold`}>
            {pacingPct.toFixed(0)}% Spent ({pacingText})
          </span>
        </div>
        <div className="h-3 w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded transition-all duration-500 ${pacingColorClass}`}
            style={{ width: `${pacingPct}%` }}
          />
        </div>
      </div>

      {/* Lower grid: Weekend split and milestones */}
      <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <h5 className="text-sm font-semibold text-text_primary_light dark:text-text_primary_dark">
            Weekend vs. Weekday Split
          </h5>
          <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-gray-400">
            <span>Weekdays (Mon-Fri)</span>
            <span className="text-[#10B981]">Weekends (Sat-Sun)</span>
          </div>
          <div className="flex h-3 w-full overflow-hidden rounded bg-slate-100 dark:bg-slate-800">
            <div
              className="h-full bg-slate-400 transition-all duration-500 dark:bg-slate-500"
              style={{ width: `${weekdayPct}%` }}
            />
            <div
              className="h-full bg-[#10B981] transition-all duration-500"
              style={{ width: `${weekendPct}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-semibold text-gray-500 dark:text-gray-400">
            <span>
              ₹{weekdayExpenses.toFixed(0)} ({weekdayPct.toFixed(0)}%)
            </span>
            <span>
              ₹{weekendExpenses.toFixed(0)} ({weekendPct.toFixed(0)}%)
            </span>
          </div>
          {weekendPct > 50 && (
            <p className="text-xs leading-relaxed text-amber-600 dark:text-amber-400">
              * Weekend spending is high. Monitor restaurant and leisure
              spending on Saturdays and Sundays.
            </p>
          )}
        </div>

        <div className="flex flex-col justify-start gap-3">
          <h5 className="text-sm font-semibold text-text_primary_light dark:text-text_primary_dark">
            Insights & Milestones
          </h5>
          <div className="flex flex-col gap-3">
            {highestSpendDay ? (
              <p className="text-sm leading-relaxed text-text_primary_light dark:text-text_primary_dark">
                <span className="font-semibold text-gray-500 dark:text-gray-400">
                  Peak Outflow:
                </span>{' '}
                Highest spending day was the{' '}
                <span className="font-bold">{highestSpendDay.day}th</span> of
                this month with{' '}
                <span className="font-bold text-rose-500">
                  ₹{highestSpendDay.amount}
                </span>{' '}
                spent.
              </p>
            ) : (
              <p className="text-sm text-gray-400 dark:text-gray-500">
                No major spending spikes logged this period.
              </p>
            )}

            {investmentExpenses > 0 ? (
              <p className="text-sm leading-relaxed text-text_primary_light dark:text-text_primary_dark">
                <span className="font-bold text-emerald-600 dark:text-emerald-400">
                  Wealth Builder:{' '}
                </span>
                Excellent! You directed{' '}
                <span className="font-bold">₹{investmentExpenses}</span> into
                assets (Investments) this month. That is wealth-building, not
                consumption loss.
              </p>
            ) : (
              <p className="text-sm leading-relaxed text-gray-400 dark:text-gray-500">
                No investments logged this month. Allocating savings to assets
                helps secure long-term wealth.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
