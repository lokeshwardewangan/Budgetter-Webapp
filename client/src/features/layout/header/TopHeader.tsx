import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { getTopHeaderName } from '@/components/hooks/HeaderName';
import UserTourGuide from '@/components/layout/UserTourGuide';
import { useSidebar } from '@/shared/contexts/SidebarContext';
import { useMe } from '@/features/user/hooks';
import HeaderActions from './HeaderActions';

export default function TopHeader() {
  const location = useLocation();
  const { toggle } = useSidebar();
  const { data: user } = useMe();

  const [currentHeaderName, setCurrentHeaderName] = useState('');
  const [isTourTriggered, setIsTourTriggered] = useState(false);

  useEffect(() => {
    setCurrentHeaderName(getTopHeaderName(location.pathname));
  }, [location.pathname]);

  // Auto-trigger the product tour once for first-time-logging-in users.
  useEffect(() => {
    const seen = localStorage.getItem('hasSeenTour');
    if (!user?.lastLogin && !seen) {
      localStorage.setItem('hasSeenTour', 'true');
      setIsTourTriggered(true);
    }
  }, [user?.lastLogin]);

  return (
    <>
      <div className="topheader_container sticky top-0 z-10 flex h-full min-h-16 w-full items-center bg-bg_primary_light px-1 text-text_primary_light shadow-sm dark:border-l dark:bg-bg_primary_dark dark:text-text_primary_dark">
        <i
          id="menu_toggle_button_section"
          onClick={toggle}
          className="ri-menu-line mx-3 cursor-pointer text-xl font-bold text-text_primary_light dark:text-text_primary_dark sm:mx-4"
        />
        <div className="name text-lg">
          <h2 className="font-bold">{currentHeaderName}</h2>
        </div>
        <HeaderActions onStartTour={() => setIsTourTriggered(true)} />
      </div>
      <Tooltip className="custom-react-tooltip" id="header-tooltip" />
      <UserTourGuide
        isTourTriggered={isTourTriggered}
        setIsTourTriggered={setIsTourTriggered}
      />
    </>
  );
}
