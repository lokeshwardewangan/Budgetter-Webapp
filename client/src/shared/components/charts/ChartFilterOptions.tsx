import { useState } from 'react';
import { Check, MoreHorizontal } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

type ChartFilter = 'daily' | 'weekly' | 'monthly' | 'yearly';

type Props = {
  setChartFilter: (value: ChartFilter) => void;
  initial?: ChartFilter;
};

const OPTIONS: ChartFilter[] = ['daily', 'weekly', 'monthly', 'yearly'];

export default function ChartFilterOptions({
  setChartFilter,
  initial = 'daily',
}: Props) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ChartFilter>(initial);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="absolute right-0 top-0 rounded-full p-1 hover:bg-gray-200 dark:hover:bg-gray-700">
        <MoreHorizontal className="h-5 w-5 text-gray-500" />
      </PopoverTrigger>
      <PopoverContent className="relative right-6 w-28 rounded-lg bg-white p-0 shadow-md dark:bg-gray-800">
        <ul className="text-sm text-gray-700 dark:text-gray-300">
          {OPTIONS.map((item) => {
            const isSelected = selected === item;
            return (
              <li
                key={item}
                onClick={() => {
                  setChartFilter(item);
                  setSelected(item);
                  setOpen(false);
                }}
                className="flex cursor-pointer items-center justify-between rounded-md border-b px-3 py-1 capitalize hover:bg-gray-100 dark:border-slate-700 dark:hover:bg-gray-700"
              >
                {item}
                {isSelected && <Check className="h-4 w-4 text-green-500" />}
              </li>
            );
          })}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
