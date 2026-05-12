import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { cn } from '@/lib/utils';

// `TValue` is intentionally `any` here. TanStack's `ColumnDef` is
// invariant in its second generic, so a column that accessor-keys into a
// `string` field can't be widened to `ColumnDef<T, unknown>`. Callers
// mix column types within a single table (string, number, Date), and
// `any` is the canonical TanStack escape hatch.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataTableProps<TData> = {
  data: TData[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  columns: ColumnDef<TData, any>[];
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
};

// Generic table backed by @tanstack/react-table. Replaces the ~60 lines of
// duplicated header/body markup previously copy-pasted across every list
// view (pocket money, lent money, expenses, sessions). Consumers only need
// to provide a `data` array and `columns` definition.
export function DataTable<TData>({
  data,
  columns,
  emptyMessage = 'No records found',
  isLoading,
  className,
}: DataTableProps<TData>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  if (isLoading) {
    return (
      <div className="w-full rounded-md p-5 text-sm text-gray-500">Loading...</div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="message_outer w-full rounded-md p-5">
        <div className="flex">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={cn('w-full overflow-x-auto rounded-lg', className)}>
      <table className="min-w-full divide-y border-b border-border_dark">
        <thead className="dark:bg-bg_secondary_dark">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className="px-6 py-3 text-left text-sm font-medium uppercase tracking-wider text-gray-500 dark:text-gray-100"
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
          {table.getRowModel().rows.map((row, index) => (
            <tr
              key={row.id}
              className={cn(
                'dark:bg-bg_primary_dark dark:hover:bg-slate-800',
                index % 2 === 0 ? 'bg-gray-50' : 'bg-white',
              )}
            >
              {row.getVisibleCells().map((cell) => (
                <td
                  key={cell.id}
                  className="whitespace-nowrap px-6 py-4 text-sm text-gray-500 dark:text-gray-100"
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
