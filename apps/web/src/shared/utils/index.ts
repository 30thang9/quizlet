/**
 * Shared Utility Functions
 * Tập hợp các helpers dùng chung cho toàn bộ app
 */

// ============ Date Formatting ============

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;
const WEEK = 7 * DAY;

export function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();

  if (diff < MINUTE) return 'Just now';
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m ago`;
  if (diff < DAY) return `${Math.floor(diff / HOUR)}h ago`;
  if (diff < WEEK) return `${Math.floor(diff / DAY)}d ago`;
  return date.toLocaleDateString();
}

export function formatDate(dateStr: string, options?: Intl.DateTimeFormatOptions): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString();
}

// ============ Number Formatting ============

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

// ============ String Utilities ============

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length - 3) + '...';
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function pluralize(count: number, singular: string, plural?: string): string {
  return count === 1 ? singular : (plural || `${singular}s`);
}

// ============ Class Names ============

export { cn } from './cn';

// ============ Debounce ============

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function executedFunction(...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function throttle<T extends (...args: unknown[]) => unknown>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let inThrottle = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ============ Array Utilities ============

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function chunk<T>(array: T[], size: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function unique<T>(array: T[]): T[] {
  const seen = new Set<T>();
  return array.filter((item) => {
    if (seen.has(item)) return false;
    seen.add(item);
    return true;
  });
}

export function groupBy<T, K extends string | number>(
  array: T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return array.reduce((result, item) => {
    const key = keyFn(item);
    if (!result[key]) result[key] = [];
    result[key].push(item);
    return result;
  }, {} as Record<K, T[]>);
}

// ============ Object Utilities ============

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  return keys.reduce((result, key) => {
    if (key in obj) result[key] = obj[key];
    return result;
  }, {} as Pick<T, K>);
}

export function omit<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((key) => delete result[key]);
  return result;
}

// ============ Validation ============

export function isEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

// ============ Storage ============

export const storage = {
  get<T>(key: string, defaultValue: T): T {
    if (typeof window === 'undefined') return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  },

  set<T>(key: string, value: T): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore quota exceeded errors
    }
  },

  remove(key: string): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(key);
  },

  clear(): void {
    if (typeof window === 'undefined') return;
    localStorage.clear();
  },
};

// ============ Import/Export ============

export interface ImportCard {
  term: string;
  definition: string;
}

export interface ImportResult {
  success: boolean;
  cards: ImportCard[];
  errors: string[];
}

export interface ExportCard {
  term: string;
  definition: string;
  imageUrl?: string;
}

export type ExportFormat = 'csv' | 'json' | 'txt' | 'anki';

export function parseCSV(content: string): ImportResult {
  const cards: ImportCard[] = [];
  const errors: string[] = [];
  
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    if (i === 0 && /^(term|word|stimulus|front|question)/i.test(line)) {
      continue;
    }
    
    let parts: string[];
    if (line.includes('\t')) {
      parts = line.split('\t');
    } else {
      parts = parseCSVLine(line);
    }
    
    if (parts.length < 2) {
      if (line.trim()) {
        errors.push(`Line ${i + 1}: Not enough columns`);
      }
      continue;
    }
    
    const term = parts[0]?.trim().replace(/^["']|["']$/g, '');
    const definition = parts[1]?.trim().replace(/^["']|["']$/g, '');
    
    if (!term || !definition) {
      errors.push(`Line ${i + 1}: Empty term or definition`);
      continue;
    }
    
    cards.push({ term, definition });
  }
  
  return { success: cards.length > 0, cards, errors };
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  
  result.push(current);
  return result;
}

export function exportToCSV(cards: ExportCard[]): string {
  const header = 'Term,Definition';
  const rows = cards.map((card) => {
    const term = escapeCSVField(card.term);
    const definition = escapeCSVField(card.definition);
    return `${term},${definition}`;
  });
  return [header, ...rows].join('\n');
}

function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

export function exportToJSON(cards: ExportCard[]): string {
  return JSON.stringify({
    exportDate: new Date().toISOString(),
    cardCount: cards.length,
    cards: cards.map(card => ({ front: card.term, back: card.definition })),
  }, null, 2);
}

export function exportToAnki(cards: ExportCard[]): string {
  return cards.map((card) => {
    const front = card.term.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const back = card.definition.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    return `${front}\t${back}`;
  }).join('\n');
}

export function exportToTXT(cards: ExportCard[]): string {
  const header = '='.repeat(50);
  return [
    header,
    'STUDY SET EXPORT',
    header,
    '',
    ...cards.map((card, i) => `${i + 1}. ${card.term}\n   ${card.definition}`),
    '',
    header,
    `Total cards: ${cards.length}`,
    `Exported: ${new Date().toLocaleString()}`,
    header,
  ].join('\n');
}

export function exportStudySet(cards: ExportCard[], title: string, format: ExportFormat = 'csv'): void {
  let content: string;
  let filename: string;
  
  switch (format) {
    case 'csv':
      content = exportToCSV(cards);
      filename = generateExportFilename(title, 'csv');
      break;
    case 'json':
      content = exportToJSON(cards);
      filename = generateExportFilename(title, 'json');
      break;
    case 'txt':
      content = exportToTXT(cards);
      filename = generateExportFilename(title, 'txt');
      break;
    case 'anki':
      content = exportToAnki(cards);
      filename = generateExportFilename(title, 'txt');
      break;
    default:
      content = exportToCSV(cards);
      filename = generateExportFilename(title, 'csv');
  }
  
  downloadFile(content, filename);
}

export function generateExportFilename(title: string, format: ExportFormat = 'csv'): string {
  const sanitized = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const timestamp = new Date().toISOString().split('T')[0];
  return `${sanitized || 'study-set'}-${timestamp}.${format}`;
}

export function downloadFile(content: string, filename: string, mimeType?: string): void {
  const mimeTypes: Record<string, string> = {
    csv: 'text/csv',
    json: 'application/json',
    txt: 'text/plain',
    anki: 'text/plain',
  };
  const type = mimeType || mimeTypes[filename.split('.').pop() || 'csv'] || 'text/plain';
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

export async function importFromFile(file: File): Promise<ImportResult> {
  const content = await readFile(file);
  return parseCSV(content);
}

// ============ Date Formatting (Extended) ============

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

  if (diffMs < 0) return 'now';

  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffDays > 0) return `in ${diffDays} day${diffDays !== 1 ? 's' : ''}`;
  if (diffHours > 0) return `in ${diffHours} hour${diffHours !== 1 ? 's' : ''}`;
  return `in ${diffMins} minute${diffMins !== 1 ? 's' : ''}`;
}

export function isDue(date: Date | string): boolean {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d <= new Date();
}

// ============ Async Utilities ============

export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  delay = 1000,
): Promise<T> {
  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      if (attempt < maxAttempts) {
        await new Promise((r) => setTimeout(r, delay * attempt));
      }
    }
  }

  throw lastError;
}
