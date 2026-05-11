import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/table/DataTable';
import { getLabelColorStyle } from '@/utils/ui/utility';
import PDFExportComponent from '@/components/user/PDFExportComponent';
import type { ExpenseProduct } from '@/types/api/expenses/expenses';
import EditExpenseDialog from './EditExpenseDialog';
import DeleteExpenseDialog from './DeleteExpenseDialog';

type Props = {
  products: ExpenseProduct[];
  isLoading?: boolean;
  // Date (dd-mm-yyyy) the products are filed under. Required by edit/delete
  // dialogs so the server can locate the parent expense document.
  actualDate: string;
  // When true (Add Expenses page), shows the date header + PDF export button.
  showPdfExport?: boolean;
};

const columnHelper = createColumnHelper<ExpenseProduct>();

export default function ExpensesTable({
  products,
  isLoading,
  actualDate,
  showPdfExport = true,
}: Props) {
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
    columnHelper.accessor('category', { header: 'Category' }),
    columnHelper.accessor('createdAt', {
      header: 'Time',
      cell: (info) => new Date(info.getValue<string>()).toLocaleString().split(',')[1],
    }),
    columnHelper.display({
      id: 'action',
      header: 'Action',
      cell: (info) => (
        <div className="flex w-full items-center justify-start space-x-2">
          <EditExpenseDialog actualDate={actualDate} product={info.row.original} />
          <DeleteExpenseDialog actualDate={actualDate} product={info.row.original} />
        </div>
      ),
    }),
  ];

  return (
    <div
      id="today_expenses_show_section"
      className="message_outer w-full rounded-md bg-bg_primary_light px-0 py-5 dark:bg-bg_primary_dark"
    >
      {isLoading ? (
        <div className="flex px-5 text-sm text-gray-500">Loading...</div>
      ) : products.length === 0 ? (
        <div className="flex px-5">No Expenses Found</div>
      ) : (
        <>
          {showPdfExport && (
            <div className="flex w-full items-center justify-between gap-3 px-5 pb-3">
              <span className="text-base font-medium">Your {actualDate} Expenses</span>
              <PDFExportComponent
                createdAt={
                  products[0]?.createdAt
                    ? new Date(products[0].createdAt)
                        .toISOString()
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('-')
                    : actualDate
                }
                expenses={products as any}
              />
            </div>
          )}
          <DataTable data={products} columns={columns} />
        </>
      )}
    </div>
  );
}
