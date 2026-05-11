import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/table/DataTable';
import { categoryColorMap } from '@/utils/ui/utility';
import { useAllExpenses } from '@/features/expenses/hooks';
import {
  type CategoryStats,
  getFullExpensesList,
  useCategoryStats,
} from '../hooks/useCategoryStats';
import ViewCategoryExpensesDialog from './ViewCategoryExpensesDialog';

type Props = {
  filterMonthValue: string;
  filterYearValue: string;
};

const columnHelper = createColumnHelper<CategoryStats>();

export default function CategoryInsightsTable({
  filterMonthValue,
  filterYearValue,
}: Props) {
  const { data: allExpenses = [] } = useAllExpenses();
  const stats = useCategoryStats(filterMonthValue, filterYearValue);

  const highestPercent = stats.length
    ? Math.max(...stats.map((s) => s.expensePercent))
    : 0;
  const lowestPercent = stats.length
    ? Math.min(...stats.map((s) => s.expensePercent))
    : 0;

  const columns = [
    columnHelper.display({
      id: 'index',
      header: '#',
      cell: (info) => info.row.index + 1,
    }),
    columnHelper.accessor('category', {
      header: 'Category',
      cell: (info) => {
        const value = info.getValue();
        const colorClass = categoryColorMap[value] || 'text-gray-500';
        return <span className={`${colorClass} font-medium`}>{value}</span>;
      },
    }),
    columnHelper.accessor('totalSpent', {
      header: 'Total Spent',
      cell: (info) => {
        const value = info.getValue();
        const color =
          value > 3000
            ? 'text-red-600 dark:text-red-400'
            : value > 1000
              ? 'text-orange-600 dark:text-orange-400'
              : 'text-green-600 dark:text-green-400';
        return <span className={`${color} font-semibold`}>₹{value}</span>;
      },
    }),
    columnHelper.accessor('expensePercent', {
      header: 'Expense %',
      cell: (info) => {
        const value = info.getValue();
        let styleClass: string;
        if (value === highestPercent) {
          styleClass = 'text-[#dc3545] bg-[#f81f581a]';
        } else if (value === lowestPercent) {
          styleClass = 'text-[#198754] bg-[#61ae4130]';
        } else {
          styleClass =
            value > 30
              ? 'text-red-600 dark:text-red-400'
              : value > 15
                ? 'text-orange-600 dark:text-orange-400'
                : 'text-green-600 dark:text-green-400';
        }
        return (
          <span className={`${styleClass} rounded px-2 py-1 font-semibold`}>{value}%</span>
        );
      },
    }),
    columnHelper.accessor('transactionCount', {
      header: 'No. of Transactions',
      cell: (info) => (
        <span className="font-medium text-blue-700 dark:text-blue-300">
          {info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('avgExpense', {
      header: 'Avg Expense',
      cell: (info) => (
        <span className="font-medium text-cyan-700 dark:text-cyan-400">
          ₹{info.getValue().toFixed(2)}
        </span>
      ),
    }),
    columnHelper.accessor('maxExpense', {
      header: 'Max Expense',
      cell: (info) => (
        <span className="font-medium text-red-500 dark:text-red-300">
          ₹{info.getValue()}
        </span>
      ),
    }),
    columnHelper.accessor('minExpense', {
      header: 'Min Expense',
      cell: (info) => (
        <span className="font-medium text-green-700 dark:text-green-300">
          ₹{info.getValue()}
        </span>
      ),
    }),
    columnHelper.display({
      id: 'actions',
      header: 'Actions',
      cell: (info) => {
        const category = info.row.original.category;
        // Resolve the full per-row expense list right here at render time —
        // safe because it's now a pure function (not a hook).
        const fullExpenses = getFullExpensesList(
          allExpenses,
          category,
          filterMonthValue,
          filterYearValue,
        );
        return <ViewCategoryExpensesDialog fullExpenses={fullExpenses as any} category={category} />;
      },
    }),
  ];

  return (
    <div
      id="individual_expenses_by_category_insight_section"
      className="w-full rounded-md bg-bg_primary_light px-0 py-6 shadow-sm dark:bg-bg_primary_dark"
    >
      {stats.length === 0 ? (
        <div className="flex px-6 text-lg">No Expenses Found</div>
      ) : (
        <div className="w-full overflow-x-auto">
          <div className="flex w-full items-center justify-between gap-3 px-8 pb-5">
            <span className="text-lg font-medium">Your Categorized Expense Stats</span>
          </div>
          <div className="table_container min-w-full overflow-x-auto">
            <DataTable data={stats} columns={columns} />
          </div>
        </div>
      )}
    </div>
  );
}
