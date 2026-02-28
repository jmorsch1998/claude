import { useState, useRef, useEffect } from 'react';
import type { Phase } from '../types';
import { PHASES, PHASE_LABELS } from '../types';
import { formatTime } from '../utils/format';

interface Props {
  totalMs: number;
  splitsMs: Record<Phase, number> | null;
  onSave: (notes: string, tags: string[]) => void;
  onDiscard: () => void;
}

export function SaveForm({ totalMs, splitsMs, onSave, onDiscard }: Props) {
  const [notes, setNotes] = useState('');
  const [tagsStr, setTagsStr] = useState('');
  const notesRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    notesRef.current?.focus();
  }, []);

  const handleSave = () => {
    const tags = tagsStr.split(',').map(t => t.trim()).filter(Boolean);
    onSave(notes, tags);
    setNotes('');
    setTagsStr('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSave();
    if (e.key === 'Escape') onDiscard();
  };

  return (
    <section className="save-section visible">
      <div className="save-time-display">{formatTime(totalMs)}</div>
      {splitsMs && (
        <div className="save-splits">
          {PHASES.map((phase, i) => {
            const end = splitsMs[phase];
            const start = i === 0 ? 0 : splitsMs[PHASES[i - 1]];
            const delta = end - start;
            return (
              <span key={phase} className="save-split-item">
                <span className="save-split-label">{PHASE_LABELS[phase]}</span>
                <span className="save-split-time">{formatTime(delta)}</span>
              </span>
            );
          })}
        </div>
      )}
      <div className="save-row">
        <input
          ref={notesRef}
          type="text"
          className="save-input"
          placeholder="Notes (optional)"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <input
          type="text"
          className="save-input save-input-tags"
          placeholder="Tags (comma-separated)"
          value={tagsStr}
          onChange={e => setTagsStr(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="btn" onClick={handleSave}>Save</button>
        <button className="btn-ghost" onClick={onDiscard}>Discard</button>
      </div>
    </section>
  );
}
