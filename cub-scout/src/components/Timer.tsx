import type { TimerState, SplitProgress } from '../types';
import { SplitIndicator } from './SplitIndicator';
import { formatTime } from '../utils/format';

interface Props {
  timerState: TimerState;
  elapsedMs: number;
  splitMode: boolean;
  splitProgress: SplitProgress | null;
  onAction: (action: 'press' | 'release') => void;
}

export function Timer({ timerState, elapsedMs, splitMode, splitProgress, onAction }: Props) {
  const displayClass = timerState === 'holding'
    ? 'timer-display holding'
    : timerState === 'ready'
    ? 'timer-display ready'
    : 'timer-display';

  const hint = timerState === 'idle'
    ? <>Hold <kbd>space</kbd> then release to start</>
    : timerState === 'holding'
    ? 'Keep holding...'
    : timerState === 'ready'
    ? 'Release to start!'
    : timerState === 'running'
    ? (splitMode ? <>Tap <kbd>space</kbd> for next split</> : <>Tap <kbd>space</kbd> to stop</>)
    : 'Save your time or start a new solve';

  return (
    <section className="timer-section">
      <div
        className={displayClass}
        onPointerDown={(e) => { e.preventDefault(); onAction('press'); }}
        onPointerUp={(e) => { e.preventDefault(); onAction('release'); }}
      >
        {formatTime(elapsedMs)}
      </div>
      <div className="timer-hint">{hint}</div>
      {splitMode && splitProgress && timerState === 'running' && (
        <SplitIndicator splitProgress={splitProgress} elapsedMs={elapsedMs} />
      )}
    </section>
  );
}
