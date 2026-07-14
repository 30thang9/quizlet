/**
 * Date formatting utilities
 */

export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return d.toLocaleDateString('en-US', options || defaultOptions);
}

export function formatDateTime(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return d.toLocaleDateString('en-US', options || defaultOptions);
}

export function formatRelativeTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSecs < 60) {
    return 'just now';
  } else if (diffMins < 60) {
    return `${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `${diffHours}h ago`;
  } else if (diffDays < 7) {
    return `${diffDays}d ago`;
  } else if (diffWeeks < 4) {
    return `${diffWeeks}w ago`;
  } else if (diffMonths < 12) {
    return `${diffMonths}mo ago`;
  } else {
    return `${diffYears}y ago`;
  }
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s`;
  } else if (seconds < 3600) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return secs > 0 ? `${mins}m ${secs}s` : `${mins}m`;
  } else {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  }
}

export function formatStudyTime(totalSeconds: number): string {
  if (totalSeconds < 60) {
    return `${totalSeconds} seconds`;
  } else if (totalSeconds < 3600) {
    const mins = Math.floor(totalSeconds / 60);
    return `${mins} minute${mins !== 1 ? 's' : ''}`;
  } else {
    const hours = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    if (mins === 0) {
      return `${hours} hour${hours !== 1 ? 's' : ''}`;
    }
    return `${hours}h ${mins}m`;
  }
}

export function getTimeUntil(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();

  if (diffMs < 0) {
    return 'now';
  }

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) {
    return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  } else if (diffHours > 0) {
    return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  } else {
    return `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
  }
}

export function isDue(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d <= new Date();
}
