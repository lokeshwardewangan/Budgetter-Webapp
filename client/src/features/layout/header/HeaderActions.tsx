import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Fullscreen, Minimize, Play } from 'lucide-react';
import { ThemeToggleButton } from '@/components/ui/theme-toggle-button';
import { useMe } from '@/features/user/hooks';
import NotificationsPopover from './NotificationsPopover';

type Props = {
  onStartTour: () => void;
};

// Right-hand cluster of header buttons: tour, fullscreen, theme,
// notifications, profile link. Each individual concern that grew larger
// (notifications) is its own component; tour + fullscreen are tiny enough
// to live inline.
export default function HeaderActions({ onStartTour }: Props) {
  const [isFull, setIsFull] = useState(false);
  const { data: user } = useMe();
  const avatar = user?.avatar;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      setIsFull(true);
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Fullscreen failed: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
      setIsFull(false);
    }
  };

  return (
    <div className="notification_and_profile_ absolute right-4 flex items-center justify-center gap-2.5 sm:right-6">
      <button
        id="start_tour_guide"
        onClick={onStartTour}
        className="group flex h-10 w-10 cursor-pointer items-center overflow-hidden rounded-full bg-[#f2f5fa] p-2.5 text-black transition-all duration-300 hover:bg-[#047857]/20 focus:outline-none dark:bg-[#10101c] dark:text-white dark:hover:bg-slate-700 sm:hover:h-9 sm:hover:w-[132px] sm:hover:px-4"
      >
        <Play className="h-5 w-5 shrink-0 transition-all duration-300" />
        <span className="ml-1.5 whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100">
          Take a Tour
        </span>
      </button>

      <button
        onClick={toggleFullscreen}
        id="fullscreens_tour_guide"
        className={`group hidden h-10 w-10 cursor-pointer items-center overflow-hidden rounded-full bg-[#f2f5fa] p-2.5 text-black transition-all duration-300 hover:h-9 hover:w-[118px] hover:bg-[#047857]/20 hover:px-4 focus:outline-none dark:bg-[#10101c] dark:text-white dark:hover:bg-slate-700 sm:flex ${isFull ? 'bg-[#047857]/20 dark:bg-slate-700' : ''}`}
      >
        {!isFull ? (
          <Fullscreen className="h-5 w-5 shrink-0 transition-all duration-300" />
        ) : (
          <Minimize className="h-5 w-5 shrink-0 transition-all duration-300" />
        )}
        <span className="ml-1.5 whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          {isFull ? 'Minimize' : 'Maximize'}
        </span>
      </button>

      <ThemeToggleButton variant="circle-blur" start="top-left" />
      <NotificationsPopover />

      <Link
        id="profile_section"
        to="/user/profile"
        className="group flex h-9 w-9 items-center justify-start gap-1 overflow-hidden rounded-full border border-pink-300 transition-all duration-300 hover:border-pink-200 hover:bg-[#047857]/20 dark:border-0 dark:hover:bg-slate-700 sm:flex sm:hover:w-32 sm:hover:p-1 sm:hover:py-2"
      >
        <img
          src={avatar}
          alt="avatar"
          className="h-9 w-9 shrink-0 rounded-full object-cover sm:group-hover:h-8 sm:group-hover:w-8"
        />
        <span className="whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100">
          Visit Profile
        </span>
      </Link>
    </div>
  );
}
