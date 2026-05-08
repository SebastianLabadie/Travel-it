import type { BudgetItem, Destination } from './types';

export type BudgetTotals = {
  flights: [number, number];
  transfers: [number, number];
  insurance: [number, number];
  lodging: [number, number];
  activities: [number, number];
  total: [number, number];
};

/**
 * Sums the [min, max] ranges of a list of budget items.
 * Group-level items (perPerson === false) are divided by `pax`.
 * Items with `range: null` are skipped.
 */
function sumItems(items: BudgetItem[], pax: number): [number, number] {
  let min = 0;
  let max = 0;
  for (const item of items) {
    if (!item.range) continue;
    const divisor = item.perPerson ? 1 : pax;
    min += item.range[0] / divisor;
    max += item.range[1] / divisor;
  }
  return [min, max];
}

/**
 * Computes per-person category totals and the overall total.
 *
 * Lodging is derived from destinations with nights > 0:
 *   [minStay * nights, maxStay * nights]
 */
export function categoryTotals(
  items: BudgetItem[],
  destinations: Destination[],
  pax: number
): BudgetTotals {
  const flights = sumItems(items.filter((i) => i.cat === 'flight'), pax);
  const transfers = sumItems(items.filter((i) => i.cat === 'transfer'), pax);
  const insurance = sumItems(items.filter((i) => i.cat === 'insurance'), pax);
  const activities = sumItems(items.filter((i) => i.cat === 'activity'), pax);

  const lodgingMin = destinations
    .filter((d) => d.nights > 0)
    .reduce((sum, d) => sum + d.stay.range[0] * d.nights, 0);
  const lodgingMax = destinations
    .filter((d) => d.nights > 0)
    .reduce((sum, d) => sum + d.stay.range[1] * d.nights, 0);

  const lodging: [number, number] = [lodgingMin, lodgingMax];

  const totalMin = flights[0] + transfers[0] + insurance[0] + lodging[0] + activities[0];
  const totalMax = flights[1] + transfers[1] + insurance[1] + lodging[1] + activities[1];

  return {
    flights,
    transfers,
    insurance,
    lodging,
    activities,
    total: [totalMin, totalMax],
  };
}

/**
 * Formats a number as a localized integer string.
 */
export function fmt(n: number): string {
  return Math.round(n).toLocaleString('es-UY');
}

/**
 * Formats a [min, max] range as "USD X – Y".
 * When min === max, returns "USD X".
 */
export function fmtRange(range: [number, number]): string {
  const [min, max] = range;
  if (min === max) return `USD ${fmt(min)}`;
  return `USD ${fmt(min)} – ${fmt(max)}`;
}
