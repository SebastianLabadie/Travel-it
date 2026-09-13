import type { CollectionEntry } from 'astro:content';

// ── Primary types derived from collection schemas ────────────────────────────
// Single source of truth — no manual duplication.
// z.infer happens inside Astro's content layer; we surface via CollectionEntry.

export type Destination = CollectionEntry<'destinations'>['data'];
export type Day = CollectionEntry<'days'>['data'];
export type Route = CollectionEntry<'routes'>['data'];
export type ChecklistCategory = CollectionEntry<'checklist-items'>['data'];
export type Booking = CollectionEntry<'bookings'>['data'];
export type BudgetItem = CollectionEntry<'budget-items'>['data'];
export type ScheduleDay = CollectionEntry<'schedule'>['data'];
export type TeamMember = CollectionEntry<'team'>['data'];

// ── Derived scalar types ─────────────────────────────────────────────────────
export type ChecklistItem = ChecklistCategory['items'][number];
export type RouteMode = Route['mode'];
export type Difficulty = Destination['activities'][number]['difficulty'];
export type Country = Destination['country'];
export type ScheduleSlot = ScheduleDay['slots'][number];
export type SlotKind = ScheduleSlot['kind'];
export type MemberId = TeamMember['id'];

// ── F-04: trip state ─────────────────────────────────────────────────────────
export type DayWithDate = Day & { isoDate: string };

// ── F-12: schedule with ISO date from the file id ────────────────────────────
export type ScheduleDayWithDate = ScheduleDay & { isoDate: string };

export type TripDaySlim = {
  isoDate: string;
  dest: string;
  destName: string;
  main: string;
  transfer: string | null;
  critical: boolean;
};
