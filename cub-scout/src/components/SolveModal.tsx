import { useState, useEffect } from 'react';
import type { Solve, Phase } from '../types';
import { PHASES, PHASE_LABELS } from '../types';
import { formatTime, formatDate } from '../utils/format';

interface Props {
  solve: Solve;
  onSave: (id: string, patch: Partial<Solve>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

export function SolveModal({ solve, onSave, onDelete, onClose }: Props) {
  const [notes, setNotes] = useState(solve.notes);
  const [tagsStr, setTagsStr] = useState(solve.tags.join(', '));

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleSave = () => {
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    onSave(solve.id, { notes, tags });
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm('Delete this solve?')) {
      onDelete(solve.id);
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Edit Solve</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        <div className="modal-body">
          <div className="modal-time">{formatTime(solve.total_ms)}</div>
          <div className="modal-date">{formatDate(solve.timestamp)}</div>

          {solve.splits_ms && (
            <div className="modal-splits">
              {PHASES.map((phase, i) => {
                const end = solve.splits_ms![phase];
                const start = i === 0 ? 0 : solve.splits_ms![PHASES[i - 1]];
                return (
                  <div key={phase} className="modal-split-row">
                    <span>{PHASE_LABELS[phase]}</span>
                    <span className="mono">{formatTime(end - start)}</span>
                  </div>
                );
              })}
            </div>
          )}

          <div className="modal-scramble">
            <span className="modal-label">Scramble</span>
            <code>{solve.scramble}</code>
          </div>

          <div className="modal-field">
            <label>Notes</label>
            <input
              type="text"
              className="save-input"
              value={notes}
              onChange={e => setNotes(e.target.value)}
            />
          </div>
          <div className="modal-field">
            <label>Tags</label>
            <input
              type="text"
              className="save-input"
              value={tagsStr}
              onChange={e => setTagsStr(e.target.value)}
              placeholder="comma-separated"
            />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn" onClick={handleSave}>Save</button>
          <button className="btn-ghost btn-danger" onClick={handleDelete}>Delete</button>
        </div>
      </div>
    </div>
  );
}
