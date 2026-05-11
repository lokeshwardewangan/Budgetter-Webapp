import { ListFilter, Search, X } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { useDialogState } from '@/shared/hooks/useDialogState';
import { monthsNames, prevYearsName, getMonthInNumber } from '@/utils/date/date';
import { expensesCategories } from '@/utils/ui/utility';

type Props = {
  search: string;
  month?: string;
  year?: string;
  category?: string;
  totalCount: number;
  onSearchChange: (value: string) => void;
  onMonthChange: (value?: string) => void;
  onYearChange: (value?: string) => void;
  onCategoryChange: (value?: string) => void;
  rightSlot?: React.ReactNode; // e.g. PDF export
};

// "all" is the UI sentinel for "no filter"; we translate it to `undefined`
// when emitting to the parent so the server omits the param entirely.
const ALL = 'all';

export default function ReportsFilters({
  search,
  month,
  year,
  category,
  totalCount,
  onSearchChange,
  onMonthChange,
  onYearChange,
  onCategoryChange,
  rightSlot,
}: Props) {
  const popover = useDialogState(false);

  return (
    <div
      id="filter_your_all_expense_section"
      className="filter_expense_containerr sticky top-16 flex flex-wrap items-center justify-between gap-5 rounded-md bg-white px-5 py-3 text-base dark:bg-bg_primary_dark"
    >
      <div className="left_sectionss flex flex-row flex-wrap items-center justify-between gap-x-4 gap-y-3 sm:flex-nowrap sm:justify-start">
        <p className="whitespace-nowrap font-semibold">Your All Expenses</p>
        <div className="flex sm:hidden">{rightSlot}</div>
        <div className="relative w-full">
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            type="text"
            className="pr-9 sm:w-72"
            placeholder="Search Expense"
          />
          {!search ? (
            <Search className="absolute right-2.5 top-2.5 h-4 w-4" />
          ) : (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1.5 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-slate-100 transition-all duration-300 ease-in-out hover:scale-105 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="filters flex items-center justify-center gap-1 font-medium">
        <span
          data-tooltip-id="header-tooltip"
          data-tooltip-content="Results"
          className="flex min-h-5 w-full min-w-6 max-w-full cursor-pointer items-center justify-center rounded-full bg-pink-600 p-1 text-xs text-white"
        >
          {totalCount}
        </span>
        <Popover open={popover.isOpen} onOpenChange={popover.setIsOpen}>
          <PopoverTrigger asChild>
            <span className="relative flex items-center justify-center rounded-full p-2 hover:bg-[#f3f3f3] dark:text-white dark:hover:bg-slate-800">
              <ListFilter className="h-5 w-5 cursor-pointer" />
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-3 px-4">
            <div className="flex flex-col gap-2">
              <Select
                value={category ?? ALL}
                onValueChange={(v) => {
                  onCategoryChange(v === ALL ? undefined : v);
                  popover.close();
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL}>All Categories</SelectItem>
                  <SelectGroup>
                    {expensesCategories.map((c) => (
                      <SelectItem key={c} value={c}>
                        {c}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>

        <Select
          value={month ?? ALL}
          onValueChange={(v) => {
            if (v === ALL) onMonthChange(undefined);
            else onMonthChange(getMonthInNumber(v));
          }}
        >
          <SelectTrigger className="mr-1 w-full">
            <SelectValue placeholder="All Months" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Months</SelectItem>
            <SelectGroup>
              {monthsNames.map((m) => (
                <SelectItem key={m} value={m}>
                  {m}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={year ?? ALL}
          onValueChange={(v) => onYearChange(v === ALL ? undefined : v)}
        >
          <SelectTrigger className="mr-1.5 w-full">
            <SelectValue placeholder="All Years" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>All Years</SelectItem>
            <SelectGroup>
              {prevYearsName.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <div className="hidden sm:flex">{rightSlot}</div>
      </div>
    </div>
  );
}
