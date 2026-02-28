import { useState } from 'react';
import type { Solve, Phase } from '../types';
import { PHASES, PHASE_LABELS } from '../types';
import { RECENT_SOLVES_DISPLAY } from '../constants';
import { formatTime, formatDate } from '../utils/format';
import { detectPauses } from '../utils/stats';
import { SolveModal } from './SolveModal';

interface Props {
  solves: Solve[];
  onUpdate: (id: string, patch: Partial<Solve>) => void;
  onDelete: (id: string) => void;
}

export function RecentSolves({ solves, onUpdate, onDelete }: Props) {
  const [editingSolve, setEditingSolve] = useState<Solve | null>(null);
  const recent = [...solves].reverse().slice(0, RECENT_SOLVES_DISPLAY);

  if (solves.length === 0) {
    return (
      <section className="recent-section">
        <div className="section-tag">recent</div>
        <h2>Recent Solves</h2>
        <div className="empty-state">No solves yet. Complete a solve to get started!</div>
      </section>
    );
  }

  return (
    <section className="recent-section">
      <div className="section-tag">recent</div>
      <h2>Recent Solves</h2>
      <table className="solve-table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Splits</th>
            <th>Notes</th>
            <th>Date</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {recent.map(solve => {
            const pauses = detectPauses(solve, solves);
            return (
              <tr key={solve.id}>
                <td className="solve-time">{formatTime(solve.total_ms)}</td>
                <td className="solve-splits">
                  {solve.splits_ms ? (
                    <span className="splits-compact">
                      {PHASES.map((phase, i) => {
                        const end = solve.splits_ms![phase];
                        const start = i === 0 ? 0 : solve.splits_ms![PHASES[i - 1]];
                        const delta = end - start;
                        const isPause = pauses.includes(phase);
                        return (
                          <span key={phase} className={`split-chip ${isPause ? 'pause' : ''}`} title={`${PHASE_LABELS[phase]}: ${formatTime(delta)}${isPause ? ' (possible pause)' : ''}`}>
                            {formatTime(delta)}
                          </span>
                        );
                      })}
                    </span>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </td>
                <td className="solve-notes">{solve.notes || <span className="muted">—</span>}</td>
                <td className="solve-date">{formatDate(solve.timestamp)}</td>
                <td>
                  <button className="btn-icon" onClick={() => setEditingSolve(solve)} title="Edit">
                    &#9998;
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {editingSolve && (
        <SolveModal
          solve={editingSolve}
          onSave={onUpdate}
          onDelete={onDelete}
          onClose={() => setEditingSolve(null)}
        />
      )}
    </section>
  );
}
