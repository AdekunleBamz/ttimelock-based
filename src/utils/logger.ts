// Lightweight logger with levels and context

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  level?: LogLevel;
  prefix?: string;
  enabled?: boolean;
}

const LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

export function createLogger(options: LoggerOptions = {}) {
  const level = options.level ?? 'info';
  const prefix = options.prefix ?? '';
  const enabled = options.enabled ?? true;

  const shouldLog = (messageLevel: LogLevel) => {
    return enabled && LEVEL_PRIORITY[messageLevel] >= LEVEL_PRIORITY[level];
  };

  const format = (message: string) => {
    const time = new Date().toISOString();
    return prefix ? `[${time}] ${prefix} ${message}` : `[${time}] ${message}`;
  };

  return {
    debug: (message: string, ...args: unknown[]) => {
      if (shouldLog('debug')) {
        console.debug(format(message), ...args);
      }
    },
    info: (message: string, ...args: unknown[]) => {
      if (shouldLog('info')) {
        console.info(format(message), ...args);
      }
    },
    warn: (message: string, ...args: unknown[]) => {
      if (shouldLog('warn')) {
        console.warn(format(message), ...args);
      }
    },
    error: (message: string, ...args: unknown[]) => {
      if (shouldLog('error')) {
        console.error(format(message), ...args);
      }
    },
    withPrefix: (nextPrefix: string) => {
      return createLogger({ level, prefix: nextPrefix, enabled });
    },
  };
}

export const logger = createLogger({
  level: 'info',
  prefix: 'vault',
  enabled: true,
});
