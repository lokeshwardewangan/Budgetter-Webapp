import { Check, CheckCircle, Loader2 } from 'lucide-react';
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
import toast from 'react-hot-toast';
import { useDialogState } from '@/shared/hooks/useDialogState';
import { useMarkLentMoneyReceived } from '../hooks';

type Props = {
  lentMoneyId: string;
  personName: string;
};

export default function MarkReceivedDialog({ lentMoneyId, personName }: Props) {
  const { isOpen, setIsOpen, close } = useDialogState(false);
  const { mutateAsync: markReceived, isPending } = useMarkLentMoneyReceived();

  const onConfirm = async () => {
    await toast.promise(markReceived(lentMoneyId), {
      loading: 'Marking as received...',
      success: 'Lent record updated.',
      error: 'Something went wrong.',
    });
    close();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="h-fit w-fit rounded-xl border-none bg-[#61ae41] px-2.5 py-0.5 text-xs capitalize text-white">
          money received
          <i className="ri-checkbox-circle-line ml-0.5 text-yellow-100"></i>
        </button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-primary">
            <CheckCircle className="mr-2 h-5 w-5" />
            Confirm Money Received
          </DialogTitle>
          <DialogDescription className="pt-2 text-center text-slate-700">
            Are you sure you've received the money from {personName}? This will mark
            the entry as received and update your balance.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-3 sm:gap-0 sm:space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={close}
            className="w-full flex-1 dark:hover:text-white"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onConfirm}
            disabled={isPending}
            className="w-full flex-1 dark:hover:text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Confirm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
