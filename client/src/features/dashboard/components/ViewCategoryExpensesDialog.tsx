import { createColumnHelper } from '@tanstack/react-table';
import { Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DataTable } from '@/shared/components/table/DataTable';
import { useDialogState } from '@/shared/hooks/useDialogState';
import { getMonthName } from '@/utils/date/date';
import { getLabelColorStyle } from '@/utils/ui/utility';

type ExpensesRow = {
  _id: string;
  name: string;
  price: number;
  label: string;
  date: string;
  category: string;
  createdAt: string;
  updatedAt: string;
};

type Props = {
  category: string;
  fullExpenses: ExpensesRow[];
};

const columnHelper = createColumnHelper<ExpensesRow>();

const columns = [
  columnHelper.display({
    id: 'index',
    header: '#',
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor('name', {
    header: 'Name',
    cell: (info) => {
      const row = info.row.original;
      if (!row.label) return row.name;
      const style = getLabelColorStyle(row.label);
      return (
        <span className="flex items-center gap-1">
          {row.name}
          <span
            style={{
              color: style.color,
              backgroundColor: style.backgroundColor,
              border: `1px solid ${style.borderColor}`,
            }}
            className="relative -top-1 inline-flex h-4 w-fit items-center gap-1 rounded-sm px-1.5 text-[10px] font-medium"
          >
            {row.label}
          </span>
        </span>
      );
    },
  }),
  columnHelper.accessor('price', { header: 'Price' }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => {
      const [day, month] = info.getValue<string>().split('-');
      return `${parseInt(day, 10)} ${getMonthName(month)}`;
    },
  }),
];

export default function ViewCategoryExpensesDialog({
  category,
  fullExpenses,
}: Props) {
  const { isOpen, setIsOpen } = useDialogState(false);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          data-tooltip-id="header-tooltip"
          data-tooltip-content="View Expenses"
          data-tooltip-place="right"
          className="flex w-fit cursor-pointer items-center justify-center rounded-full bg-slate-100 p-1.5 text-green-600 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
        >
          <Eye className="h-5 w-5" />
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="mx-auto w-[97%] max-w-2xl rounded-lg p-0 pb-5"
      >
        <DialogTitle className="hidden" />
        <h4 className="p-5 pb-0 text-base font-medium">
          Your{' '}
          <span className="font-bold text-green-800 dark:text-green-400">
            {category}
          </span>{' '}
          Expenses
        </h4>
        <div className="table_container max-h-[80vh] min-w-full max-w-full overflow-x-auto overflow-y-auto">
          <DataTable data={fullExpenses} columns={columns} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
