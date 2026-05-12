import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useMeVerified } from '@/features/auth/hooks';
import { useMe } from '@/features/user/hooks';

type Notification = { value: string };

export default function NotificationsPopover() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const { data: user } = useMe();
  const isVerified = user?.isVerified;
  const { data: verifiedFromServer } = useMeVerified();

  // Auto-open the popover once if the user is unverified.
  useEffect(() => {
    if (isVerified === false) setOpen(true);
  }, []);

  useEffect(() => {
    if (verifiedFromServer || isVerified) {
      setNotifications([]);
    } else {
      setNotifications([
        { value: 'Your Account is not Verified, Please Check Your Email.' },
      ]);
    }
  }, [verifiedFromServer, isVerified]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="container_notification relative">
          <button
            id="notification_section"
            className="notification_icon group relative flex h-10 w-10 cursor-pointer items-center overflow-hidden rounded-full bg-[#f2f5fa] p-2.5 text-black transition-all duration-300 hover:h-9 hover:bg-[#047857]/20 focus:outline-none dark:bg-[#10101c] dark:text-white dark:hover:bg-slate-700 sm:hover:w-[132px] sm:hover:px-4"
          >
            <Bell className="h-5 w-5 shrink-0 transition-all duration-300" />
            <span className="ml-1.5 whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100">
              Notification
            </span>
          </button>
          {notifications.length !== 0 && (
            <span className="absolute -right-0 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#DC4EA2] text-xs text-white">
              {notifications.length}
            </span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="mr-2 w-auto p-2 px-3">
        <p className="cursor-pointer" onClick={() => setOpen(false)}>
          {notifications.length === 0
            ? ' No Notification 😊'
            : notifications.map(({ value }, i) => (
                <span key={i} className="font-medium text-red-700">
                  {value}
                </span>
              ))}
        </p>
      </PopoverContent>
    </Popover>
  );
}
