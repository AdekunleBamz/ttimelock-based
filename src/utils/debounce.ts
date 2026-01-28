// Debounce utility with cancel support

interface DebouncedFunction<T extends (...args: Parameters<T>) => ReturnType<T>> {
  (...args: Parameters<T>): void;
  cancel: () => void;
  flush: () => void;
}

export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  func: T,
  wait: number,
  options: { leading?: boolean; trailing?: boolean } = {}
): DebouncedFunction<T> {
  const { leading = false, trailing = true } = options;
  
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;
  let lastThis: unknown = null;
  let result: ReturnType<T> | undefined;
  let lastCallTime: number | undefined;
  let lastInvokeTime = 0;

  function invokeFunc(time: number): ReturnType<T> | undefined {
    const args = lastArgs;
    const thisArg = lastThis;

    lastArgs = null;
    lastThis = null;
    lastInvokeTime = time;
    result = func.apply(thisArg, args as Parameters<T>);
    return result;
  }

  function shouldInvoke(time: number): boolean {
    const timeSinceLastCall = lastCallTime === undefined ? 0 : time - lastCallTime;
    const timeSinceLastInvoke = time - lastInvokeTime;

    return (
      lastCallTime === undefined ||
      timeSinceLastCall >= wait ||
      timeSinceLastCall < 0 ||
      timeSinceLastInvoke >= wait
    );
  }

  function timerExpired(): void {
    const time = Date.now();
    if (shouldInvoke(time)) {
      if (trailing && lastArgs) {
        invokeFunc(time);
      }
    } else {
      timeoutId = setTimeout(timerExpired, wait - (time - (lastCallTime || 0)));
    }
  }

  function debounced(this: unknown, ...args: Parameters<T>): void {
    const time = Date.now();
    const isInvoking = shouldInvoke(time);

    lastArgs = args;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timeoutId === null) {
        lastInvokeTime = time;
        timeoutId = setTimeout(timerExpired, wait);
        if (leading) {
          invokeFunc(time);
        }
        return;
      }
    }

    if (timeoutId === null) {
      timeoutId = setTimeout(timerExpired, wait);
    }
  }

  debounced.cancel = function (): void {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }
    lastInvokeTime = 0;
    lastArgs = null;
    lastCallTime = undefined;
    lastThis = null;
    timeoutId = null;
  };

  debounced.flush = function (): void {
    if (timeoutId !== null && lastArgs) {
      invokeFunc(Date.now());
      debounced.cancel();
    }
  };

  return debounced;
}
