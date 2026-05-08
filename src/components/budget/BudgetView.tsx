import { useState, useMemo } from 'preact/hooks';
import type { Destination, BudgetItem } from '../../lib/types';
import { categoryTotals } from '../../lib/budget';
import { TotalHero } from './TotalHero';
import { PaxToggle } from './PaxToggle';
import { StackedBar } from './StackedBar';
import { PercentTable } from './PercentTable';
import { DestinationBreakdown } from './DestinationBreakdown';
import { LineItemsSection } from './LineItemsSection';

// ── Types ────────────────────────────────────────────────────────────────────

interface BudgetViewProps {
  destinations: Destination[];
  budgetItems: BudgetItem[];
}

// ── Viz toggle (local) ───────────────────────────────────────────────────────

function VizToggle({
  viz,
  onChange,
  layout,
}: {
  viz: 'bar' | 'table';
  onChange: (v: 'bar' | 'table') => void;
  layout: 'stacked' | 'side-by-side';
}) {
  const isStacked = layout === 'stacked';
  return (
    <div
      role="group"
      aria-label="Tipo de visualización"
      style={{
        display: 'inline-flex',
        gap: 0,
        borderRadius: 4,
        border: '1px solid var(--color-rule)',
        overflow: 'hidden',
        marginTop: isStacked ? 16 : 20,
      }}
    >
      {(['bar', 'table'] as const).map((v) => {
        const active = viz === v;
        return (
          <button
            key={v}
            type="button"
            onClick={() => onChange(v)}
            aria-pressed={active}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              border: 'none',
              borderRight: v === 'bar' ? '1px solid var(--color-rule)' : 'none',
              background: active ? 'var(--color-fg)' : 'transparent',
              color: active ? 'var(--color-paper)' : 'var(--color-fg)',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {v === 'bar' ? 'Barra' : 'Tabla'}
          </button>
        );
      })}
    </div>
  );
}

// ── Root island ──────────────────────────────────────────────────────────────

/**
 * BudgetView — Preact island (client:only="preact").
 * Responsive: mobile single-column + desktop comfortable layout.
 * Both views rendered; CSS controls visibility at 1024px.
 */
export function BudgetView({ destinations, budgetItems }: BudgetViewProps) {
  const [pax, setPax] = useState(5);
  const [viz, setViz] = useState<'bar' | 'table'>('bar');

  const totals = useMemo(
    () => categoryTotals(budgetItems, destinations, pax),
    [budgetItems, destinations, pax]
  );

  const fixedItems = budgetItems.filter(
    (i) => i.cat === 'flight' || i.cat === 'transfer' || i.cat === 'insurance'
  );
  const variableItems = budgetItems.filter((i) => i.cat === 'activity');

  return (
    <section aria-label="Presupuesto del viaje">
      {/* Mobile view */}
      <div className="bdg-mobile">
        <TotalHero pax={pax} totals={totals} layout="stacked" />
        <div style={{ marginTop: 16 }}>
          <PaxToggle pax={pax} onChange={setPax} />
        </div>
        <VizToggle viz={viz} onChange={setViz} layout="stacked" />
        {viz === 'bar' ? (
          <StackedBar totals={totals} layout="stacked" />
        ) : (
          <PercentTable totals={totals} layout="stacked" />
        )}
        <DestinationBreakdown
          destinations={destinations}
          pax={pax}
          layout="stacked"
        />
        <LineItemsSection
          items={fixedItems}
          pax={pax}
          title="Conceptos fijos"
          layout="stacked"
        />
        <LineItemsSection
          items={variableItems}
          pax={pax}
          title="Variable · actividades opcionales"
          layout="stacked"
        />
      </div>

      {/* Desktop view */}
      <div className="bdg-desktop">
        <TotalHero pax={pax} totals={totals} layout="side-by-side" />
        <div style={{ marginTop: 20 }}>
          <PaxToggle pax={pax} onChange={setPax} />
        </div>
        <VizToggle viz={viz} onChange={setViz} layout="side-by-side" />
        {viz === 'bar' ? (
          <StackedBar totals={totals} layout="side-by-side" />
        ) : (
          <PercentTable totals={totals} layout="side-by-side" />
        )}

        {/* Two-column grid: destinations | fixed items */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 40,
            marginTop: 36,
          }}
        >
          <DestinationBreakdown
            destinations={destinations}
            pax={pax}
            layout="side-by-side"
          />
          <LineItemsSection
            items={fixedItems}
            pax={pax}
            title="Conceptos fijos"
            layout="side-by-side"
          />
        </div>

        <LineItemsSection
          items={variableItems}
          pax={pax}
          title="Variable · actividades opcionales"
          layout="side-by-side"
        />
      </div>
    </section>
  );
}
