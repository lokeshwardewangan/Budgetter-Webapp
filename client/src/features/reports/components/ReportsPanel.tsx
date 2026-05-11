import { useMemo, useState } from 'react';
import PDFExportComponent from '@/components/user/PDFExportComponent';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { useExpensesFeed } from '../hooks';
import ReportsFilters from './ReportsFilters';
import ReportsTable from './ReportsTable';

const PAGE_SIZE = 10;

export default function ReportsPanel() {
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState<string | undefined>();
  const [year, setYear] = useState<string | undefined>();
  const [category, setCategory] = useState<string | undefined>();

  // Debounce the search input so we don't fire a fetch on every keystroke.
  const debouncedSearch = useDebounce(search, 300);

  const filters = { limit: PAGE_SIZE, search: debouncedSearch || undefined, month, year, category };

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useExpensesFeed(filters);

  const rows = useMemo(
    () => data?.pages.flatMap((p) => p.data.items) ?? [],
    [data],
  );
  const totalCount = data?.pages[0]?.data.total ?? 0;

  // Build a "timeline message" for the PDF export label, mirroring the
  // legacy AllExpensesTable's logic.
  const pdfTimeline = useMemo(() => {
    if (debouncedSearch) return `Search: ${debouncedSearch}`;
    if (month && year) return `${month}/${year}`;
    if (year) return `Year ${year}`;
    if (month) return `Month ${month}`;
    return 'All time';
  }, [debouncedSearch, month, year]);

  const pdfRows = useMemo(
    () =>
      rows.map((r, i) => ({
        ...r.product,
        sno: i + 1,
      })),
    [rows],
  );

  return (
    <div className="allexpenses_table_container flex w-full flex-col justify-center gap-4 rounded-md bg-white px-0 py-5 dark:bg-bg_primary_dark">
      <ReportsFilters
        search={search}
        month={month}
        year={year}
        category={category}
        totalCount={totalCount}
        onSearchChange={setSearch}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onCategoryChange={setCategory}
        rightSlot={
          pdfRows.length > 0 ? (
            <PDFExportComponent createdAt={pdfTimeline} expenses={pdfRows as any} />
          ) : null
        }
      />

      <div id="all_expense_data_in_table_section" className="w-full overflow-x-auto">
        <ReportsTable
          rows={rows}
          isLoading={isLoading}
          isFetchingNextPage={isFetchingNextPage}
          hasNextPage={!!hasNextPage}
          onLoadMore={() => fetchNextPage()}
        />
      </div>
    </div>
  );
}
