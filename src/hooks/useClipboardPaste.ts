import { useEffect, useCallback } from 'react';

export function useClipboardPaste(onPaste: (text: string) => void, enabled = true) {
  const handlePaste = useCallback((event: ClipboardEvent) => {
    const text = event.clipboardData?.getData('text');
    if (text) onPaste(text);
  }, [onPaste]);

  useEffect(() => {
    if (!enabled) return;
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [handlePaste, enabled]);
}
