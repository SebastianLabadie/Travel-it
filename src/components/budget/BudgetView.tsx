import { useState, useMemo } from 'preact/hooks';
import type { Destination, BudgetItem } from '../../lib/types';
import { categoryTotals } from '../../lib/budget';
import { TotalHero } from './TotalHero';
import { PaxToggle } from './PaxToggle';

// ── Types ────────────────────────────────────────────────────────────────────

interface BudgetViewProps {
  destinations: Destination[];
  budgetItems: BudgetItem[];
}

// ── Root island ──────────────────────────────────────────────────────────────

/**
 * BudgetView — Preact island (client:only="preact").
 * Responsive: mobile single-column + desktop comfortable layout.
 * Both views rendered; CSS controls visibility at 1024px.
 */
export function BudgetView({ destinations, budgetItems }: BudgetViewProps) {
  const [pax, setPax] = useState(5);
  const [viz, _setViz] = useState<'bar' | 'table'>('bar');

  const totals = useMemo(
    () => categoryTotals(budgetItems, destinations, pax),
    [budgetItems, destinations, pax]
  );

  return (
    <section aria-label="Presupuesto del viaje">
      {/* Mobile view */}
      <div className="bdg-mobile">
        <TotalHero pax={pax} totals={totals} layout="stacked" />
        <div style={{ marginTop: 16 }}>
          <PaxToggle pax={pax} onChange={setPax} />
        </div>
      </div>

      {/* Desktop view */}
      <div className="bdg-desktop">
        <TotalHero pax={pax} totals={totals} layout="side-by-side" />
        <div style={{ marginTop: 20 }}>
          <PaxToggle pax={pax} onChange={setPax} />
        </div>
      </div>
    </section>
  );
}
