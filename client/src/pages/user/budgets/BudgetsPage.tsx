import { useState } from 'react';
import {
  PlusCircle,
  Edit2,
  Trash2,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Loader2,
  Info,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { SelectField } from '@/shared/components/form/SelectField';
import { monthsNames, prevYearsName } from '@/utils/date/date';
import { expenseCategoryNames } from '@/shared/lib/expenseCategories';
import {
  useBudgets,
  useBudgetStatus,
  useCreateBudget,
  useUpdateBudget,
  useDeleteBudget,
} from '@/features/budgets/hooks';

export default function BudgetsPage() {
  const currentMonthIdx = new Date().getMonth();
  const currentYearStr = String(new Date().getFullYear());

  const [selectedMonth, setSelectedMonth] = useState<number>(
    currentMonthIdx + 1
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    Number(currentYearStr)
  );

  // Dialog states
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<{
    _id: string;
    category: string;
    limit: number;
  } | null>(null);

  // Form states
  const [formCategory, setFormCategory] = useState('');
  const [formLimit, setFormLimit] = useState('');
  const [editLimit, setEditLimit] = useState('');

  // Fetching data
  const { data: budgets = [], isLoading: isBudgetsLoading } = useBudgets(
    selectedMonth,
    selectedYear
  );
  const { data: statusData, isLoading: isStatusLoading } = useBudgetStatus(
    selectedMonth,
    selectedYear
  );

  // Mutation hooks
  const { mutateAsync: createBudgetLimit, isPending: isCreating } =
    useCreateBudget();
  const { mutateAsync: updateBudgetLimit, isPending: isUpdating } =
    useUpdateBudget();
  const { mutateAsync: deleteBudgetLimit } = useDeleteBudget();

  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCategory || !formLimit) {
      toast.error('Please choose a category and enter a limit.');
      return;
    }

    const limitVal = Number(formLimit);
    if (isNaN(limitVal) || limitVal <= 0) {
      toast.error('Please enter a valid positive number for limit.');
      return;
    }

    // Check if category budget already exists for this period
    const exists = budgets.some((b) => b.category === formCategory);
    if (exists) {
      toast.error(
        `A budget for "${formCategory}" already exists for this period.`
      );
      return;
    }

    try {
      await toast.promise(
        createBudgetLimit({
          category: formCategory,
          limit: limitVal,
          month: selectedMonth,
          year: selectedYear,
        }),
        {
          loading: 'Creating budget limit...',
          success: 'Budget limit created successfully!',
          error: (err: unknown) => {
            const e = err as { response?: { data?: { message?: string } } };
            return (
              e.response?.data?.message || 'Failed to create budget limit.'
            );
          },
        }
      );
      setIsCreateOpen(false);
      setFormCategory('');
      setFormLimit('');
    } catch {
      // Handled by toast
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget || !editLimit) return;

    const limitVal = Number(editLimit);
    if (isNaN(limitVal) || limitVal <= 0) {
      toast.error('Please enter a valid positive number for limit.');
      return;
    }

    try {
      await toast.promise(
        updateBudgetLimit({
          budgetId: editingBudget._id,
          limit: limitVal,
        }),
        {
          loading: 'Updating budget limit...',
          success: 'Budget limit updated successfully!',
          error: (err: unknown) => {
            const e = err as { response?: { data?: { message?: string } } };
            return (
              e.response?.data?.message || 'Failed to update budget limit.'
            );
          },
        }
      );
      setIsEditOpen(false);
      setEditingBudget(null);
      setEditLimit('');
    } catch {
      // Handled by toast
    }
  };

  const handleDelete = async (budgetId: string, category: string) => {
    if (
      !window.confirm(`Are you sure you want to delete the ${category} budget?`)
    )
      return;

    try {
      await toast.promise(deleteBudgetLimit(budgetId), {
        loading: 'Deleting budget...',
        success: 'Budget limit deleted.',
        error: 'Failed to delete budget limit.',
      });
    } catch {
      // Handled by toast
    }
  };

  // Helper to resolve status badge styling
  const getStatusBadge = (
    status: 'UNDER_LIMIT' | 'RUNNING_HOT' | 'EXHAUSTED'
  ) => {
    switch (status) {
      case 'UNDER_LIMIT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle className="h-3.5 w-3.5" /> Under Control
          </span>
        );
      case 'RUNNING_HOT':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2.5 py-0.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Running Hot
          </span>
        );
      case 'EXHAUSTED':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2.5 py-0.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="h-3.5 w-3.5" /> Exhausted
          </span>
        );
    }
  };

  // Get progress bar color class
  const getProgressBarColor = (percentage: number) => {
    if (percentage > 100) return 'bg-rose-500';
    if (percentage > 75) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const budgetCategoryOptions = ['Overall', ...expenseCategoryNames];

  const isLoading = isBudgetsLoading || isStatusLoading;

  return (
    <div className="w-full space-y-6">
      {/* Upper Filter & Title Row */}
      <div className="flex flex-col gap-4 rounded-md border border-border_light bg-bg_primary_light p-4 px-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-text_primary_light dark:text-text_primary_dark">
            <TrendingUp className="h-6 w-6 text-emerald-500" /> Budget Pacing
            Dashboard
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Set and track expense limits to control monthly outgoings.
          </p>
        </div>

        {/* Period Selectors */}
        <div className="flex items-center gap-3">
          <SelectField
            value={String(selectedMonth).padStart(2, '0')}
            onChange={(val) => setSelectedMonth(Number(val))}
            options={monthsNames.map((m, idx) => ({
              value: String(idx + 1).padStart(2, '0'),
              label: m,
            }))}
            className="w-36"
          />

          <SelectField
            value={String(selectedYear)}
            onChange={(val) => setSelectedYear(Number(val))}
            options={prevYearsName.map((y) => ({ value: y, label: y }))}
            className="w-28"
          />

          <Button
            onClick={() => setIsCreateOpen(true)}
            className="flex items-center gap-1.5 bg-[#059669] text-white hover:bg-[#047857]"
          >
            <PlusCircle className="h-4 w-4" /> Set Limit
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex h-64 w-full items-center justify-center rounded-md border border-border_light bg-bg_primary_light dark:border-border_dark dark:bg-bg_primary_dark">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-emerald-500" />
            <p className="text-sm text-slate-500">
              Loading budgets & pacing data...
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Overall Monthly Budget Pacing */}
          {statusData?.overall && (
            <div className="space-y-4 rounded-md border border-border_light bg-bg_primary_light p-5 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="flex items-center gap-1.5 text-lg font-bold text-text_primary_light dark:text-text_primary_dark">
                    Overall Monthly Budget
                  </h3>
                  <p className="text-xs text-slate-500">
                    Aggregated tracking of all set limits vs actual spends.
                  </p>
                </div>
                {getStatusBadge(statusData.overall.status)}
              </div>

              {/* Progress and Stats */}
              <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
                <div className="rounded-md border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="mb-1 block text-xs text-slate-500">
                    Total Limit Set
                  </span>
                  <span className="text-xl font-bold text-[#2e7dff]">
                    ₹{statusData.overall.limit.toLocaleString()}
                  </span>
                </div>
                <div className="rounded-md border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="mb-1 block text-xs text-slate-500">
                    Total Spent
                  </span>
                  <span className="text-xl font-bold text-slate-700 dark:text-slate-200">
                    ₹{statusData.overall.spent.toLocaleString()}
                  </span>
                </div>
                <div className="rounded-md border border-slate-100 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-800/40">
                  <span className="mb-1 block text-xs text-slate-500">
                    Remaining
                  </span>
                  <span
                    className={`text-xl font-bold ${
                      statusData.overall.remaining >= 0
                        ? 'text-emerald-500'
                        : 'text-rose-500'
                    }`}
                  >
                    ₹{statusData.overall.remaining.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>
                    {statusData.overall.percentageSpent.toFixed(1)}% spent
                  </span>
                  <span>
                    ₹{statusData.overall.spent.toLocaleString()} / ₹
                    {statusData.overall.limit.toLocaleString()}
                  </span>
                </div>
                <div className="h-3.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressBarColor(
                      statusData.overall.percentageSpent
                    )}`}
                    style={{
                      width: `${Math.min(statusData.overall.percentageSpent, 100)}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Category Budgets Grid */}
          <div className="space-y-4">
            <h2 className="px-1 text-lg font-bold text-text_primary_light dark:text-text_primary_dark">
              Category-Wise Spending Pacing
            </h2>

            {budgets.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-md border border-dashed border-slate-300 bg-white p-12 text-center dark:border-slate-700 dark:bg-bg_primary_dark">
                <Info className="mb-3 h-10 w-10 text-slate-400" />
                <h3 className="font-semibold text-slate-700 dark:text-slate-200">
                  No Budget Limits Set
                </h3>
                <p className="mb-5 mt-1 max-w-sm text-sm text-slate-500">
                  Setting budget limits helps you track spending in specific
                  categories such as Food or Groceries.
                </p>
                <Button
                  onClick={() => setIsCreateOpen(true)}
                  className="flex items-center gap-1.5 bg-[#059669] text-white hover:bg-[#047857]"
                >
                  <PlusCircle className="h-4 w-4" /> Create First Limit
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {statusData?.categories.map((item) => {
                  const matchingBudget = budgets.find(
                    (b) => b.category === item.category
                  );
                  return (
                    <div
                      key={item.category}
                      className="flex flex-col justify-between space-y-3 rounded-md border border-border_light bg-bg_primary_light p-4 shadow-sm dark:border-border_dark dark:bg-bg_primary_dark"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                            {item.category}
                          </h4>
                          <span className="text-xs text-slate-400">
                            Budget Limit
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(item.status)}
                          {matchingBudget && (
                            <div className="flex items-center gap-1">
                              <button
                                onClick={() => {
                                  setEditingBudget(matchingBudget);
                                  setEditLimit(String(matchingBudget.limit));
                                  setIsEditOpen(true);
                                }}
                                className="rounded p-1 text-slate-500 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800"
                                title="Edit Limit"
                              >
                                <Edit2 className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() =>
                                  handleDelete(
                                    matchingBudget._id,
                                    matchingBudget.category
                                  )
                                }
                                className="rounded p-1 text-rose-500 hover:bg-slate-100 hover:text-rose-700 dark:hover:bg-slate-800"
                                title="Delete Limit"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Spent vs Limit Progress */}
                      <div className="space-y-1 pt-1">
                        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ease-out ${getProgressBarColor(
                              item.percentageSpent
                            )}`}
                            style={{
                              width: `${Math.min(item.percentageSpent, 100)}%`,
                            }}
                          />
                        </div>
                        <div className="flex items-center justify-between pt-0.5 text-[11px] text-slate-500">
                          <span>
                            Spent: ₹{item.spent.toLocaleString()} (
                            {item.percentageSpent.toFixed(0)}
                            %)
                          </span>
                          <span>Limit: ₹{item.limit.toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Remaining Outflow pacing status info */}
                      <div className="flex items-center justify-between border-t border-slate-100 pt-2 text-xs text-slate-500 dark:border-slate-800">
                        <span>Remaining Balance:</span>
                        <span
                          className={`font-semibold ${
                            item.remaining >= 0
                              ? 'text-emerald-500'
                              : 'text-rose-500'
                          }`}
                        >
                          {item.remaining >= 0
                            ? `₹${item.remaining.toLocaleString()} left`
                            : `₹${Math.abs(item.remaining).toLocaleString()} overspent`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* CREATE DIALOG MODAL */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-bg_primary_dark">
          <DialogHeader>
            <DialogTitle>Set New Budget Limit</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Create a budget limit for a category or set an overall limit for
              the period.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateSubmit} className="space-y-4 pt-2">
            <SelectField
              label="Select Category"
              placeholder="Choose Category..."
              required
              value={formCategory}
              onChange={setFormCategory}
              options={budgetCategoryOptions}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                Limit Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 5000"
                value={formLimit}
                onChange={(e) => setFormLimit(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsCreateOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating}
                className="bg-emerald-600 text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  'Create Limit'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG MODAL */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-md bg-white dark:bg-bg_primary_dark">
          <DialogHeader>
            <DialogTitle>Edit Budget Limit</DialogTitle>
            <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
              Update the budget limit for the category {editingBudget?.category}
              .
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium">
                New Limit Amount (₹) <span className="text-rose-500">*</span>
              </label>
              <Input
                type="number"
                placeholder="e.g. 8000"
                value={editLimit}
                onChange={(e) => setEditLimit(e.target.value)}
                required
              />
            </div>

            <DialogFooter className="pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setIsEditOpen(false);
                  setEditingBudget(null);
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-emerald-600 text-white"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
