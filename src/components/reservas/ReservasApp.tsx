import { useState } from 'preact/hooks';
import type { Booking, Destination } from '../../lib/types';
import { ReservasHeader } from './ReservasHeader';
import { UrgencyFilter } from './UrgencyFilter';
import { CategoryHeader } from './CategoryHeader';
import { BookingRow } from './BookingRow';
import { EmptyState } from './EmptyState';
import { BookingDetailPanel } from './BookingDetailPanel';
import {
  groupByCategory,
  applyFilter,
  computeProgress,
  countByUrgency,
} from './constants';

// ── Types ────────────────────────────────────────────────────────────────────

interface ReservasAppProps {
  bookings: Booking[];
  destinations: Destination[];
}

// ── Root island ──────────────────────────────────────────────────────────────

/**
 * ReservasApp — Preact island (client:only="preact").
 * Responsive: mobile single-column + desktop grid with detail panel.
 * Both views rendered; CSS controls visibility at 1024px.
 */
export function ReservasApp({ bookings, destinations }: ReservasAppProps) {
  const [filter, setFilter] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const filtered = applyFilter(bookings, filter);
  const grouped = groupByCategory(filtered);
  const progress = computeProgress(filtered);
  const urgencyCounts = countByUrgency(bookings);

  const selected = bookings.find((b) => b.id === selectedId) ?? null;

  // Empty state guard (spec edge case)
  if (bookings.length === 0) {
    return (
      <section>
        <div className="rsv-header">
          <ReservasHeader progress={{ total: 0, completed: 0, urgent: 0 }} />
        </div>
        <EmptyState hasFilter={false} />
      </section>
    );
  }

  function handleSelect(id: string) {
    setSelectedId((prev) => (prev === id ? null : id));
  }

  return (
    <section aria-label="Reservas del viaje">
      {/* Header + filters */}
      <div className="rsv-header">
        <ReservasHeader progress={progress} />
        <UrgencyFilter
          counts={urgencyCounts}
          active={filter}
          onChange={setFilter}
        />
      </div>

      {/* Mobile view */}
      <div className="rsv-mobile">
        {filtered.length === 0 ? (
          <EmptyState hasFilter={filter !== null} />
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category}>
              <CategoryHeader category={category} count={items.length} />
              {items.map((b) => (
                <BookingRow
                  key={b.id}
                  booking={b}
                  selected={selectedId === b.id}
                  onSelect={() => handleSelect(b.id)}
                  density="compact"
                  showInlineDetails
                />
              ))}
            </div>
          ))
        )}
      </div>

      {/* Desktop view */}
      <div className="rsv-desktop">
        <div className="rsv-list">
          {filtered.length === 0 ? (
            <EmptyState hasFilter={filter !== null} />
          ) : (
            Object.entries(grouped).map(([category, items]) => (
              <div key={category}>
                <CategoryHeader category={category} count={items.length} />
                {items.map((b) => (
                  <BookingRow
                    key={b.id}
                    booking={b}
                    selected={selectedId === b.id}
                    onSelect={() => handleSelect(b.id)}
                    density="comfortable"
                  />
                ))}
              </div>
            ))
          )}
        </div>
        <div className="rsv-panel">
          <BookingDetailPanel booking={selected} destinations={destinations} />
        </div>
      </div>
    </section>
  );
}
