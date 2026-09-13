import type { Booking, MemberId, TeamMember } from '../../lib/types';

const MONTHS = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

/** "2026-09-30" → "30 sep" */
export function formatTargetDate(iso: string): string {
  const [, month, day] = iso.split('-').map(Number);
  if (!month || !day) return iso;
  return `${day} ${MONTHS[month - 1]}`;
}

export interface OwnerProgress {
  member: TeamMember;
  total: number;
  done: number;       // reservado + pagado
  paid: number;
}

/** Per-member booking progress, computed from `bookings[].owner`. */
export function computeOwnerProgress(team: TeamMember[], bookings: Booking[]): OwnerProgress[] {
  return team.map((member) => {
    const own = bookings.filter((b) => b.owner === member.id);
    return {
      member,
      total: own.length,
      done: own.filter((b) => b.status !== 'pendiente').length,
      paid: own.filter((b) => b.status === 'pagado').length,
    };
  });
}

/** Bookings without an owner (shown as a footnote so nothing falls through). */
export function unassignedBookings(bookings: Booking[]): Booking[] {
  return bookings.filter((b) => b.owner === undefined);
}

export const MEMBER_LABEL: Record<MemberId, string> = {
  pipe: 'PIPE',
  batman: 'BATMAN',
  varelinni: 'VARELINNI',
  wire: 'WIRE',
};
