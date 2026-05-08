import type { BudgetTotals } from '../../lib/budget';
import { fmt } from '../../lib/budget';

interface PercentTableProps {
  totals: BudgetTotals;
  layout: 'stacked' | 'side-by-side';
}

const CATS: {
  key: keyof Omit<BudgetTotals, 'total'>;
  label: string;
  color: string;
}[] = [
  { key: 'flights', label: 'Vuelos', color: 'var(--color-glacier)' },
  { key: 'transfers', label: 'Traslados', color: 'var(--color-stone)' },
  { key: 'insurance', label: 'Seguro', color: 'var(--color-moss)' },
  { key: 'lodging', label: 'Alojamiento', color: 'var(--color-fg)' },
  { key: 'activities', label: 'Actividades', color: 'var(--color-warning)' },
];

/** Mono-font table with percentage bars per category */
export function PercentTable({ totals, layout }: PercentTableProps) {
  const isStacked = layout === 'stacked';

  const mids = CATS.map((c) => (totals[c.key][0] + totals[c.key][1]) / 2);
  const sumMids = mids.reduce((a, b) => a + b, 0);
  const pcts = mids.map((m) => (sumMids > 0 ? (m / sumMids) * 100 : 0));

  return (
    <div style={{ marginTop: isStacked ? 24 : 32 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          color: 'var(--color-stone)',
          textTransform: 'uppercase',
          marginBottom: 12,
        }}
      >
        Distribución del gasto
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: isStacked ? 8 : 10,
        }}
      >
        {CATS.map((cat, i) => {
          const pct = pcts[i] ?? 0;
          return (
            <div
              key={cat.key}
              style={{
                display: 'grid',
                gridTemplateColumns: isStacked
                  ? '100px 1fr 40px'
                  : '120px 1fr 50px',
                alignItems: 'center',
                gap: 12,
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--color-stone)',
                }}
              >
                {cat.label}
              </div>

              <div
                style={{
                  height: isStacked ? 14 : 16,
                  background: 'var(--color-rule)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${pct}%`,
                    background: cat.color,
                    transition: 'width 0.3s',
                  }}
                />
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: isStacked ? 10 : 11,
                  color: 'var(--color-fg)',
                  textAlign: 'right',
                }}
              >
                {Math.round(pct)}%
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
