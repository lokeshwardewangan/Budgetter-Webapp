import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { useTheme } from '@/shared/contexts/ThemeContext';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SelectField } from '@/shared/components/form/SelectField';
import { useDialogState } from '@/shared/hooks/useDialogState';
import { expensesCategories } from '@/utils/ui/utility';
import { LabelOptions, type OptionType } from '@/utils/utility';
import { getCustomReactSelectStyles } from '@/styles/global';
import type { ExpenseProduct } from '@/types/api/expenses/expenses';
import { editExpenseFormSchema, type EditExpenseFormInput } from '../schemas';
import { useEditExpense } from '../hooks';

type Props = {
  actualDate: string;
  product: ExpenseProduct;
};

// dd-mm-yyyy <-> yyyy-MM-dd helpers for the native <input type="date">.
const toInputDate = (ddmmyyyy: string) => {
  const [d, m, y] = ddmmyyyy.split('-');
  return `${y}-${m}-${d}`;
};
const fromInputDate = (yyyymmdd: string) => {
  const [y, m, d] = yyyymmdd.split('-');
  return `${d}-${m}-${y}`;
};

export default function EditExpenseDialog({ actualDate, product }: Props) {
  const { isOpen, setIsOpen, close } = useDialogState(false);
  const { isDarkMode } = useTheme();
  const [labelOptions, setLabelOptions] = useState<OptionType[]>(LabelOptions);
  const { mutateAsync: edit, isPending } = useEditExpense();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditExpenseFormInput>({
    resolver: zodResolver(editExpenseFormSchema),
    defaultValues: {
      expenseDate: actualDate,
      expenseName: product.name,
      expenseCategory: product.category,
      expensePrice: product.price,
      selectedLabel: product.label
        ? { value: product.label, label: product.label }
        : null,
    },
  });

  const onSubmit = handleSubmit(async (raw) => {
    const v = editExpenseFormSchema.parse(raw);
    await toast.promise(
      edit({
        expenseId: product._id,
        actualDate,
        expenseName: v.expenseName,
        expensePrice: v.expensePrice,
        expenseCategory: v.expenseCategory,
        expenseDate: v.expenseDate,
        selectedLabel: v.selectedLabel?.value ?? null,
      }),
      {
        loading: 'Updating expense...',
        success: 'Expense updated.',
        error: 'Could not update expense.',
      },
    );
    close();
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-green-600 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
          <Edit className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="max-w-2xl overflow-visible"
      >
        <DialogTitle className="hidden" />
        <form
          onSubmit={onSubmit}
          noValidate
          className="flex w-full flex-col items-start justify-start gap-4 rounded-md border border-border_light bg-bg_primary_light shadow-sm dark:border-none dark:border-border_dark dark:bg-transparent"
        >
          <h4 className="text-base font-semibold">Edit Your Expense</h4>
          <div className="flex w-full flex-col gap-5">
            <div className="col-span-10 grid w-full grid-cols-10 gap-5">
              <div className="col-span-10 flex flex-col gap-1 sm:col-span-5">
                <p className="text-sm">Date of Expense *</p>
                <Controller
                  name="expenseDate"
                  control={control}
                  render={({ field }) => (
                    <input
                      type="date"
                      value={field.value ? toInputDate(field.value) : ''}
                      onChange={(e) =>
                        field.onChange(e.target.value ? fromInputDate(e.target.value) : '')
                      }
                      className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-bg_secondary_dark"
                    />
                  )}
                />
                {errors.expenseDate && (
                  <span className="ml-1 text-sm text-red-500">
                    {errors.expenseDate.message}
                  </span>
                )}
              </div>

              <div className="col-span-10 flex flex-col gap-1 sm:col-span-5">
                <p className="text-sm">Name of Expense *</p>
                <Input
                  {...register('expenseName')}
                  type="text"
                  placeholder="Enter Expense"
                />
                {errors.expenseName && (
                  <span className="ml-1 text-sm text-red-500">
                    {errors.expenseName.message}
                  </span>
                )}
              </div>

              <Controller
                name="expenseCategory"
                control={control}
                render={({ field }) => (
                  <SelectField
                    label="Expenses Category"
                    required
                    placeholder="Choose Category"
                    options={expensesCategories}
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.expenseCategory?.message}
                    className="col-span-10 flex flex-col gap-1 sm:col-span-5"
                  />
                )}
              />

              <div className="col-span-10 flex flex-col gap-1 sm:col-span-5">
                <p className="text-sm">Expense Price *</p>
                <Input
                  {...register('expensePrice')}
                  type="number"
                  step="any"
                  placeholder="Enter Price"
                />
                {errors.expensePrice && (
                  <span className="ml-1 text-sm text-red-500">
                    {errors.expensePrice.message}
                  </span>
                )}
              </div>

              <div className="col-span-10 flex flex-col gap-1 sm:col-span-5">
                <p className="text-sm">Label</p>
                <Controller
                  name="selectedLabel"
                  control={control}
                  render={({ field }) => (
                    <CreatableSelect
                      placeholder="Choose Label"
                      options={labelOptions}
                      value={field.value as OptionType | null}
                      onChange={(opt) => field.onChange(opt)}
                      onCreateOption={(input) => {
                        const o = { value: input.toLowerCase(), label: input };
                        setLabelOptions((prev) => [...prev, o]);
                        field.onChange(o);
                      }}
                      isSearchable
                      styles={getCustomReactSelectStyles(isDarkMode)}
                    />
                  )}
                />
              </div>
            </div>

            <div className="mt-2 flex items-center justify-end gap-4">
              <Button type="button" variant="outline" onClick={close} className="w-32">
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isPending}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  'Update Expense'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
