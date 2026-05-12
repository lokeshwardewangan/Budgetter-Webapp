import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertTriangle, Loader2, Lock, Trash2, UserX } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/shared/components/form/PasswordInput';
import { useDialogState } from '@/shared/hooks/useDialogState';
import { deleteAccountSchema, type DeleteAccountForm } from '../schemas';
import { useDeleteAccount } from '../hooks';

export default function DeleteAccountDialog() {
  const { isOpen, setIsOpen, close } = useDialogState(false);
  const { mutateAsync: doDelete, isPending } = useDeleteAccount();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<DeleteAccountForm>({
    resolver: zodResolver(deleteAccountSchema),
    mode: 'onTouched',
    defaultValues: { password: '' },
  });

  const onSubmit = handleSubmit(async (v) => {
    await toast.promise(doDelete(v.password), {
      loading: 'Deleting account...',
      success: 'Account deleted.',
      error: 'Invalid password.',
    });
    reset();
  });

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" className="hidden w-full">
          <UserX className="mr-2 h-4 w-4" />
          Delete My Account
        </Button>
      </DialogTrigger>
      <DialogContent aria-describedby={undefined} className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-destructive dark:text-red-300">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Delete Account
          </DialogTitle>
          <DialogDescription className="pt-2 text-slate-700">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} noValidate>
          <div className="relative py-4">
            <Label
              htmlFor="password"
              className="mb-2 flex items-center text-sm font-medium"
            >
              <Lock className="mr-2 h-4 w-4" />
              Confirm your password
            </Label>
            <PasswordInput
              {...register('password')}
              id="password"
              placeholder="Enter your password"
              error={errors.password?.message}
            />
          </div>

          <DialogFooter className="flex gap-3 sm:gap-0 sm:space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                close();
                reset();
              }}
              className="w-full flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isPending}
              className="w-full flex-1"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </>
              ) : (
                <>
                  <Trash2 className="mr-1.5 h-4 w-4 text-white" />
                  Delete Account
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
