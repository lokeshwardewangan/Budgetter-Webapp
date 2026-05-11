import { getTodayDate } from '@/utils/date/date';
import { useTodayExpenses } from '../hooks';
import ExpensesTable from './ExpensesTable';

// Today's expenses card on the Add Expenses page. Drives itself off
// the dedicated useTodayExpenses hook, no props needed.
export default function TodayExpensesPanel() {
  const { data = [], isLoading } = useTodayExpenses();

  return (
    <div className="expense_details_container flex w-full flex-col items-start justify-start rounded-md border border-border_light bg-bg_primary_light shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
      <div className="flex w-full items-center justify-center">
        <ExpensesTable
          products={data}
          isLoading={isLoading}
          actualDate={getTodayDate()}
          showPdfExport={false}
        />
      </div>
    </div>
  );
}
