import { useCallback, useRef, useState } from 'react';

interface ClipboardState {
  copied: boolean;
  error: string | null;
}

export function useClipboard(resetDelay = 2000) {
  const [state, setState] = useState<ClipboardState>({
    copied: false,
    error: null,
  });
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = useCallback(async (text: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      setState({ copied: true, error: null });

      timeoutRef.current = setTimeout(() => {
        setState({ copied: false, error: null });
      }, resetDelay);

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Copy failed';
      setState({ copied: false, error: errorMessage });
      return false;
    }
  }, [resetDelay]);

  const reset = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setState({ copied: false, error: null });
  }, []);

  return {
    ...state,
    copy,
    reset,
  };
}

export function usePaste() {
  const [isPasting, setIsPasting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const paste = useCallback(async (): Promise<string | null> => {
    setIsPasting(true);
    setError(null);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        const text = await navigator.clipboard.readText();
        setIsPasting(false);
        return text;
      } else {
        setIsPasting(false);
        setError('Clipboard access not available');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Paste failed';
      setError(errorMessage);
      setIsPasting(false);
      return null;
    }
  }, []);

  return {
    paste,
    isPasting,
    error,
  };
}
