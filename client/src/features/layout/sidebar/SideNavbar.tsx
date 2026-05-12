import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { Loader2, LogOut } from 'lucide-react';
import LogoImage from '../../../../public/assets/logo/logo.png';
import { getActiveRouteLink } from '@/utils/utility';
import { useLogout } from '@/features/auth/hooks';
import { useSidebar } from '@/shared/contexts/SidebarContext';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';
import type { userSidenavbarListType } from '@/data/UserSideNavbarList';

type Props = {
  userSidenavbarList: userSidenavbarListType[];
};

export default function SideNavbar({ userSidenavbarList }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const navbarRef = useRef<HTMLDivElement>(null);
  const { isOpen: isSideNavbarOpen, showOverlay, close } = useSidebar();
  const isMobile = useIsMobile();
  const { mutateAsync: logout, isPending } = useLogout();

  // Outside-click-to-close on mobile.
  useEffect(() => {
    const handle = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        overlayRef.current?.contains(target) &&
        navbarRef.current &&
        !navbarRef.current.contains(target) &&
        window.innerWidth < 768
      ) {
        close();
      }
    };
    document.addEventListener('click', handle);
    return () => document.removeEventListener('click', handle);
  }, [close]);

  return (
    <>
      {showOverlay && (
        <div
          ref={overlayRef}
          className="overlay_effect fixed inset-0 z-[11] h-full w-full bg-black/30 backdrop-blur-sm md:static"
        />
      )}
      <div
        ref={navbarRef}
        className={`sidenavbar_container fixed top-0 font-karla ${isSideNavbarOpen && !isMobile ? 'left-0 w-52' : ''} ${isSideNavbarOpen && isMobile ? 'left-0 w-52' : ''} ${!isSideNavbarOpen && !isMobile ? 'left-0 w-[68px]' : ''} ${!isSideNavbarOpen && isMobile ? 'left-[-210px] w-0' : ''} z-50 flex h-full flex-col gap-2 overflow-hidden bg-white px-3 py-5 text-text_sidebar shadow-lg dark:bg-bg_sidebar`}
      >
        <Link
          to="/"
          className="sidenavbar_heading_container relative flex items-center py-5 pl-2.5"
        >
          {!isSideNavbarOpen && !isMobile && (
            <img className="relative right-1 h-8" src={LogoImage} alt="logo" />
          )}
          {isSideNavbarOpen && (
            <>
              <img
                className="relative right-1 h-8"
                src={LogoImage}
                alt="logo"
              />
              <h1 className="ml-2 bg-gradient-to-r from-[#2e7dff] to-[#00b87c] bg-clip-text text-2xl font-bold text-transparent dark:text-gray-200">
                Budgetter
              </h1>
            </>
          )}
        </Link>

        <div
          id="sidebar_section"
          className="sidenavbar_menu_container flex flex-col gap-2 sm:gap-3"
        >
          {userSidenavbarList.map(({ route, name, icon: Icon }) => (
            <Link
              data-tooltip-id="navbarTooltip"
              data-tooltip-content={name}
              data-tooltip-place="right"
              key={route}
              to={`/${route}`}
              onClick={close}
              className={`sidenavbar_menulink_container relative flex w-full justify-start gap-3 rounded-sm px-3 py-3 sm:py-2.5 ${getActiveRouteLink() === route ? 'bg-gradient-to-r from-[#065f46]/80 via-[#047857]/80 to-[#059669]/80 font-semibold text-white dark:bg-bg_active_sidebar_link' : 'font-semibold text-slate-700 dark:text-white sm:font-medium'} items-center hover:bg-[#059669]/40 dark:hover:bg-slate-700`}
            >
              <Icon className="h-5 w-5" />
              <span
                className={`font- absolute text-base ${!isSideNavbarOpen && !isMobile && 'left-16'} ${isSideNavbarOpen && !isMobile && 'left-11'} ${isSideNavbarOpen && isMobile && 'left-11'} whitespace-nowrap capitalize`}
              >
                {name}
              </span>
            </Link>
          ))}
        </div>

        <div
          id="logout_section"
          className="menu_logout_container absolute bottom-5 left-3 right-3 flex flex-col gap-3"
        >
          <button
            data-tooltip-id="navbarTooltip"
            data-tooltip-content="Logout"
            data-tooltip-place="right"
            className="logout_container relative flex w-full items-center justify-start gap-3 rounded-sm bg-gradient-to-r from-[#065f46]/80 via-[#047857]/80 to-[#059669]/80 px-3 py-2.5 hover:bg-gradient-to-tr"
            onClick={() => logout()}
          >
            {isPending ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="absolute left-12">Signing out…</span>
              </>
            ) : (
              <>
                <LogOut className="h-5 w-5" />
                <span
                  className={`absolute text-base ${!isSideNavbarOpen && !isMobile && 'left-16'} ${isSideNavbarOpen && !isMobile && 'left-11'} ${isSideNavbarOpen && isMobile && 'left-11'} whitespace-nowrap capitalize`}
                >
                  Logout
                </span>
              </>
            )}
          </button>
        </div>
      </div>
      <Tooltip
        className="custom-react-tooltip dark:custom-react-tooltip"
        id="navbarTooltip"
      />
    </>
  );
}
