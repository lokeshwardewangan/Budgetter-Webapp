import { forwardRef, useCallback, useRef } from 'react';
import { flushSync } from 'react-dom';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { cn } from '@/lib/utils';

export type TransitionVariant =
  | 'circle'
  | 'square'
  | 'triangle'
  | 'diamond'
  | 'hexagon'
  | 'rectangle'
  | 'star';

interface AnimatedThemeTogglerProps
  extends React.ComponentPropsWithoutRef<'button'> {
  duration?: number;
  variant?: TransitionVariant;
  /** When true, the transition expands from the viewport center instead of the button center. */
  fromCenter?: boolean;
}

function polygonCollapsed(cx: number, cy: number, vertexCount: number): string {
  const pairs = Array.from(
    { length: vertexCount },
    () => `${cx}px ${cy}px`
  ).join(', ');
  return `polygon(${pairs})`;
}

function getThemeTransitionClipPaths(
  variant: TransitionVariant,
  cx: number,
  cy: number,
  maxRadius: number,
  viewportWidth: number,
  viewportHeight: number
): [string, string] {
  switch (variant) {
    case 'circle':
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
    case 'square': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const halfSide = Math.max(halfW, halfH) * 1.05;
      const end = [
        `${cx - halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy - halfSide}px`,
        `${cx + halfSide}px ${cy + halfSide}px`,
        `${cx - halfSide}px ${cy + halfSide}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'triangle': {
      const scale = maxRadius * 2.2;
      const dx = (Math.sqrt(3) / 2) * scale;
      const verts = [
        `${cx}px ${cy - scale}px`,
        `${cx + dx}px ${cy + 0.5 * scale}px`,
        `${cx - dx}px ${cy + 0.5 * scale}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 3), `polygon(${verts})`];
    }
    case 'diamond': {
      const R = maxRadius * Math.SQRT2;
      const end = [
        `${cx}px ${cy - R}px`,
        `${cx + R}px ${cy}px`,
        `${cx}px ${cy + R}px`,
        `${cx - R}px ${cy}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'hexagon': {
      const R = maxRadius * Math.SQRT2;
      const verts: string[] = [];
      for (let i = 0; i < 6; i++) {
        const a = -Math.PI / 2 + (i * Math.PI) / 3;
        verts.push(`${cx + R * Math.cos(a)}px ${cy + R * Math.sin(a)}px`);
      }
      return [polygonCollapsed(cx, cy, 6), `polygon(${verts.join(', ')})`];
    }
    case 'rectangle': {
      const halfW = Math.max(cx, viewportWidth - cx);
      const halfH = Math.max(cy, viewportHeight - cy);
      const end = [
        `${cx - halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy - halfH}px`,
        `${cx + halfW}px ${cy + halfH}px`,
        `${cx - halfW}px ${cy + halfH}px`,
      ].join(', ');
      return [polygonCollapsed(cx, cy, 4), `polygon(${end})`];
    }
    case 'star': {
      const R = maxRadius * Math.SQRT2 * 1.03;
      const innerRatio = 0.42;
      const starPolygon = (radius: number) => {
        const verts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const outerA = -Math.PI / 2 + (i * 2 * Math.PI) / 5;
          verts.push(
            `${cx + radius * Math.cos(outerA)}px ${cy + radius * Math.sin(outerA)}px`
          );
          const innerA = outerA + Math.PI / 5;
          verts.push(
            `${cx + radius * innerRatio * Math.cos(innerA)}px ${cy + radius * innerRatio * Math.sin(innerA)}px`
          );
        }
        return `polygon(${verts.join(', ')})`;
      };
      const startR = Math.max(2, R * 0.025);
      return [starPolygon(startR), starPolygon(R)];
    }
    default:
      return [
        `circle(0px at ${cx}px ${cy}px)`,
        `circle(${maxRadius}px at ${cx}px ${cy}px)`,
      ];
  }
}

export const AnimatedThemeToggler = forwardRef<
  HTMLButtonElement,
  AnimatedThemeTogglerProps
>(
  (
    {
      className,
      duration = 400,
      variant = 'circle',
      fromCenter = false,
      onClick,
      children,
      ...props
    },
    forwardedRef
  ) => {
    const localRef = useRef<HTMLButtonElement>(null);
    const buttonRef =
      (forwardedRef as React.RefObject<HTMLButtonElement>) ?? localRef;
    const { toggle } = useTheme();

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(event);
        const button = buttonRef.current;
        if (!button) return;

        // No View Transitions support (Firefox, older browsers) — just flip.
        if (typeof document.startViewTransition !== 'function') {
          toggle();
          return;
        }

        const viewportWidth = window.visualViewport?.width ?? window.innerWidth;
        const viewportHeight =
          window.visualViewport?.height ?? window.innerHeight;

        let x: number, y: number;
        if (fromCenter) {
          x = viewportWidth / 2;
          y = viewportHeight / 2;
        } else {
          const { top, left, width, height } = button.getBoundingClientRect();
          x = left + width / 2;
          y = top + height / 2;
        }

        const maxRadius = Math.hypot(
          Math.max(x, viewportWidth - x),
          Math.max(y, viewportHeight - y)
        );
        const clipPath = getThemeTransitionClipPaths(
          variant,
          x,
          y,
          maxRadius,
          viewportWidth,
          viewportHeight
        );

        const root = document.documentElement;
        root.dataset.magicuiThemeVt = 'active';
        root.style.setProperty(
          '--magicui-theme-toggle-vt-duration',
          `${duration}ms`
        );
        root.style.setProperty('--magicui-theme-vt-clip-from', clipPath[0]);
        const cleanup = () => {
          delete root.dataset.magicuiThemeVt;
          root.style.removeProperty('--magicui-theme-toggle-vt-duration');
          root.style.removeProperty('--magicui-theme-vt-clip-from');
        };

        // Apply theme synchronously so the VT snapshot picks up the new state.
        // Also toggle body.dark directly so the snapshot is correct even
        // before MainLayout's effect re-fires (effect is idempotent).
        const transition = document.startViewTransition(() => {
          flushSync(() => {
            document.body.classList.toggle('dark');
            toggle();
          });
        });
        transition?.finished?.finally(cleanup);

        transition?.ready?.then(() => {
          document.documentElement.animate(
            { clipPath },
            {
              duration,
              easing: variant === 'star' ? 'linear' : 'ease-in-out',
              fill: 'forwards',
              pseudoElement: '::view-transition-new(root)',
            }
          );
        });
      },
      [onClick, toggle, variant, fromCenter, duration, buttonRef]
    );

    return (
      <button
        type="button"
        ref={buttonRef}
        onClick={handleClick}
        className={cn(className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);
AnimatedThemeToggler.displayName = 'AnimatedThemeToggler';
