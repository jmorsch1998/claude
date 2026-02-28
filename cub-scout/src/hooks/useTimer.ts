import { useState, useRef, useCallback, useEffect } from 'react';
import type { TimerState, SplitProgress, Phase } from '../types';
import { PHASES } from '../types';
import { HOLD_DELAY_MS } from '../constants';

interface TimerResult {
  total_ms: number;
  splits_ms: Record<Phase, number> | null;
}

interface UseTimerReturn {
  timerState: TimerState;
  elapsedMs: number;
  splitProgress: SplitProgress | null;
  finalResult: TimerResult | null;
  onAction: (action: 'press' | 'release') => void;
  reset: () => void;
}

export function useTimer(splitMode: boolean): UseTimerReturn {
  const [timerState, setTimerState] = useState<TimerState>('idle');
  const [elapsedMs, setElapsedMs] = useState(0);
  const [splitProgress, setSplitProgress] = useState<SplitProgress | null>(null);
  const [finalResult, setFinalResult] = useState<TimerResult | null>(null);

  const startTimeRef = useRef(0);
  const animFrameRef = useRef(0);
  const holdTimeoutRef = useRef(0);
  const stateRef = useRef<TimerState>('idle');
  const splitProgressRef = useRef<SplitProgress | null>(null);
  const splitModeRef = useRef(splitMode);

  // Keep refs in sync
  useEffect(() => {
    splitModeRef.current = splitMode;
  }, [splitMode]);

  const tick = useCallback(() => {
    if (stateRef.current !== 'running') return;
    const now = performance.now() - startTimeRef.current;
    setElapsedMs(now);
    animFrameRef.current = requestAnimationFrame(tick);
  }, []);

  const stopTimer = useCallback(() => {
    const elapsed = performance.now() - startTimeRef.current;
    cancelAnimationFrame(animFrameRef.current);
    setElapsedMs(elapsed);
    stateRef.current = 'stopped';
    setTimerState('stopped');

    let splits_ms: Record<Phase, number> | null = null;
    const sp = splitProgressRef.current;
    if (sp && sp.timestamps.length === 3) {
      // 3 splits already recorded (cross, f2l, oll), this stop is pll
      splits_ms = {
        cross: sp.timestamps[0],
        f2l: sp.timestamps[1],
        oll: sp.timestamps[2],
        pll: elapsed,
      };
    } else if (sp && sp.timestamps.length === 4) {
      splits_ms = {
        cross: sp.timestamps[0],
        f2l: sp.timestamps[1],
        oll: sp.timestamps[2],
        pll: sp.timestamps[3],
      };
    }

    setFinalResult({ total_ms: elapsed, splits_ms });
  }, []);

  const onAction = useCallback((action: 'press' | 'release') => {
    const state = stateRef.current;

    if (action === 'press') {
      if (state === 'idle' || state === 'stopped') {
        // Begin hold
        stateRef.current = 'holding';
        setTimerState('holding');
        setElapsedMs(0);
        setFinalResult(null);

        holdTimeoutRef.current = window.setTimeout(() => {
          if (stateRef.current === 'holding') {
            stateRef.current = 'ready';
            setTimerState('ready');
          }
        }, HOLD_DELAY_MS);
      } else if (state === 'running') {
        if (splitModeRef.current) {
          // Record split
          const sp = splitProgressRef.current;
          if (sp) {
            const now = performance.now() - startTimeRef.current;
            const newTimestamps = [...sp.timestamps, now];
            const newIndex = sp.currentPhaseIndex + 1;

            if (newIndex >= PHASES.length) {
              // Last split (PLL) — stop timer
              splitProgressRef.current = { currentPhaseIndex: newIndex, timestamps: newTimestamps };
              setSplitProgress({ currentPhaseIndex: newIndex, timestamps: newTimestamps });
              stopTimer();
            } else {
              splitProgressRef.current = { currentPhaseIndex: newIndex, timestamps: newTimestamps };
              setSplitProgress({ currentPhaseIndex: newIndex, timestamps: newTimestamps });
            }
          }
        } else {
          stopTimer();
        }
      }
    } else if (action === 'release') {
      if (state === 'holding') {
        // Cancelled hold
        clearTimeout(holdTimeoutRef.current);
        stateRef.current = 'idle';
        setTimerState('idle');
      } else if (state === 'ready') {
        // Start timer
        stateRef.current = 'running';
        setTimerState('running');
        startTimeRef.current = performance.now();
        setElapsedMs(0);

        if (splitModeRef.current) {
          splitProgressRef.current = { currentPhaseIndex: 0, timestamps: [] };
          setSplitProgress({ currentPhaseIndex: 0, timestamps: [] });
        } else {
          splitProgressRef.current = null;
          setSplitProgress(null);
        }

        tick();
      }
    }
  }, [tick, stopTimer]);

  const reset = useCallback(() => {
    cancelAnimationFrame(animFrameRef.current);
    clearTimeout(holdTimeoutRef.current);
    stateRef.current = 'idle';
    setTimerState('idle');
    setElapsedMs(0);
    setSplitProgress(null);
    setFinalResult(null);
    splitProgressRef.current = null;
  }, []);

  return { timerState, elapsedMs, splitProgress, finalResult, onAction, reset };
}
