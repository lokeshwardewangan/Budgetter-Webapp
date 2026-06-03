import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/table/DataTable';
import { formatDateIST } from '@/shared/lib/dateFormat';
import { TOUR_IDS } from '@/features/tour';
import { usePocketMoneyHistory } from '../hooks';
import type { PocketMoneyEntry } from '@/types/api/auth/auth';

const columnHelper = createColumnHelper<PocketMoneyEntry>();

const columns = [
  columnHelper.display({
    id: 'index',
    header: '#',
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor('date', {
    header: 'Date',
    cell: (info) => formatDateIST(info.getValue<string>()),
  }),
  columnHelper.accessor('amount', { header: 'Amount' }),
  columnHelper.accessor('source', { header: 'Source' }),
];

export default function PocketMoneyHistoryTable() {
  const { data = [], isLoading } = usePocketMoneyHistory();

  return (
    <div id={TOUR_IDS.pocketMoneyDetailsTable} className="w-full">
      <DataTable
        data={data}
        columns={columns}
        isLoading={isLoading}
        loadingLabel="Loading pocket money…"
        emptyMessage="You haven't added pocket money yet."
        className="border-border_dark dark:border"
      />
    </div>
  );
}
