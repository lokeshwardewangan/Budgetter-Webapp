import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { HelmetProvider } from 'react-helmet-async';
import 'remixicon/fonts/remixicon.css';
import 'react-tooltip/dist/react-tooltip.css';
import App from './App.tsx';
import './index.css';
import '../src/styles/global.css';
import { ThemeProvider } from '@/shared/contexts/ThemeContext';
import { SidebarProvider } from '@/shared/contexts/SidebarContext';

const GoogleClientID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GoogleClientID}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <SidebarProvider>
              <App />
              <ReactQueryDevtools />
            </SidebarProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </StrictMode>
);
