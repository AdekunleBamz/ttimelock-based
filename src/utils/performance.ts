// Performance monitoring utilities

interface PerformanceMetric {
  name: string;
  startTime: number;
  endTime?: number;
  duration?: number;
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetric> = new Map();

  start(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now(),
    });
  }

  end(name: string): number | null {
    const metric = this.metrics.get(name);
    if (!metric) return null;

    metric.endTime = performance.now();
    metric.duration = metric.endTime - metric.startTime;

    // Log in development mode
    try {
      // @ts-expect-error Vite environment variable
      if (import.meta.env?.DEV) {
        console.log(`[Perf] ${name}: ${metric.duration.toFixed(2)}ms`);
      }
    } catch {
      // Ignore if env is not available
    }

    return metric.duration;
  }

  measure<T>(name: string, fn: () => T): T {
    this.start(name);
    const result = fn();
    this.end(name);
    return result;
  }

  async measureAsync<T>(name: string, fn: () => Promise<T>): Promise<T> {
    this.start(name);
    try {
      const result = await fn();
      this.end(name);
      return result;
    } catch (error) {
      this.end(name);
      throw error;
    }
  }

  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(m => m.duration !== undefined);
  }

  getAverageTime(name: string): number | null {
    const metrics = this.getMetrics().filter(m => m.name === name);
    if (metrics.length === 0) return null;
    const total = metrics.reduce((sum, m) => sum + (m.duration || 0), 0);
    return total / metrics.length;
  }

  clear(): void {
    this.metrics.clear();
  }
}

export const perfMonitor = new PerformanceMonitor();

// Web Vitals helpers
export function reportWebVitals(onReport: (metric: { name: string; value: number }) => void): void {
  if (typeof window === 'undefined') return;

  // First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      onReport({ name: entry.name, value: entry.startTime });
    }
  });

  try {
    observer.observe({ entryTypes: ['paint', 'largest-contentful-paint'] });
  } catch {
    // Browser doesn't support these metrics
  }
}
