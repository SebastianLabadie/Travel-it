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

// ── Derived scalar types ─────────────────────────────────────────────────────
export type ChecklistItem = ChecklistCategory['items'][number];
export type RouteMode = Route['mode'];
export type Difficulty = Destination['activities'][number]['difficulty'];
export type Country = Destination['country'];
