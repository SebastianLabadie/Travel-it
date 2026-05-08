import type { BudgetTotals } from '../../lib/budget';
import { fmtRange } from '../../lib/budget';

interface TotalHeroProps {
  pax: number;
  totals: BudgetTotals;
  layout: 'stacked' | 'side-by-side';
}

/** Hero with per-pax total, group contramuestra, and 4-category mini-grid */
export function TotalHero({ pax, totals, layout }: TotalHeroProps) {
  const isStacked = layout === 'stacked';
  const groupTotal: [number, number] = [
    totals.total[0] * pax,
    totals.total[1] * pax,
  ];

  const categories: { key: 'flights' | 'transfers' | 'insurance' | 'activities'; label: string }[] = [
    { key: 'flights', label: 'Vuelos' },
    { key: 'transfers', label: 'Traslados' },
    { key: 'insurance', label: 'Seguro' },
    { key: 'activities', label: 'Actividades' },
  ];

  return (
    <div
      style={{
        padding: isStacked ? '20px 0 16px' : '24px 0 20px',
        borderBottom: '1px solid var(--color-rule)',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          color: 'var(--color-stone)',
          textTransform: 'uppercase',
        }}
      >
        05 · PRESUPUESTO
      </div>

      {/* Title */}
      <h1
        style={{
          fontFamily: 'var(--font-display)',
          fontWeight: 400,
          margin: '4px 0 14px',
          letterSpacing: '-0.02em',
          fontSize: isStacked ? 32 : 38,
        }}
      >
        Lo que sale el{' '}
        <span style={{ fontStyle: 'italic' }}>viaje</span>.
      </h1>

      {/* Top row: big total + group total */}
      <div
        style={{
          display: 'flex',
          flexWrap: isStacked ? 'wrap' : 'nowrap',
          alignItems: isStacked ? 'flex-start' : 'baseline',
          gap: isStacked ? 12 : 24,
        }}
      >
        {/* Per-person total */}
        <div style={{ flex: '1 1 auto' }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              letterSpacing: '0.18em',
              color: 'var(--color-stone)',
              textTransform: 'uppercase',
            }}
          >
            TOTAL POR PERSONA
          </div>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isStacked ? 32 : 44,
              fontStyle: 'italic',
              fontWeight: 400,
              lineHeight: 1.1,
              color: 'var(--color-fg)',
              marginTop: 4,
            }}
          >
            {fmtRange(totals.total)}
          </div>
        </div>

        {/* Group total contramuestra */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--color-stone)',
            whiteSpace: 'nowrap',
            flexShrink: 0,
          }}
        >
          Grupo · {pax} pax ={' '}
          <span style={{ color: 'var(--color-fg)' }}>
            {fmtRange(groupTotal)}
          </span>
        </div>
      </div>

      {/* 4-category mini-grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isStacked ? '1fr 1fr' : 'repeat(4, 1fr)',
          gap: isStacked ? 12 : 16,
          marginTop: isStacked ? 16 : 20,
        }}
      >
        {categories.map((cat) => {
          const range = totals[cat.key];
          return (
            <div key={cat.key}>
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
                  fontSize: isStacked ? 15 : 17,
                  fontStyle: 'italic',
                  color: 'var(--color-fg)',
                  marginTop: 2,
                }}
              >
                {fmtRange(range)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
