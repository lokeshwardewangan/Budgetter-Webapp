import { useCallback, useState } from 'react';

// Standard open/close/toggle state for dialogs. Replaces the
// `const [isOpen, setIsOpen] = useState(false)` + handler boilerplate that
// was duplicated across every confirm dialog in the codebase.
export function useDialogState(initial = false) {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, setIsOpen, open, close, toggle };
}
