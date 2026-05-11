import React from 'react';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { createAnimation } from '../theme/theme-animations';
import type {
  AnimationStart,
  AnimationVariant,
} from '../theme/theme-animations';

interface ThemeToggleAnimationProps {
  variant?: AnimationVariant;
  start?: AnimationStart;
  showLabel?: boolean;
  url?: string;
}

export function ThemeToggleButton({
  variant = 'circle-blur',
  start = 'top-left',
  showLabel = false,
  url = '',
}: ThemeToggleAnimationProps) {
  const { isDarkMode, toggle } = useTheme();

  const styleId = 'theme-transition-styles';

  const updateStyles = React.useCallback((css: string) => {
    if (typeof window === 'undefined') return;
    let styleElement = document.getElementById(styleId) as HTMLStyleElement;
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = css;
  }, []);

  const toggleTheme = React.useCallback(() => {
    const animation = createAnimation(variant, start, url);
    updateStyles(animation.css);
    if (typeof window === 'undefined') return;
    if (!document.startViewTransition) {
      toggle();
      return;
    }
    document.startViewTransition(() => toggle());
  }, [toggle, variant, start, url, updateStyles]);

  return (
    <button
      id="theme_change_tour"
      onClick={toggleTheme}
      className="theme_container_toggle group flex h-10 w-10 cursor-pointer items-center overflow-hidden rounded-full bg-[#f2f5fa] p-2.5 text-black transition-all duration-300 hover:bg-[#047857]/20 focus:outline-none dark:bg-[#10101c] dark:text-white dark:hover:bg-slate-700 sm:hover:h-9 sm:hover:w-[156px] sm:hover:px-4 sm:active:w-[156px]"
      name="Theme Toggle Button"
    >
      {!isDarkMode ? (
        <MoonIcon className="h-5 w-5 shrink-0 transition-all duration-300" />
      ) : (
        <SunIcon className="h-5 w-5 shrink-0 transition-all duration-300" />
      )}
      <span className="sr-only">Theme Toggle</span>
      {showLabel && (
        <>
          <span className="absolute -top-10 hidden rounded-full border px-2 group-hover:block">
            variant = {variant}
          </span>
          <span className="absolute -bottom-10 hidden rounded-full border px-2 group-hover:block">
            start = {start}
          </span>
        </>
      )}
      <span className="ml-1.5 whitespace-nowrap text-sm font-medium opacity-0 transition-opacity duration-300 sm:group-hover:opacity-100">
        {isDarkMode ? 'Switch to Light' : 'Switch to Dark'}
      </span>
    </button>
  );
}
