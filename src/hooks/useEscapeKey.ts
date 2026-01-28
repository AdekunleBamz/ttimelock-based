import { useEffect, useCallback } from 'react';

export function useEscapeKey(handler: () => void, enabled = true) {
  const handleEscape = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') handler();
  }, [handler]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [handleEscape, enabled]);
}
