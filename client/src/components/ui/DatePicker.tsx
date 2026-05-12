import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerType {
  inputDate: Date | undefined;
  // Accepts either a state setter or a plain callback (e.g. RHF's
  // `field.onChange`). Typing this as `Dispatch<SetStateAction<…>>` would
  // force RHF consumers to wrap onChange in a setter shim.
  setInputDate: (date: Date | undefined) => void;
}

export function DatePicker({ inputDate, setInputDate }: DatePickerType) {
  const [popoverOpen, setPopoverOpen] = React.useState(false);

  return (
    <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'h-9 w-full justify-start text-left font-normal dark:bg-bg_secondary_dark dark:hover:text-white',
            !inputDate && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {inputDate ? (
            format(inputDate, 'PPP')
          ) : (
            <span>{new Date().toLocaleDateString()}</span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-auto p-0"
        side="bottom"
        align="start"
        avoidCollisions={false} // 👈 important fix
      >
        <Calendar
          mode="single"
          selected={inputDate}
          onSelect={(value) => {
            setInputDate(value);
            setPopoverOpen(false);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
