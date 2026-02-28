import { useMemo } from 'react';
import type { Solve } from '../types';
import { PHASE_LABELS } from '../types';
import { generateDrillPlan } from '../utils/drill';

interface Props {
  solves: Solve[];
}

export function DrillPlan({ solves }: Props) {
  const plan = useMemo(() => generateDrillPlan(solves), [solves]);

  if (!plan) return null;

  return (
    <section className="drill-section">
      <div className="section-tag">drill plan</div>
      <h2>Next Training Session</h2>
      <p className="drill-reason">
        Target: <strong>{PHASE_LABELS[plan.targetPhase]}</strong> — {plan.reason}
      </p>
      <div className="drill-blocks">
        {plan.blocks.map((block, i) => (
          <div key={i} className="drill-block">
            <div className="drill-block-header">
              <span className="drill-block-number">Block {i + 1}</span>
              <span className="drill-block-reps">{block.targetReps} reps</span>
            </div>
            <h3 className="drill-block-title">{block.label}</h3>
            <p className="drill-block-desc">{block.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
