import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/DatePicker';
import { formatDate } from '@/utils/date/date';
import { useExpensesByDate } from '../hooks';
import ExpensesTable from './ExpensesTable';

// Date-picker + results table for the Show Expenses page. Picking a date
// kicks off a useExpensesByDate query; the results render through the same
// shared ExpensesTable used elsewhere.
export default function ExpensesByDatePanel() {
  const [pickerDate, setPickerDate] = useState<Date | undefined>(new Date());
  const [submittedDate, setSubmittedDate] = useState<string>(formatDate(new Date()));

  const { data, isFetching, refetch } = useExpensesByDate(submittedDate);

  const onShow = () => {
    if (!pickerDate) return;
    const formatted = formatDate(pickerDate);
    if (formatted === submittedDate) {
      refetch();
    } else {
      setSubmittedDate(formatted);
    }
  };

  const products = data?.products ?? [];

  return (
    <>
      <div className="add_expense_container flex w-full flex-col items-start justify-start gap-4 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
        <h4 className="text-base font-semibold">Filter Your Expenses</h4>
        <div className="flex w-full flex-col flex-wrap items-start justify-start gap-3 md:gap-5">
          <div className="input_containers grid w-full grid-cols-12 gap-3 md:gap-5 lg:w-8/12">
            <div
              id="filter_expenses_section"
              className="input_section col-span-12 flex w-full flex-col items-start justify-start gap-1 sm:col-span-6 lg:col-span-3"
            >
              <p className="text-sm">Choose Date</p>
              <DatePicker inputDate={pickerDate} setInputDate={setPickerDate} />
            </div>
          </div>
          <div className="action_buttons flex items-center justify-start gap-4 py-2">
            <Button disabled={isFetching} onClick={onShow} className="bg-green-500">
              {isFetching ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                'Show All'
              )}
            </Button>
          </div>
        </div>
      </div>
      <div className="flex w-full flex-col items-center justify-center rounded-md border border-border_light bg-bg_primary_light shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
        <ExpensesTable
          products={products}
          isLoading={isFetching && products.length === 0}
          actualDate={submittedDate}
        />
      </div>
    </>
  );
}
