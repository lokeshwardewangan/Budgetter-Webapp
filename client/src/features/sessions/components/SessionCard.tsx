import { Loader2, Monitor, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/hooks';
import type { SessionEntry } from '@/types/api/auth/auth';
import { useDeleteSession } from '../hooks';

type Props = {
  session: SessionEntry;
  isActive: boolean;
};

export default function SessionCard({ session, isActive }: Props) {
  const { mutateAsync: deleteOne, isPending } = useDeleteSession();
  const { mutateAsync: logout, isPending: logoutPending } = useLogout();

  const [browser, os] = (session.userAgent ?? '').split(' on ');
  const isMobile = /mobile|android|iphone|ipad/i.test(session.userAgent || '');

  const formatTs = (ts?: string) =>
    ts ? new Date(ts).toLocaleString() : 'N/A';

  return (
    <div className="flex flex-wrap items-center justify-center gap-y-2 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-bg_secondary_dark sm:justify-between">
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-bg_primary_dark">
          {isMobile ? (
            <Smartphone className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          ) : (
            <Monitor className="h-6 w-6 text-gray-700 dark:text-gray-300" />
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {browser || 'Unknown'} on {os || 'Unknown'}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Login Time: {formatTs(session.createdAt)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Last used: {formatTs(session.lastUsedAt)}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            IP: {session.ip}
            {isActive && (
              <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/40 dark:text-green-400">
                Current
              </span>
            )}
          </p>
        </div>
      </div>

      <Button
        disabled={isActive ? logoutPending : isPending}
        onClick={() => (isActive ? logout() : deleteOne(session._id))}
        className="inline-flex items-center rounded-md bg-gradient-to-br from-red-500 via-red-500/80 to-red-500/70 px-3 py-1.5 text-sm font-medium text-white shadow hover:from-red-500 hover:via-red-500 hover:to-red-500 focus:outline-none"
      >
        {isPending || logoutPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Deleting..
          </>
        ) : (
          'Log out'
        )}
      </Button>
    </div>
  );
}
