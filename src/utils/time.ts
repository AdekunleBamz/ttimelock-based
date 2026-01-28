// Time and duration formatting utilities

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  }
  
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  }
  
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
  
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  return hours > 0 ? `${days}d ${hours}h` : `${days}d`;
}

export function formatRelativeTime(date: Date | number): string {
  const now = Date.now();
  const timestamp = date instanceof Date ? date.getTime() : date;
  const diff = now - timestamp;
  
  const seconds = Math.floor(Math.abs(diff) / 1000);
  const isFuture = diff < 0;
  
  if (seconds < 60) {
    return isFuture ? 'in a moment' : 'just now';
  }
  
  if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    return isFuture ? `in ${mins}m` : `${mins}m ago`;
  }
  
  if (seconds < 86400) {
    const hours = Math.floor(seconds / 3600);
    return isFuture ? `in ${hours}h` : `${hours}h ago`;
  }
  
  if (seconds < 604800) {
    const days = Math.floor(seconds / 86400);
    return isFuture ? `in ${days}d` : `${days}d ago`;
  }
  
  const targetDate = new Date(timestamp);
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatTimeRemaining(targetDate: Date | number): string {
  const target = targetDate instanceof Date ? targetDate.getTime() : targetDate;
  const remaining = target - Date.now();
  
  if (remaining <= 0) {
    return 'Unlocked';
  }
  
  return formatDuration(Math.floor(remaining / 1000));
}

export function getDaysUntil(targetDate: Date | number): number {
  const target = targetDate instanceof Date ? targetDate.getTime() : targetDate;
  const remaining = target - Date.now();
  return Math.max(0, Math.ceil(remaining / 86400000));
}

export function isExpired(targetDate: Date | number): boolean {
  const target = targetDate instanceof Date ? targetDate.getTime() : targetDate;
  return Date.now() >= target;
}

export function getProgressPercentage(startDate: Date | number, endDate: Date | number): number {
  const start = startDate instanceof Date ? startDate.getTime() : startDate;
  const end = endDate instanceof Date ? endDate.getTime() : endDate;
  const now = Date.now();
  
  if (now <= start) return 0;
  if (now >= end) return 100;
  
  return Math.round(((now - start) / (end - start)) * 100);
}
