import { createColumnHelper } from '@tanstack/react-table';
import { Eye, Search } from 'lucide-react';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { DataTable } from '@/shared/components/table/DataTable';
import { useDialogState } from '@/shared/hooks/useDialogState';
import { getLabelColorStyle } from '@/utils/ui/utility';
import type { Expense } from '@/types/api/expenses/expenses';

type ExpensesRow = Expense;

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
      const d = new Date(info.getValue<string>());
      return d.toLocaleDateString(undefined, {
        day: 'numeric',
        month: 'short',
      });
    },
  }),
];

export default function ViewCategoryExpensesDialog({
  category,
  fullExpenses,
}: Props) {
  const { isOpen, setIsOpen } = useDialogState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const onOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setSearchQuery('');
    }
  };

  const filteredExpenses = fullExpenses.filter((e) => {
    const term = searchQuery.toLowerCase().trim();
    if (!term) return true;
    return (
      e.name.toLowerCase().includes(term) ||
      (e.label && e.label.toLowerCase().includes(term)) ||
      e.price.toString().includes(term)
    );
  });

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
        <div className="flex flex-col justify-between gap-4 p-5 pb-2 sm:flex-row sm:items-center">
          <h4 className="text-base font-medium">
            Your{' '}
            <span className="font-bold text-green-800 dark:text-green-400">
              {category}
            </span>{' '}
            Expenses
          </h4>
          <div className="relative flex w-full items-center sm:w-60">
            <Search className="absolute left-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border_light bg-transparent py-1.5 pl-8 pr-3 text-xs text-text_primary_light outline-none focus:border-green-600 dark:border-border_dark dark:text-text_primary_dark dark:focus:border-green-400"
            />
          </div>
        </div>
        <div className="table_container max-h-[60vh] min-w-full max-w-full overflow-x-auto overflow-y-auto">
          <DataTable data={filteredExpenses} columns={columns} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
