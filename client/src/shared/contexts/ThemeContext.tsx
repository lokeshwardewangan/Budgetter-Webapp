import { createContext, useCallback, useContext, useEffect, useState } from 'react';

type ThemeContextValue = {
  isDarkMode: boolean;
  toggle: () => void;
  setDark: (value: boolean) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

const STORAGE_KEY = 'isDarkMode';

function readInitial(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(readInitial);

  // Reflect the current preference on <body> + localStorage on every change.
  useEffect(() => {
    document.body.classList.toggle('dark', isDarkMode);
    try {
      localStorage.setItem(STORAGE_KEY, String(isDarkMode));
    } catch {
      /* storage disabled, no-op */
    }
  }, [isDarkMode]);

  const toggle = useCallback(() => setIsDarkMode((v) => !v), []);
  const setDark = useCallback((value: boolean) => setIsDarkMode(value), []);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggle, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within <ThemeProvider>');
  return ctx;
}
