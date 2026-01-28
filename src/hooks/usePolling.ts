import { useState, useEffect, useCallback, useRef } from 'react';

interface UsePollingOptions<T> {
  interval: number;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  retryOnError?: boolean;
  maxRetries?: number;
}

interface UsePollingResult<T> {
  data: T | null;
  error: Error | null;
  isLoading: boolean;
  lastUpdated: Date | null;
  refetch: () => Promise<void>;
  start: () => void;
  stop: () => void;
  isPolling: boolean;
}

export function usePolling<T>(
  fetcher: () => Promise<T>,
  options: UsePollingOptions<T>
): UsePollingResult<T> {
  const { 
    interval, 
    enabled = true, 
    onSuccess, 
    onError,
    retryOnError = true,
    maxRetries = 3 
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isPolling, setIsPolling] = useState(enabled);
  
  const retryCount = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await fetcher();
      setData(result);
      setError(null);
      setLastUpdated(new Date());
      retryCount.current = 0;
      onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err));
      setError(error);
      onError?.(error);
      
      if (!retryOnError || retryCount.current >= maxRetries) {
        stop();
      } else {
        retryCount.current++;
      }
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, onSuccess, onError, retryOnError, maxRetries]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsPolling(true);
    fetchData();
    intervalRef.current = setInterval(fetchData, interval);
  }, [fetchData, interval]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsPolling(false);
  }, []);

  useEffect(() => {
    if (enabled) {
      start();
    }
    return stop;
  }, [enabled, start, stop]);

  return {
    data,
    error,
    isLoading,
    lastUpdated,
    refetch: fetchData,
    start,
    stop,
    isPolling,
  };
}
