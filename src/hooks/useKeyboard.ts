import { useEffect, useCallback } from 'react';

type KeyHandler = (event: KeyboardEvent) => void;

export function useKeyboard(key: string, handler: KeyHandler, enabled = true) {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (event.key === key) {
      handler(event);
    }
  }, [key, handler]);

  useEffect(() => {
    if (!enabled) return;
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown, enabled]);
}
