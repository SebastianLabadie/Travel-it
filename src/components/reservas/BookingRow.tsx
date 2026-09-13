import type { Booking } from '../../lib/types';
import { UrgencyBadge } from './UrgencyBadge';
import { StatusBadge } from './StatusBadge';
import { OwnerChip } from './OwnerChip';
import { formatCost, formatDeadline } from './constants';

interface BookingRowProps {
  booking: Booking;
  selected: boolean;
  onSelect: () => void;
  density: 'compact' | 'comfortable';
  showInlineDetails?: boolean;
}

/** Booking row with grid layout, density, and selection states per DESIGN.md §5.10 */
export function BookingRow({
  booking,
  selected,
  onSelect,
  density,
  showInlineDetails = false,
}: BookingRowProps) {
  const isCompact = density === 'compact';
  const py = isCompact ? '12px' : '14px';
  const px = isCompact ? '20px' : '24px';
  const costStr = formatCost(booking.cost);
  const deadlineStr = formatDeadline(booking.deadline);

  return (
    <>
      <button
        onClick={onSelect}
        aria-pressed={selected}
        aria-expanded={showInlineDetails ? selected : undefined}
        style={{
        width: '100%',
        textAlign: 'left',
        cursor: 'pointer',
        padding: `${py} ${px}`,
        border: 'none',
        borderTop: '1px solid var(--color-rule)',
        borderLeft: selected ? '3px solid var(--color-fg)' : '3px solid transparent',
        background: selected ? 'var(--color-paper)' : 'transparent',
        display: 'block',
        fontFamily: 'inherit',
        color: 'inherit',
      }}
      onMouseDown={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = 'var(--color-bg-alt)';
      }}
      onMouseUp={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = selected ? 'var(--color-paper)' : 'transparent';
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = selected ? 'var(--color-paper)' : 'transparent';
      }}
    >
      {/* Desktop grid: title | urgency | cost | status | link */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: isCompact ? '1fr auto' : '1fr auto auto auto auto',
          gap: isCompact ? '8px' : '16px',
          alignItems: 'center',
        }}
      >
        {/* Title + deadline (mobile stacks) */}
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: isCompact ? 15 : 17,
              fontStyle: 'italic',
              color: 'var(--color-fg)',
              lineHeight: 1.2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {booking.title}
          </div>
          {(deadlineStr || booking.owner) && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginTop: 3,
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                color: 'var(--color-stone)',
                letterSpacing: '0.08em',
              }}
            >
              {booking.owner && <OwnerChip owner={booking.owner} />}
              {deadlineStr && <span>{deadlineStr}</span>}
            </div>
          )}
        </div>

        {/* Badges + cost */}
        {!isCompact && <UrgencyBadge urgency={booking.urgency} />}
        {!isCompact && costStr && (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--color-stone)',
              whiteSpace: 'nowrap',
            }}
          >
            {costStr}
          </div>
        )}
        {!isCompact && <StatusBadge status={booking.status} />}

        {/* Mobile: right side shows urgency badge */}
        {isCompact && <UrgencyBadge urgency={booking.urgency} />}
      </div>

      </button>

      {/* Mobile inline details — sibling of button to keep HTML valid */}
      {isCompact && showInlineDetails && selected && (
        <div
          style={{
            padding: '10px 20px 14px',
            borderTop: '1px dashed var(--color-rule)',
            background: 'var(--color-paper)',
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
            <StatusBadge status={booking.status} />
            {costStr && (
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--color-stone)',
                }}
              >
                {costStr}
              </span>
            )}
          </div>
          {booking.notes && (
            <div
              style={{
                fontSize: 12,
                lineHeight: 1.45,
                color: 'var(--color-fg)',
              }}
            >
              {booking.notes}
            </div>
          )}
          {booking.link && (
            <a
              href={booking.link}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--color-fg)',
                textDecoration: 'underline',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                alignSelf: 'flex-start',
              }}
            >
              Ver más <span style={{ color: 'var(--color-stone)' }}>↗</span>
            </a>
          )}
        </div>
      )}
    </>
  );
}
