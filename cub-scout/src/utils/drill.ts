import type { Solve, Phase, DrillPlan } from '../types';
import { PHASES, PHASE_LABELS } from '../types';
import { MIN_SOLVES_FOR_DRILL } from '../constants';
import { getPhaseStats } from './stats';

export function generateDrillPlan(solves: Solve[]): DrillPlan | null {
  const withSplits = solves.filter(s => s.splits_ms !== null);
  if (withSplits.length < MIN_SOLVES_FOR_DRILL) return null;

  const { averages, stddevs, percentages } = getPhaseStats(withSplits);

  // Score each phase: higher = worse (needs more practice)
  // Combine percentage of total time + coefficient of variation
  let worstPhase: Phase = 'cross';
  let worstScore = -1;

  for (const phase of PHASES) {
    if (averages[phase] === null) continue;
    const pct = percentages[phase] ?? 0;
    const cv = stddevs[phase] !== null && averages[phase]! > 0
      ? (stddevs[phase]! / averages[phase]!) * 100
      : 0;
    // Weight: 60% time share, 40% inconsistency
    const score = pct * 0.6 + cv * 0.4;
    if (score > worstScore) {
      worstScore = score;
      worstPhase = phase;
    }
  }

  const phasePct = percentages[worstPhase]?.toFixed(0) ?? '?';
  const blocks = getDrillBlocks(worstPhase);

  return {
    targetPhase: worstPhase,
    reason: `${PHASE_LABELS[worstPhase]} takes ${phasePct}% of your solve time and shows the most room for improvement.`,
    blocks,
  };
}

function getDrillBlocks(phase: Phase): DrillBlock[] {
  switch (phase) {
    case 'cross':
      return [
        {
          type: 'cross_only',
          label: 'Cross-Only Reps',
          description: 'Generate a scramble, solve only the cross, then stop. Focus on planning the entire cross during inspection. Target: under 3 seconds.',
          targetReps: 10,
        },
        {
          type: 'cross_only',
          label: 'Cross + 1 Pair',
          description: 'Solve the cross and immediately find your first F2L pair. Stop after inserting the first pair. Practice smooth transitions.',
          targetReps: 8,
        },
        {
          type: 'cross_only',
          label: 'Full Solves (Cross Focus)',
          description: 'Do full solves but mentally track your cross efficiency. Did you plan it all in inspection? Was it 8 moves or fewer?',
          targetReps: 5,
        },
      ];
    case 'f2l':
      return [
        {
          type: 'first_pair',
          label: 'First Pair Finder',
          description: 'After solving the cross, find and insert your first F2L pair as fast as possible. Focus on lookahead during the cross.',
          targetReps: 10,
        },
        {
          type: 'f2l_only',
          label: 'F2L-Only Practice',
          description: 'Solve cross (untimed), then time only the F2L phase. Focus on reducing pauses between pairs and lookahead.',
          targetReps: 8,
        },
        {
          type: 'f2l_only',
          label: 'Full Solves (F2L Focus)',
          description: 'Full timed solves. After each, note: How many pauses during F2L? Could you see the next pair while inserting the current one?',
          targetReps: 5,
        },
      ];
    case 'oll':
      return [
        {
          type: 'oll_recognition',
          label: 'OLL Recognition Drill',
          description: 'Look at the top face and identify the OLL case as quickly as possible. Say the algorithm name or number out loud. No solving needed.',
          targetReps: 15,
        },
        {
          type: 'oll_recognition',
          label: 'OLL Execution Drill',
          description: 'For each OLL case you encounter, execute the algorithm 3 times in a row. Focus on finger tricks and flow.',
          targetReps: 10,
        },
        {
          type: 'f2l_only',
          label: 'Full Solves (OLL Focus)',
          description: 'Full timed solves. Focus on recognizing OLL during your last F2L pair insertion. Aim for zero pause between F2L and OLL.',
          targetReps: 5,
        },
      ];
    case 'pll':
      return [
        {
          type: 'pll_recognition',
          label: 'PLL Recognition Drill',
          description: 'After OLL, identify the PLL case by checking 2 sides. Practice instant recognition. Say the case name out loud.',
          targetReps: 15,
        },
        {
          type: 'pll_recognition',
          label: 'PLL Execution Drill',
          description: 'Execute each PLL algorithm you encounter 3 times in a row. Focus on AUF (adjustment) prediction.',
          targetReps: 10,
        },
        {
          type: 'pll_recognition',
          label: 'Full Solves (PLL Focus)',
          description: 'Full timed solves. Focus on recognizing PLL during OLL execution. Aim for zero pause between OLL and PLL.',
          targetReps: 5,
        },
      ];
  }
}
