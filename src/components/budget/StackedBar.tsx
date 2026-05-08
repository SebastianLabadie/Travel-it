import type { BudgetTotals } from '../../lib/budget';
import { fmt } from '../../lib/budget';

interface StackedBarProps {
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

/** Horizontal stacked bar with midpoint proportions and color legend */
export function StackedBar({ totals, layout }: StackedBarProps) {
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

      {/* Bar */}
      <div
        style={{
          display: 'flex',
          height: isStacked ? 18 : 22,
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        {CATS.map((cat, i) => {
          const pct = pcts[i] ?? 0;
          if (pct < 0.5) return null;
          return (
            <div
              key={cat.key}
              style={{
                width: `${pct}%`,
                background: cat.color,
                transition: 'width 0.3s',
              }}
              title={`${cat.label}: ${Math.round(pct)}%`}
            />
          );
        })}
      </div>

      {/* Legend */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isStacked ? '1fr 1fr' : 'repeat(5, 1fr)',
          gap: isStacked ? 8 : 12,
          marginTop: isStacked ? 12 : 16,
        }}
      >
        {CATS.map((cat, i) => {
          const pct = pcts[i] ?? 0;
          return (
            <div
              key={cat.key}
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 999,
                  background: cat.color,
                  flexShrink: 0,
                }}
              />
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-stone)',
                  }}
                >
                  {cat.label}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: isStacked ? 13 : 15,
                    fontStyle: 'italic',
                    color: 'var(--color-fg)',
                    marginTop: 1,
                  }}
                >
                  {Math.round(pct)}%
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
