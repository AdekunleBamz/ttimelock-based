// Local storage wrapper with type safety and error handling

const STORAGE_PREFIX = 'timevault_';

export function setItem<T>(key: string, value: T): boolean {
  try {
    const serialized = JSON.stringify(value);
    localStorage.setItem(STORAGE_PREFIX + key, serialized);
    return true;
  } catch (error) {
    console.warn(`Failed to save to localStorage: ${key}`, error);
    return false;
  }
}

export function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (item === null) return defaultValue;
    return JSON.parse(item) as T;
  } catch (error) {
    console.warn(`Failed to read from localStorage: ${key}`, error);
    return defaultValue;
  }
}

export function removeItem(key: string): boolean {
  try {
    localStorage.removeItem(STORAGE_PREFIX + key);
    return true;
  } catch (error) {
    console.warn(`Failed to remove from localStorage: ${key}`, error);
    return false;
  }
}

export function clear(): boolean {
  try {
    const keys = Object.keys(localStorage).filter(k => k.startsWith(STORAGE_PREFIX));
    keys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.warn('Failed to clear localStorage', error);
    return false;
  }
}

export function isAvailable(): boolean {
  try {
    const testKey = STORAGE_PREFIX + 'test';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// Typed storage helpers for common data
export const userPreferences = {
  get: () => getItem('preferences', { theme: 'dark', sounds: true, notifications: true }),
  set: (prefs: { theme?: string; sounds?: boolean; notifications?: boolean }) => 
    setItem('preferences', { ...userPreferences.get(), ...prefs }),
};

export const recentTransactions = {
  get: () => getItem<string[]>('recent_txs', []),
  add: (txHash: string) => {
    const recent = recentTransactions.get();
    setItem('recent_txs', [txHash, ...recent.slice(0, 9)]);
  },
};
