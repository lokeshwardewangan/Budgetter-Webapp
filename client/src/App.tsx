import { RouterProvider } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import routes from './routes/routes';
import FollowCursor from './components/animation/FollowCursor';
import ErrorPage from './components/layout/ErrorPage';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';

Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  sendDefaultPii: true,
  tracesSampleRate: 1.0,
});

export default function App() {
  // Hide the custom cursor on mobile — drives off a media query now instead
  // of the deleted windowWidth Redux slice.
  const isMobile = useIsMobile();

  return (
    <Sentry.ErrorBoundary fallback={<ErrorPage />}>
      <RouterProvider router={routes} future={{ v7_startTransition: true }} />
      {!isMobile && <FollowCursor />}
    </Sentry.ErrorBoundary>
  );
}
