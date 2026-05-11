import { PopoverForm } from '@/components/ui/popover-form';
import { useDialogState } from '@/shared/hooks/useDialogState';
import { useMe } from '@/features/user/hooks';
import { useSessions } from '../hooks';
import SessionCard from './SessionCard';
import SessionsListSkeleton from './SessionsListSkeleton';
import LogOutOtherDevicesButton from './LogOutOtherDevicesButton';

export default function SessionsPopover() {
  const { isOpen, setIsOpen } = useDialogState(false);
  const { data: sessions = [], isLoading, refetch } = useSessions({ enabled: isOpen });
  const { data: user } = useMe();

  // /me returns the current device's session under `currentSession[0]`.
  const currentSessionId = user?.currentSession?.[0]?._id;

  return (
    <div className="flex w-full items-center justify-center">
      <PopoverForm
        title="Show All Sessions"
        open={isOpen}
        setOpen={setIsOpen}
        width="364px"
        height="192px"
        showSuccess={false}
        handleShowSession={() => refetch()}
        openChild={
          <div className="mx-auto w-full max-w-3xl space-y-2 p-4">
            <div className="heading_part flex justify-between px-2">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Active Sessions
              </h2>
              {sessions.length > 0 && <LogOutOtherDevicesButton />}
            </div>

            {isLoading && <SessionsListSkeleton />}

            <div className="flex flex-col gap-3">
              {!isLoading && sessions.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No active sessions found.
                </p>
              )}
              {sessions.map((session) => (
                <SessionCard
                  key={session._id}
                  session={session}
                  isActive={currentSessionId === session._id}
                />
              ))}
            </div>
          </div>
        }
      />
    </div>
  );
}
