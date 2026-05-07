import type { ProgressStats } from './constants';

interface ReservasHeaderProps {
  progress: ProgressStats;
}

function ProgressBar({ pct }: { pct: number }) {
  return (
    <div
      style={{
        height: 4,
        background: 'var(--color-rule)',
        position: 'relative',
        marginTop: 10,
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: `${pct}%`,
          background: 'var(--color-moss)',
          transition: 'width 0.3s',
        }}
      />
    </div>
  );
}

/** Header with eyebrow, title, 3-up progress grid, and progress bar */
export function ReservasHeader({ progress }: ReservasHeaderProps) {
  const { total, completed, urgent } = progress;
  const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

  const statItems = [
    { label: 'Total', value: total },
    { label: 'Completadas', value: completed },
    { label: 'Urgentes', value: urgent },
  ];

  return (
    <div className="rsv-header">
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          color: 'var(--color-stone)',
        }}
      >
        04 · RESERVAS
      </div>
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          margin: '4px 0 14px',
          letterSpacing: '-0.02em',
        }}
        className="rsv-title"
      >
        Lo que hay que{' '}
        <span style={{ fontStyle: 'italic' }}>reservar</span>.
      </h1>

      {/* 3-up progress grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16,
          marginBottom: 4,
        }}
      >
        {statItems.map((s) => (
          <div key={s.label}>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 28,
                fontStyle: 'italic',
                lineHeight: 1,
                color: 'var(--color-fg)',
              }}
            >
              {s.value}
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-stone)',
                marginTop: 4,
              }}
            >
              {s.label}
            </div>
          </div>
        ))}
      </div>

      <ProgressBar pct={pct} />
    </div>
  );
}
