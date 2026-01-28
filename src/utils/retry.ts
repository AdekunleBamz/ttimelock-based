// Retry utility for handling transient failures

interface RetryOptions {
  maxAttempts?: number;
  delayMs?: number;
  backoff?: 'linear' | 'exponential';
  onRetry?: (attempt: number, error: Error) => void;
  shouldRetry?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry' | 'shouldRetry'>> = {
  maxAttempts: 3,
  delayMs: 1000,
  backoff: 'exponential',
};

export async function retry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts, delayMs, backoff } = { ...DEFAULT_OPTIONS, ...options };
  
  let lastError: Error | undefined;
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Check if we should retry
      if (options.shouldRetry && !options.shouldRetry(lastError)) {
        throw lastError;
      }
      
      // Don't wait after the last attempt
      if (attempt === maxAttempts) {
        break;
      }
      
      // Notify about retry
      options.onRetry?.(attempt, lastError);
      
      // Calculate delay
      const delay = backoff === 'exponential' 
        ? delayMs * Math.pow(2, attempt - 1)
        : delayMs * attempt;
      
      await sleep(delay);
    }
  }
  
  throw lastError;
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Helper for retrying Web3 calls
export async function retryWeb3Call<T>(fn: () => Promise<T>): Promise<T> {
  return retry(fn, {
    maxAttempts: 3,
    delayMs: 2000,
    backoff: 'exponential',
    shouldRetry: (error) => {
      const message = error.message.toLowerCase();
      // Retry on network errors, not on user rejections
      return !message.includes('user rejected') && 
             !message.includes('user denied') &&
             (message.includes('network') || 
              message.includes('timeout') ||
              message.includes('rate limit'));
    },
  });
}
