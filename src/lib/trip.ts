import { getCollection } from 'astro:content';
import type { Destination, Day, Route, ChecklistCategory } from './types';

/**
 * Returns all destinations sorted by their `order` field (0..5).
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
 * Returns all route segments in their natural collection order.
 */
export async function getRoutes(): Promise<Route[]> {
  const entries = await getCollection('routes');
  return entries.map((e) => e.data);
}

/**
 * Returns all checklist categories sorted by their `order` field (0..6).
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
