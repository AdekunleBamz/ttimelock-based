import { useEffect, useRef, useState } from 'react';

interface UseIdleOptions {
  timeoutMs?: number;
  events?: string[];
}

const DEFAULT_EVENTS = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

export function useIdle({ timeoutMs = 5 * 60 * 1000, events = DEFAULT_EVENTS }: UseIdleOptions = {}) {
  const [isIdle, setIsIdle] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const resetTimer = () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      setIsIdle(false);
      timeoutRef.current = setTimeout(() => setIsIdle(true), timeoutMs);
    };

    const handleEvent = () => resetTimer();

    events.forEach((event) => window.addEventListener(event, handleEvent));
    resetTimer();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      events.forEach((event) => window.removeEventListener(event, handleEvent));
    };
  }, [timeoutMs, events]);

  return isIdle;
}
