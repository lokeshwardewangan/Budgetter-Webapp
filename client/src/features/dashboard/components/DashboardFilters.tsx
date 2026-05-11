import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { monthsNames, prevYearsName } from '@/utils/date/date';

type Props = {
  monthLabel: string;
  yearLabel: string;
  onMonthChange: (monthName: string) => void;
  onYearChange: (year: string) => void;
};

export default function DashboardFilters({
  monthLabel,
  yearLabel,
  onMonthChange,
  onYearChange,
}: Props) {
  return (
    <div className="summarize_box_container flex w-full flex-wrap items-center justify-center gap-x-4 gap-y-2.5 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark sm:justify-between">
      <h4 className="text-base font-semibold">Your {monthLabel} Month Report</h4>
      <div
        id="filter_report_section"
        className="filters flex items-center justify-center gap-2 font-medium"
      >
        <p className="mr-1 whitespace-nowrap">Filter Report</p>
        <Select onValueChange={onMonthChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={monthLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {monthsNames.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Select onValueChange={onYearChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={yearLabel} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {prevYearsName.map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
