import { getCollection } from 'astro:content';
import type { Destination, Day, DayWithDate, TripDaySlim, Route, ChecklistCategory, Booking, BudgetItem } from './types';

/**
 * Returns all destinations sorted by their `order` field (0..5, MVD first).
 */
export async function getDestinations(): Promise<Destination[]> {
  const entries = await getCollection('destinations');
  return entries
    .map((e) => e.data)
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns all days sorted by ISO file id (2026-11-21 → 2026-12-08).
 * The file id IS the ISO date, so lexicographic sort is correct.
 */
export async function getDays(): Promise<Day[]> {
  const entries = await getCollection('days');
  return entries
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e) => e.data);
}

/**
 * Returns all route segments in draw order.
 * Files are prefixed with a digit (1-mvd-fte, 2-fte-elc, ...) so sorting by
 * entry id yields the travel order.
 */
export async function getRoutes(): Promise<Route[]> {
  const entries = await getCollection('routes');
  return entries
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e) => e.data);
}

/**
 * Returns all checklist categories sorted by their `order` field (0..7).
 */
export async function getChecklist(): Promise<ChecklistCategory[]> {
  const entries = await getCollection('checklist-items');
  return entries
    .map((e) => e.data)
    .sort((a, b) => a.order - b.order);
}

/**
 * Returns only days where `critical === true`.
 */
export async function getCriticalDays(): Promise<Day[]> {
  const days = await getDays();
  return days.filter((d) => d.critical);
}

/**
 * Returns a single destination by its `slug` field, or undefined if not found.
 */
export async function getDestinationBySlug(slug: string): Promise<Destination | undefined> {
  const destinations = await getDestinations();
  return destinations.find((d) => d.slug === slug);
}

/**
 * Returns all budget items sorted by category (flight → transfer → insurance → activity)
 * and then by id ascending.
 */
export async function getBudgetItems(): Promise<BudgetItem[]> {
  const entries = await getCollection('budget-items');
  const catOrder = ['flight', 'transfer', 'insurance', 'activity'] as const;
  return entries
    .map((e) => e.data)
    .sort((a, b) => {
      const catDiff = catOrder.indexOf(a.cat) - catOrder.indexOf(b.cat);
      if (catDiff !== 0) return catDiff;
      return a.id.localeCompare(b.id);
    });
}

/**
 * Returns all days with their ISO date extracted from the collection entry id.
 * Used by ItineraryView to highlight the current day.
 */
export async function getDaysWithDate(): Promise<DayWithDate[]> {
  const entries = await getCollection('days');
  return entries
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e) => ({ ...e.data, isoDate: e.id.slice(0, 10) }));
}

/**
 * Returns a slim representation of days with resolved destination names.
 * Used by the TripStatus island to compute and display the trip state.
 */
export async function getTripDaysSlim(): Promise<TripDaySlim[]> {
  const [dayEntries, destEntries] = await Promise.all([
    getCollection('days'),
    getCollection('destinations'),
  ]);
  const destNameMap = new Map(destEntries.map((e) => [e.data.slug, e.data.name]));
  return dayEntries
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((e) => ({
      isoDate: e.id.slice(0, 10),
      dest: e.data.dest,
      destName: destNameMap.get(e.data.dest) ?? e.data.dest,
      main: e.data.main,
      transfer: e.data.transfer,
      critical: e.data.critical,
    }));
}

/**
 * Returns all bookings sorted by urgency (alta-ya → alta-3-6m → media → baja)
 * and then by deadline ascending.
 */
export async function getBookings(): Promise<Booking[]> {
  const entries = await getCollection('bookings');
  const urgencyOrder = ['alta-ya', 'alta-3-6m', 'media', 'baja'] as const;
  return entries
    .map((e) => e.data)
    .sort((a, b) => {
      const urgencyDiff = urgencyOrder.indexOf(a.urgency) - urgencyOrder.indexOf(b.urgency);
      if (urgencyDiff !== 0) return urgencyDiff;
      if (a.deadline && b.deadline) return a.deadline.localeCompare(b.deadline);
      if (a.deadline) return -1;
      if (b.deadline) return 1;
      return 0;
    });
}
