import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useDeleteOtherSessions } from '../hooks';

// Signs out every other device. The current session is preserved server-side;
// the user stays logged in here.
export default function LogOutOtherDevicesButton() {
  const { mutateAsync: deleteOthers, isPending } = useDeleteOtherSessions();

  const onClick = () =>
    toast.promise(deleteOthers(), {
      loading: 'Signing out other devices...',
      success: 'Other devices signed out.',
      error: 'Something went wrong.',
    });

  return (
    <Button
      onClick={onClick}
      disabled={isPending}
      className="inline-flex items-center gap-2 rounded-md bg-gradient-to-br from-red-500 via-red-500/80 to-red-500/70 px-3 py-1 text-sm font-medium text-white shadow hover:from-red-500 hover:via-red-500 hover:to-red-500 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      {isPending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Signing out...
        </>
      ) : (
        'Sign out other devices'
      )}
    </Button>
  );
}
