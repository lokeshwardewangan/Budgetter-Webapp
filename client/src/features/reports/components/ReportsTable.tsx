import { useEffect, useMemo, useRef } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { Loader2 } from 'lucide-react';
import { DataTable } from '@/shared/components/table/DataTable';
import { getLabelColorStyle } from '@/utils/ui/utility';
import type { ExpenseFeedRow } from '../api';

type Props = {
  rows: ExpenseFeedRow[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
};

const columnHelper = createColumnHelper<ExpenseFeedRow>();

const columns = [
  columnHelper.display({
    id: 'index',
    header: '#',
    cell: (info) => info.row.index + 1,
  }),
  columnHelper.accessor('date', { header: 'Date' }),
  columnHelper.accessor('product.name', {
    header: 'Product Name',
    cell: (info) => {
      const row = info.row.original.product;
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
  columnHelper.accessor('product.price', { header: 'Price ₹' }),
  columnHelper.accessor('product.category', { header: 'Category' }),
  columnHelper.accessor('product.createdAt', {
    header: 'Time',
    cell: (info) =>
      new Date(info.getValue<string>()).toLocaleString().split(',')[1],
  }),
];

// IntersectionObserver-driven auto-loader: when the sentinel scrolls into
// view we ask the parent for the next page. Falls back gracefully if the
// browser lacks IO support (unlikely on supported targets).
export default function ReportsTable({
  rows,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
}: Props) {
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const cols = useMemo(() => columns, []);

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasNextPage) return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) if (e.isIntersecting) onLoadMore();
    });
    io.observe(node);
    return () => io.disconnect();
  }, [hasNextPage, onLoadMore]);

  return (
    <>
      <DataTable
        data={rows}
        columns={cols}
        isLoading={isLoading && rows.length === 0}
        emptyMessage="No Expenses Found"
      />
      {hasNextPage && (
        <div
          ref={sentinelRef}
          className="flex w-full items-center justify-center py-4 text-sm text-gray-500"
        >
          {isFetchingNextPage ? (
            <span className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading more...
            </span>
          ) : (
            <button type="button" onClick={onLoadMore} className="underline">
              Load more
            </button>
          )}
        </div>
      )}
    </>
  );
}
