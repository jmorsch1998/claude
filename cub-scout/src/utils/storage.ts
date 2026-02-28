import { STORAGE_KEY } from '../constants';
import type { Solve, Phase } from '../types';

interface StorageData {
  version: number;
  solves: Solve[];
}

export function loadSolves(): Solve[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const data: StorageData = JSON.parse(raw);
    return data.solves ?? [];
  } catch {
    return [];
  }
}

export function saveSolves(solves: Solve[]): void {
  const data: StorageData = { version: 1, solves };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportJSON(solves: Solve[]): void {
  const blob = new Blob([JSON.stringify(solves, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'cubscout-solves.json');
}

export function exportCSV(solves: Solve[]): void {
  const phases: Phase[] = ['cross', 'f2l', 'oll', 'pll'];
  const headers = ['id', 'timestamp', 'scramble', 'total_ms', ...phases.map(p => `split_${p}_ms`), 'notes', 'tags'];
  const rows = solves.map(s => [
    s.id,
    s.timestamp,
    `"${s.scramble.replace(/"/g, '""')}"`,
    s.total_ms,
    ...phases.map(p => s.splits_ms?.[p] ?? ''),
    `"${s.notes.replace(/"/g, '""')}"`,
    `"${s.tags.join(',')}"`,
  ]);
  const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  downloadBlob(blob, 'cubscout-solves.csv');
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
