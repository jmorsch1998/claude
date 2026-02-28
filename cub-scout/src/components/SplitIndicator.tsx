import type { SplitProgress } from '../types';
import { PHASES, PHASE_LABELS } from '../types';
import { formatTime } from '../utils/format';

interface Props {
  splitProgress: SplitProgress;
  elapsedMs: number;
}

export function SplitIndicator({ splitProgress, elapsedMs }: Props) {
  const { currentPhaseIndex, timestamps } = splitProgress;

  return (
    <div className="split-indicator">
      <div className="split-phases">
        {PHASES.map((phase, i) => {
          const isCompleted = i < timestamps.length;
          const isCurrent = i === currentPhaseIndex;
          const delta = isCompleted
            ? timestamps[i] - (i === 0 ? 0 : timestamps[i - 1])
            : null;

          return (
            <div
              key={phase}
              className={`split-phase ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}
            >
              <span className="split-phase-label">{PHASE_LABELS[phase]}</span>
              {delta !== null && (
                <span className="split-phase-time">{formatTime(delta)}</span>
              )}
            </div>
          );
        })}
      </div>
      {currentPhaseIndex < PHASES.length && (
        <div className="split-next">
          Next: <strong>{PHASE_LABELS[PHASES[currentPhaseIndex]]}</strong>
        </div>
      )}
    </div>
  );
}
