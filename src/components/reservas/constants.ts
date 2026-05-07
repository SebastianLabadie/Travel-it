import type { Booking } from '../../lib/types';

// ── Category labels ──────────────────────────────────────────────────────────

export const CATEGORY_LABELS: Record<string, string> = {
  flight: 'Vuelos',
  accommodation: 'Alojamiento',
  transfer: 'Traslados',
  activity: 'Actividades',
  rental: 'Alquiler',
};

export const CATEGORY_ICONS: Record<string, string> = {
  flight: '↗',
  accommodation: '⌂',
  transfer: '→',
  activity: '★',
  rental: '◎',
};

// ── Urgency definitions ──────────────────────────────────────────────────────

export type UrgencyKey = 'alta-ya' | 'alta-3-6m' | 'media' | 'baja';

interface UrgencyDef {
  label: string;
  borderColor: string;
  textColor: string;
  bgColor?: string;
}

export const URGENCY_DEFS: Record<UrgencyKey, UrgencyDef> = {
  'alta-ya': {
    label: '!! AHORA',
    borderColor: 'var(--color-warning)',
    textColor: 'var(--color-warning)',
    bgColor: 'rgba(201,96,26,0.10)',
  },
  'alta-3-6m': {
    label: 'ALTA · 3–6M',
    borderColor: 'var(--color-warning)',
    textColor: 'var(--color-warning)',
  },
  media: {
    label: 'MEDIA',
    borderColor: 'var(--color-moss)',
    textColor: 'var(--color-moss)',
  },
  baja: {
    label: 'BAJA',
    borderColor: 'var(--color-stone)',
    textColor: 'var(--color-stone)',
  },
};

export const URGENCY_ORDER: UrgencyKey[] = ['alta-ya', 'alta-3-6m', 'media', 'baja'];

// ── Status definitions ───────────────────────────────────────────────────────

export type StatusKey = 'pendiente' | 'reservado' | 'pagado';

interface StatusDef {
  label: string;
  borderColor: string;
  textColor: string;
  prefix?: string;
}

export const STATUS_DEFS: Record<StatusKey, StatusDef> = {
  pendiente: {
    label: 'PENDIENTE',
    borderColor: 'var(--color-rule)',
    textColor: 'var(--color-stone)',
  },
  reservado: {
    label: 'RESERVADO',
    borderColor: 'var(--color-glacier)',
    textColor: 'var(--color-glacier)',
  },
  pagado: {
    label: 'PAGADO',
    borderColor: 'var(--color-moss)',
    textColor: 'var(--color-moss)',
    prefix: '✓',
  },
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

export function formatDeadline(deadline?: string): string {
  if (!deadline) return '';
  const [year, month, day] = deadline.split('-').map(Number);
  if (!year || !month || !day) return deadline;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export function isUrgentSoon(urgency: string): boolean {
  return urgency === 'alta-ya' || urgency === 'alta-3-6m';
}

export function groupByCategory(bookings: Booking[]): Record<string, Booking[]> {
  const groups: Record<string, Booking[]> = {};
  for (const b of bookings) {
    const cat = b.category;
    if (!groups[cat]) groups[cat] = [];
    groups[cat].push(b);
  }
  // Maintain category order consistent with CATEGORY_LABELS keys
  const ordered: Record<string, Booking[]> = {};
  for (const key of Object.keys(CATEGORY_LABELS)) {
    if (groups[key]) ordered[key] = groups[key];
  }
  return ordered;
}

export function applyFilter(bookings: Booking[], filter: string | null): Booking[] {
  if (!filter) return bookings;
  return bookings.filter((b) => b.urgency === filter);
}

export interface ProgressStats {
  total: number;
  completed: number;
  urgent: number;
}

export function computeProgress(bookings: Booking[]): ProgressStats {
  return {
    total: bookings.length,
    completed: bookings.filter((b) => b.status === 'pagado').length,
    urgent: bookings.filter((b) => b.urgency === 'alta-ya' || b.urgency === 'alta-3-6m').length,
  };
}

export function countByUrgency(bookings: Booking[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const u of URGENCY_ORDER) {
    counts[u] = 0;
  }
  for (const b of bookings) {
    const count = counts[b.urgency];
    if (count !== undefined) {
      counts[b.urgency] = count + 1;
    }
  }
  return counts;
}

export function formatCost(cost?: Booking['cost']): string {
  if (!cost) return '';
  const suffix = cost.perPerson ? ' p.p.' : '';
  return `${cost.currency} ${cost.amount}${suffix}`;
}
