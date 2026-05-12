import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getTodayDate } from '@/utils/date/date';
import { addPocketMoneySchema, type AddPocketMoneyForm } from '../schemas';
import { useAddPocketMoney } from '../hooks';

export default function AddPocketMoneyForm() {
  const { mutateAsync: addMoney, isPending } = useAddPocketMoney();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddPocketMoneyForm>({
    resolver: zodResolver(addPocketMoneySchema),
    mode: 'onTouched',
    defaultValues: { amount: '', source: '', date: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    // `date` is always set to today here. The form input only collects
    // amount + source; users on this page are recording today's income.
    const parsed = addPocketMoneySchema.parse({ ...values, date: getTodayDate() });
    await toast.promise(addMoney(parsed), {
      loading: 'Adding pocket money...',
      success: 'Pocket money added!',
      error: 'Something went wrong.',
    });
    reset({ amount: '', source: '', date: '' });
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="add_expense_container flex w-full flex-col items-start justify-start gap-4 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark"
    >
      <h4 className="text-base font-semibold">Add Your Pocket Money</h4>
      <div className="flex w-full flex-col flex-wrap items-start justify-start gap-3 md:gap-5">
        <div className="input_containers grid w-full grid-cols-12 gap-3 md:gap-5 lg:w-8/12">
          <div className="input_section col-span-12 flex w-full flex-col items-start justify-start gap-1 sm:col-span-6 lg:col-span-3">
            <p className="text-sm">Add Money</p>
            <Input
              {...register('amount')}
              type="number"
              step="any"
              placeholder="Enter Money"
            />
            {errors.amount && (
              <span role="alert" className="mt-1 block text-xs font-medium text-red-500">{errors.amount.message}</span>
            )}
          </div>
          <div className="input_section col-span-12 flex w-full flex-col items-start justify-start gap-1 sm:col-span-6 lg:col-span-3">
            <p className="text-sm">Money Source</p>
            <Input {...register('source')} type="text" placeholder="Enter Source" />
            {errors.source && (
              <span role="alert" className="mt-1 block text-xs font-medium text-red-500">{errors.source.message}</span>
            )}
          </div>
        </div>
        <div className="action_buttons flex flex-wrap items-center justify-start gap-4 py-2">
          <Button type="button" variant="outline" onClick={() => reset()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="bg-green-500">
            <CirclePlus className="h-5 w-5" /> &nbsp;
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              'Add Money'
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}
