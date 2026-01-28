// Async utility functions for managing promises
// Provides utilities for async operations, delays, and promise handling

export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function timeout<T>(
  promise: Promise<T>,
  ms: number,
  errorMessage = 'Operation timed out'
): Promise<T> {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), ms);
  });
  
  return Promise.race([promise, timeoutPromise]);
}

export async function retry<T>(
  fn: () => Promise<T>,
  attempts: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: Error | undefined;
  
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (i < attempts - 1) {
        await delay(delayMs * Math.pow(2, i));
      }
    }
  }
  
  throw lastError;
}

export async function promiseAllSettled<T>(
  promises: Promise<T>[]
): Promise<Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }>> {
  return Promise.allSettled(promises) as Promise<
    Array<{ status: 'fulfilled'; value: T } | { status: 'rejected'; reason: unknown }>
  >;
}

export async function sequential<T>(
  fns: Array<() => Promise<T>>
): Promise<T[]> {
  const results: T[] = [];
  
  for (const fn of fns) {
    results.push(await fn());
  }
  
  return results;
}

export async function parallel<T>(
  fns: Array<() => Promise<T>>,
  concurrency: number = 5
): Promise<T[]> {
  const results: T[] = [];
  const executing: Promise<void>[] = [];
  
  for (let i = 0; i < fns.length; i++) {
    const fn = fns[i];
    const p = fn().then((result) => {
      results[i] = result;
    });
    
    executing.push(p as Promise<void>);
    
    if (executing.length >= concurrency) {
      await Promise.race(executing);
      executing.splice(
        executing.findIndex((ep) => ep === p),
        1
      );
    }
  }
  
  await Promise.all(executing);
  return results;
}

export function createDeferred<T>(): {
  promise: Promise<T>;
  resolve: (value: T) => void;
  reject: (reason: unknown) => void;
} {
  let resolve!: (value: T) => void;
  let reject!: (reason: unknown) => void;
  
  const promise = new Promise<T>((res, rej) => {
    resolve = res;
    reject = rej;
  });
  
  return { promise, resolve, reject };
}

export async function poll<T>(
  fn: () => Promise<T>,
  predicate: (value: T) => boolean,
  intervalMs: number = 1000,
  maxAttempts: number = 30
): Promise<T> {
  for (let i = 0; i < maxAttempts; i++) {
    const result = await fn();
    if (predicate(result)) {
      return result;
    }
    if (i < maxAttempts - 1) {
      await delay(intervalMs);
    }
  }
  
  throw new Error('Polling timed out');
}

export function memoizeAsync<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  keyFn: (...args: T) => string = (...args) => JSON.stringify(args),
  ttlMs?: number
): (...args: T) => Promise<R> {
  const cache = new Map<string, { value: R; timestamp: number }>();
  
  return async (...args: T): Promise<R> => {
    const key = keyFn(...args);
    const cached = cache.get(key);
    
    if (cached) {
      if (!ttlMs || Date.now() - cached.timestamp < ttlMs) {
        return cached.value;
      }
      cache.delete(key);
    }
    
    const value = await fn(...args);
    cache.set(key, { value, timestamp: Date.now() });
    return value;
  };
}
