import type { Solve, Phase, SessionStats } from '../types';
import { PHASES } from '../types';
import { PAUSE_THRESHOLD_MULTIPLIER } from '../constants';

export function computeAoN(solves: Solve[], n: number): number | null {
  if (solves.length < n) return null;
  const recent = solves.slice(-n).map(s => s.total_ms);
  const sum = recent.reduce((a, b) => a + b, 0);
  return sum / n;
}

export function computeSessionAvg(solves: Solve[]): number | null {
  if (solves.length === 0) return null;
  const sum = solves.reduce((a, s) => a + s.total_ms, 0);
  return sum / solves.length;
}

export function computeBest(solves: Solve[]): number | null {
  if (solves.length === 0) return null;
  return Math.min(...solves.map(s => s.total_ms));
}

function getSplitDelta(solve: Solve, phase: Phase): number | null {
  if (!solve.splits_ms) return null;
  const idx = PHASES.indexOf(phase);
  const end = solve.splits_ms[phase];
  const start = idx === 0 ? 0 : solve.splits_ms[PHASES[idx - 1]];
  if (end == null || start == null) return null;
  return end - start;
}

export function computePhaseAverages(solves: Solve[]): Record<Phase, number | null> {
  const result: Record<Phase, number | null> = { cross: null, f2l: null, oll: null, pll: null };
  const withSplits = solves.filter(s => s.splits_ms !== null);
  if (withSplits.length === 0) return result;

  for (const phase of PHASES) {
    const deltas = withSplits.map(s => getSplitDelta(s, phase)).filter((d): d is number => d !== null);
    if (deltas.length > 0) {
      result[phase] = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    }
  }
  return result;
}

export function computeStats(solves: Solve[]): SessionStats {
  return {
    count: solves.length,
    best_ms: computeBest(solves),
    ao5: computeAoN(solves, 5),
    ao12: computeAoN(solves, 12),
    sessionAvg: computeSessionAvg(solves),
    phaseAverages: computePhaseAverages(solves),
  };
}

export function detectPauses(solve: Solve, recentSolves: Solve[]): Phase[] {
  if (!solve.splits_ms) return [];
  const withSplits = recentSolves.filter(s => s.splits_ms !== null).slice(-10);
  if (withSplits.length < 3) return [];

  const flagged: Phase[] = [];
  for (const phase of PHASES) {
    const delta = getSplitDelta(solve, phase);
    if (delta === null) continue;

    const recentDeltas = withSplits
      .map(s => getSplitDelta(s, phase))
      .filter((d): d is number => d !== null)
      .sort((a, b) => a - b);

    if (recentDeltas.length < 3) continue;
    const median = recentDeltas[Math.floor(recentDeltas.length / 2)];
    if (delta > median * PAUSE_THRESHOLD_MULTIPLIER) {
      flagged.push(phase);
    }
  }
  return flagged;
}

export function getPhaseStats(solves: Solve[]): {
  averages: Record<Phase, number | null>;
  stddevs: Record<Phase, number | null>;
  percentages: Record<Phase, number | null>;
} {
  const averages = computePhaseAverages(solves);
  const stddevs: Record<Phase, number | null> = { cross: null, f2l: null, oll: null, pll: null };
  const percentages: Record<Phase, number | null> = { cross: null, f2l: null, oll: null, pll: null };

  const withSplits = solves.filter(s => s.splits_ms !== null);
  if (withSplits.length === 0) return { averages, stddevs, percentages };

  const totalAvg = averages.cross !== null && averages.f2l !== null && averages.oll !== null && averages.pll !== null
    ? averages.cross + averages.f2l + averages.oll + averages.pll
    : null;

  for (const phase of PHASES) {
    const deltas = withSplits.map(s => getSplitDelta(s, phase)).filter((d): d is number => d !== null);
    if (deltas.length > 1 && averages[phase] !== null) {
      const mean = averages[phase]!;
      const variance = deltas.reduce((sum, d) => sum + (d - mean) ** 2, 0) / deltas.length;
      stddevs[phase] = Math.sqrt(variance);
    }
    if (totalAvg !== null && averages[phase] !== null) {
      percentages[phase] = (averages[phase]! / totalAvg) * 100;
    }
  }

  return { averages, stddevs, percentages };
}
