import type { ScheduleDayWithDate } from '../../lib/types';
import { formatHours } from './constants';

interface DayHeaderProps {
  day: ScheduleDayWithDate;
  index: number;
  isToday: boolean;
}

/**
 * Sticky day header: weekday · date · title · "Dormimos: …" · drive-hours chip.
 * Critical days get the three DESIGN.md §7 signals (warning accent, "!! CRÍTICO"
 * prefix, subtle warning background); today gets the F-04 glacier accent.
 */
export function DayHeader({ day, index, isToday }: DayHeaderProps) {
  const accent = isToday
    ? 'var(--color-glacier)'
    : day.critical
      ? 'var(--color-warning)'
      : 'var(--color-fg)';
  const background = isToday
    ? 'color-mix(in srgb, var(--color-glacier) 14%, var(--color-bg))'
    : day.critical
      ? 'color-mix(in srgb, var(--color-warning) 10%, var(--color-bg))'
      : 'var(--color-bg)';

  return (
    <header
      className="tl-day-header"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 5,
        background,
        borderTop: '1px solid var(--color-fg)',
        borderLeft: `3px solid ${accent}`,
        marginLeft: -3,
        padding: '10px 0 10px 12px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
          flexWrap: 'wrap',
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: 'var(--color-stone)',
        }}
      >
        <span>DÍA {String(index + 1).padStart(2, '0')}</span>
        <span>
          {day.weekday} · <time dateTime={day.isoDate}>{day.date}</time>
        </span>
        {isToday && (
          <span style={{ color: 'var(--color-glacier)', fontWeight: 600, letterSpacing: '0.2em' }}>
            HOY
          </span>
        )}
        {day.critical && (
          <span style={{ color: 'var(--color-warning)', fontWeight: 600 }}>!! CRÍTICO</span>
        )}
      </div>

      <h2
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 22,
          fontStyle: 'italic',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1.1,
          margin: '4px 0 0',
          color: 'var(--color-fg)',
        }}
      >
        {day.title}
      </h2>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          flexWrap: 'wrap',
          marginTop: 6,
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--color-fg)',
          }}
        >
          <span style={{ color: 'var(--color-stone)' }}>Dormimos:</span> {day.sleep}
        </span>
        {day.driveHours !== undefined && day.driveHours > 0 && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              padding: '3px 8px',
              border: '1px solid var(--color-glacier)',
              color: 'var(--color-fg)',
              lineHeight: 1,
            }}
          >
            → {formatHours(day.driveHours)} al volante
          </span>
        )}
      </div>
    </header>
  );
}
