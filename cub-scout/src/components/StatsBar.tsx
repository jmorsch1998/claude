import type { SessionStats } from '../types';
import { formatTime } from '../utils/format';

interface Props {
  stats: SessionStats;
}

export function StatsBar({ stats }: Props) {
  const items = [
    { label: 'Ao5', value: stats.ao5 },
    { label: 'Ao12', value: stats.ao12 },
    { label: 'Session', value: stats.sessionAvg },
    { label: 'Best', value: stats.best_ms },
    { label: 'Solves', value: stats.count, raw: true },
  ];

  return (
    <section>
      <div className="section-tag">stats</div>
      <div className="stats-section">
        {items.map(({ label, value, raw }) => (
          <div className="stat-card" key={label}>
            <div className="stat-label">{label}</div>
            <div className={`stat-value ${value == null ? 'empty' : ''}`}>
              {value == null ? '—' : raw ? value : formatTime(value as number)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
