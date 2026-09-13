import type { ScheduleDayWithDate, SlotKind } from '../../lib/types';

// ── Slot kinds: label, text glyph and token color ────────────────────────────
// Colors follow DESIGN.md: flights = warning, car/boat (and taxi/bus) = glacier,
// walk/activity = moss, lodging/food/note = stone. Glyph + label always travel
// together so color is never the only cue.

interface KindDef {
  label: string;
  glyph: string;
  color: string;
}

export const KIND_DEFS: Record<SlotKind, KindDef> = {
  flight:   { label: 'VUELO',     glyph: '↗', color: 'var(--color-warning)' },
  car:      { label: 'AUTO',      glyph: '→', color: 'var(--color-glacier)' },
  boat:     { label: 'CATAMARÁN', glyph: '~', color: 'var(--color-glacier)' },
  taxi:     { label: 'TAXI',      glyph: '▸', color: 'var(--color-glacier)' },
  bus:      { label: 'BUS',       glyph: '»', color: 'var(--color-glacier)' },
  walk:     { label: 'A PIE',     glyph: '∧', color: 'var(--color-moss)' },
  activity: { label: 'ACTIVIDAD', glyph: '★', color: 'var(--color-moss)' },
  food:     { label: 'COMIDA',    glyph: '◇', color: 'var(--color-stone)' },
  lodging:  { label: 'DORMIR',    glyph: '⌂', color: 'var(--color-stone)' },
  note:     { label: 'NOTA',      glyph: '·', color: 'var(--color-stone)' },
};

export const KIND_ORDER: SlotKind[] = [
  'flight', 'car', 'boat', 'taxi', 'bus', 'walk', 'activity', 'food', 'lodging', 'note',
];

// ── Nights strip ─────────────────────────────────────────────────────────────
// One cell per night, colored by the destination we sleep in. Fills are token
// mixes (no hex) and every cell carries a short label, so color is redundant.

export const NIGHT_FILLS: Record<string, string> = {
  calafate: 'color-mix(in srgb, var(--color-glacier) 35%, transparent)',
  chalten:  'color-mix(in srgb, var(--color-moss) 35%, transparent)',
  natales:  'color-mix(in srgb, var(--color-stone) 40%, transparent)',
  paine:    'color-mix(in srgb, var(--color-fg) 18%, transparent)',
  ushuaia:  'color-mix(in srgb, var(--color-glacier) 75%, transparent)',
};

export const NIGHT_CODES: Record<string, string> = {
  calafate: 'CAL',
  chalten:  'CHA',
  natales:  'NAT',
  paine:    'TDP',
  ushuaia:  'USH',
};

export interface NightCell {
  index: number;      // 1-based night number
  slug: string;       // destination slug we sleep in
  code: string;
  sleep: string;      // "Airbnb El Calafate · noche 1/17"
}

/** Every day except the last one ends in a night at `day.to`. */
export function nightsFromSchedule(schedule: ScheduleDayWithDate[]): NightCell[] {
  return schedule.slice(0, -1).map((day, i) => ({
    index: i + 1,
    slug: day.to,
    code: NIGHT_CODES[day.to] ?? day.to.slice(0, 3).toUpperCase(),
    sleep: day.sleep,
  }));
}

// ── Summary stats ────────────────────────────────────────────────────────────

export interface TimelineStats {
  carDays: number;        // rental window: first to last day with a car slot
  driveHours: number;     // sum of driveHours
  flightDays: number;     // days with at least one flight
  catamarans: number;     // boat slots that are catamaran crossings
  fullPackLegs: number;   // slots walked with the full backpack
}

export function computeStats(schedule: ScheduleDayWithDate[]): TimelineStats {
  const carIdx = schedule
    .map((d, i) => (d.slots.some((s) => s.kind === 'car') ? i : -1))
    .filter((i) => i >= 0);
  const carDays = carIdx.length > 0 ? carIdx[carIdx.length - 1]! - carIdx[0]! + 1 : 0;

  const driveHours = schedule.reduce((sum, d) => sum + (d.driveHours ?? 0), 0);
  const flightDays = schedule.filter((d) => d.slots.some((s) => s.kind === 'flight')).length;

  let catamarans = 0;
  let fullPackLegs = 0;
  for (const d of schedule) {
    for (const s of d.slots) {
      if (s.kind === 'boat' && /catamar/i.test(s.title)) catamarans++;
      if (/mochila completa/i.test(s.detail ?? '')) fullPackLegs++;
    }
  }

  return { carDays, driveHours, flightDays, catamarans, fullPackLegs };
}

// ── Time helpers ─────────────────────────────────────────────────────────────

const EXACT_TIME = /^\d{2}:\d{2}$/;

/** Returns an ISO dateTime for exact times ("09:45"); null for "~" estimates or empty. */
export function toDateTime(isoDate: string, time: string): string | null {
  return EXACT_TIME.test(time) ? `${isoDate}T${time}` : null;
}

/** Formats drive hours as "3 h" / "2,7 h". */
export function formatHours(h: number): string {
  return `${Number.isInteger(h) ? h : h.toFixed(1).replace('.', ',')} h`;
}
