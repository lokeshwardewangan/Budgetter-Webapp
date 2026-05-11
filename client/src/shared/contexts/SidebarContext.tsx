import { createContext, useCallback, useContext, useMemo, useState } from 'react';

type SidebarContextValue = {
  isOpen: boolean;
  showOverlay: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

const isMobileBreakpoint = () =>
  typeof window !== 'undefined' && window.innerWidth < 768;

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  // Mirrors the legacy redux slice's default: open on desktop, closed on mobile.
  const [isOpen, setIsOpen] = useState<boolean>(() => !isMobileBreakpoint());
  const [showOverlay, setShowOverlay] = useState<boolean>(() => !isMobileBreakpoint());

  const open = useCallback(() => {
    setIsOpen(true);
    setShowOverlay(true);
  }, []);

  const close = useCallback(() => {
    if (isMobileBreakpoint()) {
      setIsOpen(false);
      setShowOverlay(false);
    }
  }, []);

  const toggle = useCallback(() => {
    setIsOpen((v) => !v);
    setShowOverlay((v) => !v);
  }, []);

  const value = useMemo(
    () => ({ isOpen, showOverlay, open, close, toggle }),
    [isOpen, showOverlay, open, close, toggle],
  );

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within <SidebarProvider>');
  return ctx;
}
