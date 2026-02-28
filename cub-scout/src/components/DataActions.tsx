import type { Solve } from '../types';
import { exportCSV, exportJSON } from '../utils/storage';

interface Props {
  solves: Solve[];
  onClearAll: () => void;
}

export function DataActions({ solves, onClearAll }: Props) {
  if (solves.length === 0) return null;

  const handleClear = () => {
    if (window.confirm('Clear all solve data? This cannot be undone.')) {
      onClearAll();
    }
  };

  return (
    <section className="data-actions">
      <div className="section-tag">data</div>
      <div className="data-buttons">
        <button className="btn-ghost" onClick={() => exportJSON(solves)}>Export JSON</button>
        <button className="btn-ghost" onClick={() => exportCSV(solves)}>Export CSV</button>
        <button className="btn-ghost btn-danger" onClick={handleClear}>Clear All Data</button>
      </div>
    </section>
  );
}
