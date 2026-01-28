import { useCallback, useRef } from 'react';

interface ThrottleOptions {
  leading?: boolean;
  trailing?: boolean;
}

/**
 * Hook that returns a throttled version of the callback
 */
export function useThrottle<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  delay: number,
  options: ThrottleOptions = {}
): T {
  const { leading = true, trailing = true } = options;
  const lastRan = useRef<number>(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastArgs = useRef<Parameters<T> | null>(null);

  const throttledFn = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    lastArgs.current = args;

    if (!lastRan.current && leading) {
      callback(...args);
      lastRan.current = now;
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    const remaining = delay - (now - lastRan.current);

    if (remaining <= 0) {
      callback(...args);
      lastRan.current = now;
    } else if (trailing) {
      timeoutRef.current = setTimeout(() => {
        if (lastArgs.current) {
          callback(...lastArgs.current);
          lastRan.current = Date.now();
        }
      }, remaining);
    }
  }, [callback, delay, leading, trailing]) as T;

  return throttledFn;
}

/**
 * Hook for rate-limiting expensive operations
 */
export function useRateLimit<T extends (...args: Parameters<T>) => ReturnType<T>>(
  callback: T,
  limit: number,
  windowMs: number
): { fn: T; remaining: number; reset: () => void } {
  const calls = useRef<number[]>([]);

  const fn = useCallback((...args: Parameters<T>) => {
    const now = Date.now();
    calls.current = calls.current.filter((time: number) => now - time < windowMs);

    if (calls.current.length < limit) {
      calls.current.push(now);
      return callback(...args);
    }
    
    console.warn('Rate limit exceeded');
    return undefined as ReturnType<T>;
  }, [callback, limit, windowMs]) as T;

  const remaining = Math.max(0, limit - calls.current.length);
  const reset = () => { calls.current = []; };

  return { fn, remaining, reset };
}
