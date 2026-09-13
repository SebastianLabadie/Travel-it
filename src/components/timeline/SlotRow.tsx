import type { ScheduleSlot } from '../../lib/types';
import { KIND_DEFS, toDateTime } from './constants';

interface SlotRowProps {
  slot: ScheduleSlot;
  isoDate: string;
}

function TimeLabel({ time, isoDate }: { time: string; isoDate: string }) {
  if (!time) return <span aria-hidden="true">—</span>;
  const dt = toDateTime(isoDate, time);
  if (dt) return <time dateTime={dt}>{time}</time>;
  return <span title="Horario estimado">{time}</span>;
}

/** One row of the day: time column (mono) · glyph · title · detail. */
export function SlotRow({ slot, isoDate }: SlotRowProps) {
  const def = KIND_DEFS[slot.kind];

  return (
    <li
      style={{
        display: 'grid',
        gridTemplateColumns: '92px 16px 1fr',
        gap: 10,
        padding: '10px 0 10px 12px',
        borderTop: '1px solid var(--color-rule)',
        borderLeft: slot.warning ? '3px solid var(--color-warning)' : '3px solid transparent',
        marginLeft: -3,
      }}
    >
      {/* Time */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-fg)',
          letterSpacing: '0.04em',
          whiteSpace: 'nowrap',
          paddingTop: 2,
        }}
      >
        <TimeLabel time={slot.time} isoDate={isoDate} />
        {slot.end && (
          <>
            <span style={{ color: 'var(--color-stone)' }}>–</span>
            <TimeLabel time={slot.end} isoDate={isoDate} />
          </>
        )}
      </div>

      {/* Glyph (label provided via title + sr text) */}
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 13,
          lineHeight: 1.2,
          color: slot.warning ? 'var(--color-warning)' : def.color,
          textAlign: 'center',
        }}
        aria-hidden="true"
      >
        {def.glyph}
      </div>

      {/* Title + detail */}
      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 8,
              letterSpacing: '0.14em',
              color: slot.warning ? 'var(--color-warning)' : 'var(--color-stone)',
            }}
          >
            {slot.warning ? '!! ' : ''}{def.label}
          </span>
        </div>
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 15,
            fontStyle: 'italic',
            lineHeight: 1.25,
            color: 'var(--color-fg)',
            marginTop: 2,
          }}
        >
          {slot.title}
        </div>
        {slot.detail && (
          <div
            style={{
              fontSize: 11,
              lineHeight: 1.45,
              color: 'var(--color-stone)',
              marginTop: 3,
            }}
          >
            {slot.detail}
          </div>
        )}
      </div>
    </li>
  );
}
