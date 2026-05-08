import type { TripDaySlim } from './types';

export type TripState =
  | { phase: 'pre'; daysUntil: number }
  | {
      phase: 'inflight';
      dayNumber: number;
      totalDays: number;
      currentLocation: string;
      tomorrowDay: TripDaySlim | null;
    }
  | { phase: 'post' };

const TRIP_START_ISO = '2026-11-21';
const TRIP_END_ISO = '2026-12-08';
const TOTAL_DAYS = 18;

export function localISODate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function computeTripState(days: TripDaySlim[], now: Date = new Date()): TripState {
  const todayISO = localISODate(now);

  if (todayISO < TRIP_START_ISO) {
    const startMs = new Date(TRIP_START_ISO + 'T00:00:00').getTime();
    const todayMs = new Date(todayISO + 'T00:00:00').getTime();
    return { phase: 'pre', daysUntil: Math.ceil((startMs - todayMs) / 86_400_000) };
  }

  if (todayISO > TRIP_END_ISO) {
    return { phase: 'post' };
  }

  const startMs = new Date(TRIP_START_ISO + 'T00:00:00').getTime();
  const todayMs = new Date(todayISO + 'T00:00:00').getTime();
  const dayNumber = Math.floor((todayMs - startMs) / 86_400_000) + 1;

  const todayDays = days.filter((d) => d.isoDate === todayISO);
  const currentDay = todayDays[todayDays.length - 1] ?? null;

  const tomorrowISO = localISODate(new Date(todayMs + 86_400_000));
  const tomorrowDays = days.filter((d) => d.isoDate === tomorrowISO);

  return {
    phase: 'inflight',
    dayNumber,
    totalDays: TOTAL_DAYS,
    currentLocation: currentDay?.destName ?? currentDay?.dest ?? 'En ruta',
    tomorrowDay: tomorrowDays[0] ?? null,
  };
}
