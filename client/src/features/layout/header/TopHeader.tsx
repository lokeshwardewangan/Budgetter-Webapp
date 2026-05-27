import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';
import { getTopHeaderName } from '@/components/hooks/HeaderName';
import { useSidebar } from '@/components/ui/sidebar';
import { TOUR_IDS } from '@/features/tour';
import HeaderActions from './HeaderActions';

export default function TopHeader() {
  const location = useLocation();
  const { toggleSidebar } = useSidebar();

  const [currentHeaderName, setCurrentHeaderName] = useState('');

  useEffect(() => {
    setCurrentHeaderName(getTopHeaderName(location.pathname));
  }, [location.pathname]);

  return (
    <>
      <div className="topheader_container sticky top-0 z-10 flex h-16 w-full items-center bg-bg_primary_light px-1 text-text_primary_light shadow-sm dark:border-l dark:bg-bg_primary_dark dark:text-text_primary_dark">
        <button
          id={TOUR_IDS.menuToggle}
          type="button"
          aria-label="Toggle sidebar"
          onClick={toggleSidebar}
          className="mx-3 cursor-pointer border-0 bg-transparent p-0 sm:mx-4"
        >
          <i className="ri-menu-line text-xl font-bold text-text_primary_light dark:text-text_primary_dark" />
        </button>
        <div className="name text-lg">
          <h2 className="font-bold">{currentHeaderName}</h2>
        </div>
        <HeaderActions />
      </div>
      <Tooltip className="custom-react-tooltip" id="header-tooltip" />
    </>
  );
}
