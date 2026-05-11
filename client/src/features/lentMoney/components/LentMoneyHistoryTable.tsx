import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/shared/components/table/DataTable';
import type { LentMoneyEntry } from '@/types/api/auth/auth';
import { useLentMoneyHistory } from '../hooks';
import MarkReceivedDialog from './MarkReceivedDialog';

const columnHelper = createColumnHelper<LentMoneyEntry>();

const columns = [
  columnHelper.display({
    id: 'index',
    header: '#',
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor('personName', { header: 'Person Name' }),
  columnHelper.accessor('price', { header: 'Price' }),
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('isReceived', {
    header: 'Status',
    cell: (info) =>
      info.getValue() ? (
        <span className="rounded-xl bg-green-100 px-2 py-0.5 text-xs text-green-700">
          Received
        </span>
      ) : (
        <span className="rounded-xl bg-amber-100 px-2 py-0.5 text-xs text-amber-700">
          Pending
        </span>
      ),
  }),
  columnHelper.display({
    id: 'action',
    header: 'Action',
    cell: (info) => {
      const row = info.row.original;
      if (row.isReceived) return null;
      return (
        <MarkReceivedDialog lentMoneyId={row._id} personName={row.personName} />
      );
    },
  }),
];

export default function LentMoneyHistoryTable() {
  const { data = [], isLoading } = useLentMoneyHistory();

  return (
    <div className="lent_records_details_container flex w-full flex-col items-start justify-start rounded-md border border-border_light bg-bg_primary_light shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
      <h4 className="p-4 text-base font-semibold">Your Lent Money Records</h4>
      <div className="flex w-full items-center justify-center">
        <DataTable
          data={data}
          columns={columns}
          isLoading={isLoading}
          emptyMessage="No records found"
        />
      </div>
    </div>
  );
}
