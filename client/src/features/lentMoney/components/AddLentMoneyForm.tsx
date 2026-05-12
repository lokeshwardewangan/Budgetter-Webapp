import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { DatePicker } from '@/components/ui/DatePicker';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/date/date';
import { addLentMoneySchema, type AddLentMoneyForm } from '../schemas';
import { useAddLentMoney } from '../hooks';

export default function AddLentMoneyForm() {
  const { mutateAsync: addLent, isPending } = useAddLentMoney();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddLentMoneyForm>({
    resolver: zodResolver(addLentMoneySchema),
    mode: 'onTouched',
    // DatePicker emits a Date object; we format it to dd-mm-yyyy on submit.
    defaultValues: { personName: '', price: '', date: formatDate(new Date()) },
  });

  const onSubmit = handleSubmit(async (values) => {
    const parsed = addLentMoneySchema.parse(values);
    await toast.promise(addLent(parsed), {
      loading: 'Adding lent money...',
      success: 'Lent money recorded!',
      error: 'Something went wrong.',
    });
    reset({ personName: '', price: '', date: formatDate(new Date()) });
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="add_lent_container flex w-full flex-col items-start justify-start gap-4 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark"
    >
      <h4 className="text-base font-semibold">Add Lent Money</h4>
      <div className="flex w-full flex-col flex-wrap items-start justify-start gap-3 md:gap-5">
        <div className="input_containers grid w-full max-w-5xl grid-cols-12 gap-3 md:gap-5">
          <div className="input_section col-span-12 flex w-full flex-col items-start justify-start gap-1 sm:col-span-6 xl:col-span-3">
            <p className="text-sm">Date of Lent</p>
            <Controller
              name="date"
              control={control}
              render={({ field }) => (
                <DatePicker
                  inputDate={field.value ? parseDate(field.value) : undefined}
                  setInputDate={(d) => field.onChange(d ? formatDate(d) : '')}
                />
              )}
            />
            {errors.date && (
              <span role="alert" className="mt-1 block text-xs font-medium text-red-500">{errors.date.message}</span>
            )}
          </div>
          <div className="input_section col-span-12 flex w-full flex-col items-start justify-start gap-1 sm:col-span-6 xl:col-span-3">
            <p className="text-sm">Person Name</p>
            <Input
              {...register('personName')}
              type="text"
              placeholder="Enter Person Name"
            />
            {errors.personName && (
              <span role="alert" className="mt-1 block text-xs font-medium text-red-500">{errors.personName.message}</span>
            )}
          </div>
          <div className="input_section col-span-12 flex w-full flex-col items-start justify-start gap-1 sm:col-span-6 xl:col-span-3">
            <p className="text-sm">Lent Money</p>
            <Input
              {...register('price')}
              type="number"
              step="any"
              placeholder="Enter Money"
            />
            {errors.price && (
              <span role="alert" className="mt-1 block text-xs font-medium text-red-500">{errors.price.message}</span>
            )}
          </div>
        </div>
        <div className="action_buttons flex items-center justify-start gap-4 py-2">
          <Button disabled={isPending} type="submit" className="bg-blue-500">
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Add Lent Money'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

// Parse a dd-mm-yyyy string back into a Date so the DatePicker can show it.
function parseDate(s: string): Date | undefined {
  const [d, m, y] = s.split('-').map(Number);
  if (!d || !m || !y) return undefined;
  return new Date(y, m - 1, d);
}
