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

/**
 * Parse CSV content into cards
 * Supports format: term,definition
 * Or: term<tab>definition
 */
export function parseCSV(content: string): ImportResult {
  const cards: ImportCard[] = [];
  const errors: string[] = [];
  
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Skip header row if it looks like headers
    if (i === 0 && /^(term|word|stimulus|front|question)/i.test(line)) {
      continue;
    }
    
    // Try tab-separated first, then comma
    let parts: string[];
    if (line.includes('\t')) {
      parts = line.split('\t');
    } else {
      // Handle quoted CSV fields
      parts = parseCSVLine(line);
    }
    
    if (parts.length < 2) {
      if (line.trim()) {
        errors.push(`Line ${i + 1}: Not enough columns (expected term and definition)`);
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
  
  return {
    success: cards.length > 0,
    cards,
    errors,
  };
}

/**
 * Parse a CSV line handling quoted fields
 */
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

/**
 * Export cards to CSV format
 */
export function exportToCSV(cards: ExportCard[]): string {
  const header = 'Term,Definition';
  const rows = cards.map((card) => {
    const term = escapeCSVField(card.term);
    const definition = escapeCSVField(card.definition);
    return `${term},${definition}`;
  });
  
  return [header, ...rows].join('\n');
}

/**
 * Escape a CSV field for proper formatting
 */
function escapeCSVField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n')) {
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Generate a filename for export
 */
export function generateExportFilename(title: string): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const timestamp = new Date().toISOString().split('T')[0];
  return `${sanitized || 'study-set'}-${timestamp}.csv`;
}

/**
 * Download content as a file
 */
export function downloadFile(content: string, filename: string, mimeType = 'text/csv'): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Read file content
 */
export function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
}
