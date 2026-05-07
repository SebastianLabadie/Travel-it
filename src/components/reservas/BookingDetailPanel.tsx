import type { Booking, Destination } from '../../lib/types';
import { UrgencyBadge } from './UrgencyBadge';
import { StatusBadge } from './StatusBadge';
import { CATEGORY_LABELS, formatCost, formatDeadline } from './constants';

interface BookingDetailPanelProps {
  booking: Booking | null;
  destinations: Destination[];
}

/** Desktop detail panel (≥1024px) per DESIGN.md and spec */
export function BookingDetailPanel({ booking, destinations }: BookingDetailPanelProps) {
  if (!booking) {
    return (
      <div
        style={{
          padding: '24px 32px',
          borderLeft: '1px solid var(--color-rule)',
          background: 'var(--color-paper)',
          height: '100%',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--color-stone)',
          }}
        >
          Seleccioná una reserva para ver los detalles.
        </p>
      </div>
    );
  }

  const dest = destinations.find((d) => d.slug === booking.destination);
  const costStr = formatCost(booking.cost);
  const deadlineStr = formatDeadline(booking.deadline);
  const categoryLabel = CATEGORY_LABELS[booking.category] ?? booking.category;

  return (
    <div
      style={{
        padding: '24px 32px',
        borderLeft: '1px solid var(--color-rule)',
        background: 'var(--color-paper)',
        height: '100%',
        overflowY: 'auto',
      }}
    >
      {/* Eyebrow */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.2em',
          color: 'var(--color-stone)',
          textTransform: 'uppercase',
        }}
      >
        {categoryLabel}
      </div>

      {/* Title */}
      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 28,
          fontStyle: 'italic',
          fontWeight: 400,
          margin: '8px 0 16px',
          lineHeight: 1.15,
          letterSpacing: '-0.02em',
        }}
      >
        {booking.title}
      </h2>

      {/* Badges */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        <UrgencyBadge urgency={booking.urgency} />
        <StatusBadge status={booking.status} />
      </div>

      {/* Meta grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {deadlineStr && (
          <div
            style={{
              padding: 14,
              border: '1px solid var(--color-rule)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.16em',
                color: 'var(--color-stone)',
                textTransform: 'uppercase',
              }}
            >
              Fecha límite
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--color-fg)',
                marginTop: 4,
              }}
            >
              {deadlineStr}
            </div>
          </div>
        )}

        {costStr && (
          <div
            style={{
              padding: 14,
              border: '1px solid var(--color-rule)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.16em',
                color: 'var(--color-stone)',
                textTransform: 'uppercase',
              }}
            >
              Costo estimado
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 13,
                color: 'var(--color-fg)',
                marginTop: 4,
              }}
            >
              {costStr}
            </div>
          </div>
        )}

        {dest && (
          <div
            style={{
              padding: 14,
              border: '1px solid var(--color-rule)',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.16em',
                color: 'var(--color-stone)',
                textTransform: 'uppercase',
              }}
            >
              Destino
            </div>
            <div
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 16,
                fontStyle: 'italic',
                color: 'var(--color-fg)',
                marginTop: 4,
              }}
            >
              {dest.name}
            </div>
          </div>
        )}
      </div>

      {/* Notes */}
      {booking.notes && (
        <div style={{ marginBottom: 20 }}>
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.16em',
              color: 'var(--color-stone)',
              textTransform: 'uppercase',
              marginBottom: 6,
            }}
          >
            Notas
          </div>
          <div
            style={{
              fontSize: 13,
              lineHeight: 1.55,
              color: 'var(--color-fg)',
            }}
          >
            {booking.notes}
          </div>
        </div>
      )}

      {/* Link */}
      {booking.link && (
        <a
          href={booking.link}
          target="_blank"
          rel="noopener"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-fg)',
            textDecoration: 'none',
            padding: '8px 16px',
            border: '1px solid var(--color-fg)',
          }}
        >
          Abrir enlace <span style={{ color: 'var(--color-stone)' }}>↗</span>
        </a>
      )}
    </div>
  );
}
