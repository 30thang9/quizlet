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

/**
 * Parse CSV/TSV content into cards
 * Supports format: term,definition or term<tab>definition
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
 * Export cards to JSON format
 */
export function exportToJSON(cards: ExportCard[]): string {
  const exportData = {
    exportDate: new Date().toISOString(),
    cardCount: cards.length,
    cards: cards.map(card => ({
      front: card.term,
      back: card.definition,
    })),
  };
  return JSON.stringify(exportData, null, 2);
}

/**
 * Export cards to Anki-compatible format
 * Format: front<tab>back<tab>tags
 */
export function exportToAnki(cards: ExportCard[]): string {
  return cards.map((card) => {
    const front = card.term.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    const back = card.definition.replace(/\t/g, ' ').replace(/\n/g, '<br>');
    return `${front}\t${back}`;
  }).join('\n');
}

/**
 * Export cards to plain text format
 */
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
export function generateExportFilename(title: string, format: ExportFormat = 'csv'): string {
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  const timestamp = new Date().toISOString().split('T')[0];
  return `${sanitized || 'study-set'}-${timestamp}.${format}`;
}

/**
 * Download content as a file
 */
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

/**
 * Export study set with specified format
 */
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

/**
 * Import cards from file
 */
export async function importFromFile(file: File): Promise<ImportResult> {
  const content = await readFile(file);
  return parseCSV(content);
}
