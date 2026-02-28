import type { Solve } from '../types';
import { PHASES, PHASE_LABELS } from '../types';
import { getPhaseStats } from '../utils/stats';
import { formatTime } from '../utils/format';

interface Props {
  solves: Solve[];
}

export function PhaseStats({ solves }: Props) {
  const withSplits = solves.filter(s => s.splits_ms !== null);
  if (withSplits.length === 0) return null;

  const { averages, stddevs, percentages } = getPhaseStats(withSplits);

  return (
    <section>
      <div className="section-tag">phase breakdown</div>
      <table className="phase-table">
        <thead>
          <tr>
            <th>Phase</th>
            <th>Avg</th>
            <th>Std Dev</th>
            <th>% of Solve</th>
          </tr>
        </thead>
        <tbody>
          {PHASES.map(phase => (
            <tr key={phase}>
              <td className="phase-name">{PHASE_LABELS[phase]}</td>
              <td className="phase-time">{averages[phase] != null ? formatTime(averages[phase]!) : '—'}</td>
              <td className="phase-time">{stddevs[phase] != null ? formatTime(stddevs[phase]!) : '—'}</td>
              <td className="phase-pct">{percentages[phase] != null ? `${percentages[phase]!.toFixed(0)}%` : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
