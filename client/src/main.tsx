import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import axios from 'axios';
import 'remixicon/fonts/remixicon.css';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App.tsx';
import './index.css';
import '../src/styles/global.css';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';

const GoogleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60_000,
      gcTime: 30 * 60_000,
      refetchOnWindowFocus: false,
      retry: (count, err) => {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          if (status === 401 || status === 403) return false;
        }
        return count < 1;
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GoogleClientID}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <App />
            <ReactQueryDevtools />
          </ThemeProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>
);
