import { useState } from 'react';
import toast from 'react-hot-toast';
import { getCurrentMonth, getMonthInNumber } from '@/utils/date/date';
import { useMonthlyReport } from '@/features/dashboard/hooks';
import { useMe } from '@/features/user/hooks';
import DashboardFilters from '@/features/dashboard/components/DashboardFilters';
import SummaryBoxes from '@/features/dashboard/components/SummaryBoxes';
import CategoryDonutChart from '@/features/dashboard/components/CategoryDonutChart';
import ExpensesTimelineChart from '@/features/dashboard/components/ExpensesTimelineChart';
import CategoryInsightsTable from '@/features/dashboard/components/CategoryInsightsTable';

export default function Dashboard() {
  const { data: user } = useMe();
  const [monthLabel, setMonthLabel] = useState<string>(getCurrentMonth());
  const [yearLabel, setYearLabel] = useState<string>(new Date().getFullYear().toString());

  const monthNum = getMonthInNumber(monthLabel);
  const { data, isLoading } = useMonthlyReport(monthNum, yearLabel);

  const onMonthChange = (m: string) => {
    if (!m) return toast.error('Please select a month');
    setMonthLabel(m);
  };
  const onYearChange = (y: string) => {
    if (!y) return toast.error('Please select a year');
    setYearLabel(y);
  };

  return (
    <div className="dashboard_page_ flex w-full flex-col items-start justify-start gap-5">
      <div className="heading_dashboard_page flex w-full items-start justify-start">
        <h3 className="text-left text-lg font-semibold">
          {user?.name && (
            <span className="font-bold text-text_heading_light dark:text-text_primary_dark">
              Welcome! {user.name}
            </span>
          )}
        </h3>
      </div>

      <DashboardFilters
        monthLabel={monthLabel}
        yearLabel={yearLabel}
        onMonthChange={onMonthChange}
        onYearChange={onYearChange}
      />

      <SummaryBoxes
        totalExpenses={data?.totalExpenses ?? 0}
        totalAddedMoney={data?.totalAddedMoney ?? 0}
        totalLentMoney={data?.totalLentMoney ?? 0}
        isLoading={isLoading}
      />

      <div className="visual_graph_container grid w-full grid-cols-1 gap-6 lg:grid-cols-2">
        <CategoryDonutChart
          totalExpenses={data?.totalExpenses ?? 0}
          data={data?.categoryWiseExpensesData}
          isLoading={isLoading}
        />
        <ExpensesTimelineChart />
      </div>

      <div className="category_insights_container mb-10 w-full">
        <CategoryInsightsTable filterMonthValue={monthLabel} filterYearValue={yearLabel} />
      </div>
    </div>
  );
}
