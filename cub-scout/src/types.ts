export type Phase = 'cross' | 'f2l' | 'oll' | 'pll';

export const PHASES: Phase[] = ['cross', 'f2l', 'oll', 'pll'];

export const PHASE_LABELS: Record<Phase, string> = {
  cross: 'Cross',
  f2l: 'F2L',
  oll: 'OLL',
  pll: 'PLL',
};

export interface Solve {
  id: string;
  timestamp: string;
  scramble: string;
  total_ms: number;
  splits_ms: Record<Phase, number> | null;
  notes: string;
  tags: string[];
}

export type TimerState = 'idle' | 'holding' | 'ready' | 'running' | 'stopped';

export interface SplitProgress {
  currentPhaseIndex: number;
  timestamps: number[];
}

export interface SessionStats {
  count: number;
  best_ms: number | null;
  ao5: number | null;
  ao12: number | null;
  sessionAvg: number | null;
  phaseAverages: Record<Phase, number | null>;
}

export type DrillType = 'cross_only' | 'first_pair' | 'f2l_only' | 'oll_recognition' | 'pll_recognition';

export interface DrillBlock {
  type: DrillType;
  label: string;
  description: string;
  targetReps: number;
}

export interface DrillPlan {
  targetPhase: Phase;
  reason: string;
  blocks: DrillBlock[];
}

export interface ToastMessage {
  id: string;
  text: string;
  type: 'warning' | 'info';
}
