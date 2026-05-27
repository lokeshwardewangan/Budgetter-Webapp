import { createContext, useCallback, useContext, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { TourGuideClient } from '@sjmc11/tourguidejs';
import '@sjmc11/tourguidejs/dist/css/tour.min.css';
import './tour-dark.css';
import { useMe } from '@/features/user/hooks';
import { getStepsForRoute } from './tourSteps';

const HAS_SEEN_TOUR_KEY = 'hasSeenTour';

type TourContextValue = {
  start: () => Promise<void>;
};

const TourContext = createContext<TourContextValue | null>(null);

// Module-level singleton. The lib's constructor appends dialog/backdrop to
// <body> asynchronously and uses global element ids (#tg-dialog-title etc.),
// so a second instance breaks rendering. Init once, reuse forever — survives
// React Strict Mode's double-mount and route remounts.
let tgClient: TourGuideClient | null = null;
function getTourClient(): TourGuideClient {
  if (!tgClient && typeof window !== 'undefined') {
    tgClient = new TourGuideClient({
      backdropColor: 'rgba(0, 0, 0, 0.7)',
      backdropAnimate: true,
      dialogAnimate: true,
      keyboardControls: true,
      exitOnEscape: true,
      exitOnClickOutside: false,
      completeOnFinish: false,
      showStepDots: true,
      showStepProgress: true,
      finishLabel: 'Finish',
      nextLabel: 'Next',
      prevLabel: 'Back',
      targetPadding: 8,
      debug: false,
      steps: [],
    });
  }
  return tgClient as TourGuideClient;
}

export function TourProvider({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { data: user } = useMe();

  const start = useCallback(async () => {
    const tg = getTourClient();
    const steps = getStepsForRoute(pathname).filter((step) => {
      if (!step.target) return true; // untargeted steps (welcome) anchor to body
      const el = document.querySelector(step.target) as HTMLElement | null;
      if (!el) return false; // id not in DOM → skip
      // Skip elements hidden by display:none / visibility:hidden / `hidden` class.
      // offsetParent is null for display:none; rect.width/height 0 catches the rest.
      const rect = el.getBoundingClientRect();
      if (el.offsetParent === null && rect.width === 0 && rect.height === 0)
        return false;
      return true;
    });
    if (steps.length === 0) return;
    tg.options.steps = steps;
    tg.activeStep = 0;
    await tg.start();
  }, [pathname]);

  // Auto-trigger on a user's first login (no `lastLogin` yet, no localStorage flag).
  useEffect(() => {
    if (!user) return;
    if (user.lastLogin) return;
    if (localStorage.getItem(HAS_SEEN_TOUR_KEY)) return;
    localStorage.setItem(HAS_SEEN_TOUR_KEY, 'true');
    const t = window.setTimeout(() => {
      void start();
    }, 600);
    return () => window.clearTimeout(t);
  }, [user, start]);

  return (
    <TourContext.Provider value={{ start }}>{children}</TourContext.Provider>
  );
}

export function useTour(): TourContextValue {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within <TourProvider>');
  return ctx;
}
