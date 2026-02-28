export function formatTime(ms: number): string {
  const total = ms / 1000;
  const min = Math.floor(total / 60);
  const sec = total % 60;
  if (min > 0) return min + ':' + sec.toFixed(3).padStart(6, '0');
  return sec.toFixed(3);
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
