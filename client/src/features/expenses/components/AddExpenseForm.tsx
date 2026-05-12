import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CirclePlus, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import CreatableSelect from 'react-select/creatable';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DatePicker } from '@/components/ui/DatePicker';
import { SelectField } from '@/shared/components/form/SelectField';
import { formatDate } from '@/utils/date/date';
import { expensesCategories } from '@/utils/ui/utility';
import { LabelOptions, type OptionType } from '@/utils/utility';
import { getCustomReactSelectStyles } from '@/styles/global';
import { addExpenseFormSchema, type AddExpenseFormInput } from '../schemas';
import { useAddExpenses } from '../hooks';

export default function AddExpenseForm() {
  const { isDarkMode } = useTheme();
  const [labelOptions, setLabelOptions] = useState<OptionType[]>(LabelOptions);
  const { mutateAsync: add, isPending } = useAddExpenses();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddExpenseFormInput>({
    resolver: zodResolver(addExpenseFormSchema),
    mode: 'onTouched',
    defaultValues: {
      inputDate: new Date(),
      expenseName: '',
      expenseCategory: '',
      price: '',
      selectedLabel: null,
    },
  });

  const onSubmit = handleSubmit(async (raw) => {
    const v = addExpenseFormSchema.parse(raw);
    await toast.promise(
      add({
        pastDaysExpensesArray: [
          {
            date: formatDate(v.inputDate),
            productsArray: [
              {
                name: v.expenseName,
                price: v.price,
                category: v.expenseCategory,
                label: v.selectedLabel?.value ?? null,
              },
            ],
          },
        ],
      }),
      {
        loading: 'Adding expense...',
        success: 'Expense added.',
        error: 'Something went wrong.',
      },
    );
    // Reset name + price; keep date / category / label sticky so users can
    // add several rows in a row without re-picking the context.
    reset({
      inputDate: raw.inputDate,
      expenseName: '',
      expenseCategory: raw.expenseCategory,
      price: '',
      selectedLabel: raw.selectedLabel,
    });
  });

  return (
    <div className="add_expense_container flex w-full flex-col items-start justify-start gap-4 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
      <h4 className="text-base font-semibold">Add Your Expenses</h4>
      <form
        onSubmit={onSubmit}
        noValidate
        className="flex w-full flex-col flex-wrap items-start justify-start gap-3 md:gap-5"
      >
        <div className="input_containers grid w-full max-w-7xl grid-cols-10 gap-3 md:gap-5">
          <div className="input_section col-span-10 flex w-full flex-col items-start justify-start gap-1 sm:col-span-5 xl:col-span-2">
            <p className="text-sm">
              Date of Expense <span className="text-red-500 dark:text-red-200">*</span>
            </p>
            <Controller
              name="inputDate"
              control={control}
              render={({ field }) => (
                <DatePicker
                  inputDate={field.value}
                  setInputDate={(d) => field.onChange(d)}
                />
              )}
            />
            {errors.inputDate && (
              <span role="alert" className="mt-1 block text-xs font-medium text-red-500">
                {errors.inputDate.message as string}
              </span>
            )}
          </div>

          <div className="input_section col-span-10 flex w-full flex-col items-start justify-start gap-1 sm:col-span-5 xl:col-span-2">
            <p className="text-sm">
              Name of Expense <span className="text-red-500 dark:text-red-200">*</span>
            </p>
            <Input {...register('expenseName')} type="text" placeholder="Enter Expense" />
            {errors.expenseName && (
              <span role="alert" className="mt-1 block text-xs font-medium text-red-500">
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
                className="input_section col-span-10 flex w-full flex-col items-start justify-start gap-1 sm:col-span-5 xl:col-span-2"
              />
            )}
          />

          <div className="input_section col-span-10 flex w-full flex-col items-start justify-start gap-1 sm:col-span-5 xl:col-span-2">
            <p className="text-sm">
              Expense Price <span className="text-red-500 dark:text-red-200">*</span>
            </p>
            <Input
              {...register('price')}
              type="number"
              step="any"
              placeholder="Enter Price"
            />
            {errors.price && (
              <span role="alert" className="mt-1 block text-xs font-medium text-red-500">{errors.price.message}</span>
            )}
          </div>

          <div className="input_section col-span-10 flex w-full flex-col items-start justify-start gap-1 sm:col-span-5 xl:col-span-2">
            <p className="text-sm">
              Label <span className="text-xs font-medium">(optional)</span>
            </p>
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
        <div className="action_buttons flex items-center justify-start gap-4 py-2">
          <Button
            id="add_new_expense_section"
            type="submit"
            disabled={isPending}
            className="bg-blue-500"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <CirclePlus className="mr-1.5 h-4 w-4" /> Add Expense
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
