import { useState } from 'react';
import { AlertTriangle, Loader2, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useDialogState } from '@/shared/hooks/useDialogState';
import type { ExpenseProduct } from '@/types/api/expenses/expenses';
import { useDeleteExpense } from '../hooks';

type Props = {
  actualDate: string;
  product: ExpenseProduct;
};

export default function DeleteExpenseDialog({ actualDate, product }: Props) {
  const { isOpen, setIsOpen, close } = useDialogState(false);
  const [refund, setRefund] = useState(true);
  const { mutateAsync: doDelete, isPending } = useDeleteExpense();

  const onConfirm = async () => {
    await toast.promise(
      doDelete({
        expenseId: product._id,
        expenseDate: actualDate,
        isAddPriceToPocketMoney: refund,
      }),
      {
        loading: 'Deleting...',
        success: 'Expense deleted.',
        error: 'Unable to delete expense.',
      },
    );
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100 text-red-400 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700">
          <Trash2 className="h-4 w-4" />
        </button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="overflow-visible">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive dark:text-red-300">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Delete Expense
          </DialogTitle>
          <DialogDescription className="pt-2 text-slate-700">
            Are you sure you want to remove this expense? <br />
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="content_here mb-1 flex items-center justify-start gap-1.5">
          <Checkbox
            id="updatePrice"
            checked={refund}
            onCheckedChange={(checked) => setRefund(checked === true)}
          />
          <Label htmlFor="updatePrice" className="cursor-pointer">
            Refund price to pocket money?
            <span className="font-semibold text-green-700">
              {refund ? ` + ${product.price}₹ ` : ''}
            </span>
          </Label>
        </div>
        <DialogFooter className="flex gap-3 sm:gap-0 sm:space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            className="w-full flex-1"
          >
            Cancel
          </Button>
          <Button
            disabled={isPending}
            type="button"
            variant="destructive"
            onClick={onConfirm}
            className="w-full flex-1"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="mr-1.5 h-4 w-4 text-white" />
                Delete
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
