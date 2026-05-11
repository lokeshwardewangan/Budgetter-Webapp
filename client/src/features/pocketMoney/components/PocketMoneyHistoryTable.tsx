import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/table/DataTable';
import { usePocketMoneyHistory } from '../hooks';
import type { PocketMoneyEntry } from '@/types/api/auth/auth';

const columnHelper = createColumnHelper<PocketMoneyEntry>();

const columns = [
  columnHelper.display({
    id: 'index',
    header: '#',
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('amount', { header: 'Amount' }),
  columnHelper.accessor('source', { header: 'Source' }),
];

export default function PocketMoneyHistoryTable() {
  const { data = [], isLoading } = usePocketMoneyHistory();

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      emptyMessage="You haven't added pocket money yet."
      className="border-border_dark dark:border"
    />
  );
}
