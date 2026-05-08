import { useState, useEffect } from 'preact/hooks';
import { computeTripState, type TripState } from '../../lib/tripState';
import type { TripDaySlim } from '../../lib/types';

const MONTHS_ES = ['ENE','FEB','MAR','ABR','MAY','JUN','JUL','AGO','SEP','OCT','NOV','DIC'];

function formatISODate(isoDate: string): string {
  const parts = isoDate.split('-');
  const mm = parts[1] ?? '01';
  const dd = parts[2] ?? '01';
  return `${parseInt(dd, 10)}·${MONTHS_ES[parseInt(mm, 10) - 1] ?? '???'}`;
}

interface Props {
  days: TripDaySlim[];
  variant?: 'mobile' | 'desktop';
}

// ── Countdown widget ──────────────────────────────────────────────────────────

function Countdown({ state, variant }: { state: TripState; variant: 'mobile' | 'desktop' }) {
  const isDesktop = variant === 'desktop';
  const padX = isDesktop ? 24 : 20;
  const padY = isDesktop ? 22 : 18;
  const numSize = isDesktop ? 96 : 72;

  const wrap = (borderColor: string): preact.JSX.CSSProperties => ({
    background: 'var(--color-paper)',
    border: '1px solid var(--color-rule)',
    borderLeft: `2px solid ${borderColor}`,
    padding: `${padY}px ${padX}px`,
    display: 'flex',
    flexDirection: 'column',
    gap: isDesktop ? 6 : 4,
    fontFamily: 'var(--font-body)',
    color: 'var(--color-fg)',
    width: '100%',
    boxSizing: 'border-box',
  });

  const eyebrow = (color: string): preact.JSX.CSSProperties => ({
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color,
    fontWeight: 600,
  });

  if (state.phase === 'post') {
    return (
      <div style={wrap('var(--color-stone)')}>
        <div style={eyebrow('var(--color-stone)')}>VOLVIMOS · 8·DIC·2026</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: isDesktop ? 38 : 30,
          lineHeight: 1,
          letterSpacing: '-0.02em',
          marginTop: 4,
        }}>
          18 días. Volvimos.
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.1em',
          color: 'var(--color-stone)',
          marginTop: 6,
        }}>
          MVD ← USH · NOV–DIC 2026
        </div>
      </div>
    );
  }

  if (state.phase === 'inflight') {
    return (
      <div style={wrap('var(--color-moss)')}>
        <div style={eyebrow('var(--color-moss)')}>EN EXPEDICIÓN · DÍA EN CURSO</div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: numSize,
          lineHeight: 0.92,
          letterSpacing: '-0.03em',
          color: 'var(--color-moss)',
          display: 'flex',
          alignItems: 'baseline',
          gap: 10,
        }}>
          <span>{state.dayNumber}</span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: isDesktop ? 22 : 18,
            fontStyle: 'normal',
            color: 'var(--color-stone)',
            letterSpacing: '0.04em',
          }}>
            / {state.totalDays}
          </span>
        </div>
        <div style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: isDesktop ? 22 : 17,
          marginTop: 2,
        }}>
          Hoy: {state.currentLocation}
        </div>
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.14em',
          color: 'var(--color-stone)',
          textTransform: 'uppercase',
        }}>
          DÍA {state.dayNumber} DE {state.totalDays} · DESDE 21·NOV
        </div>
      </div>
    );
  }

  // phase === 'pre'
  const isUrgent = state.daysUntil < 7;
  const accent = isUrgent ? 'var(--color-warning)' : 'var(--color-fg)';

  return (
    <div style={wrap(accent)}>
      <div style={eyebrow(isUrgent ? 'var(--color-warning)' : 'var(--color-stone)')}>
        {isUrgent ? '!! FALTA POCO' : 'CUENTA REGRESIVA'}
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: numSize,
        lineHeight: 0.92,
        letterSpacing: '-0.03em',
        color: accent,
        display: 'flex',
        alignItems: 'baseline',
        gap: 10,
      }}>
        <span className={isUrgent ? 'f04-pulse-num' : ''}>{state.daysUntil}</span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: isDesktop ? 14 : 12,
          fontStyle: 'normal',
          color: isUrgent ? 'var(--color-warning)' : 'var(--color-stone)',
          letterSpacing: '0.18em',
          textTransform: 'uppercase',
          fontWeight: 600,
        }}>
          DÍAS
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.16em',
        color: 'var(--color-stone)',
        textTransform: 'uppercase',
        marginTop: 2,
      }}>
        DÍAS PARA PATAGONIA · SALIDA 21·NOV·2026
      </div>
    </div>
  );
}

// ── Tomorrow callout ──────────────────────────────────────────────────────────

function TomorrowCallout({ day, variant }: { day: TripDaySlim; variant: 'mobile' | 'desktop' }) {
  const isDesktop = variant === 'desktop';
  const accent = day.critical ? 'var(--color-warning)' : 'var(--color-glacier)';

  return (
    <div style={{
      background: 'var(--color-paper)',
      border: '1px solid var(--color-rule)',
      borderLeft: `2px solid ${accent}`,
      padding: `${isDesktop ? 14 : 12}px ${isDesktop ? 18 : 14}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      fontFamily: 'var(--font-body)',
      width: '100%',
      boxSizing: 'border-box',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.18em',
          color: accent,
          fontWeight: 600,
          textTransform: 'uppercase',
        }}>
          {day.critical ? '!! MAÑANA · CRÍTICO' : 'MAÑANA'}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.14em',
          color: 'var(--color-stone)',
          textTransform: 'uppercase',
        }}>
          {formatISODate(day.isoDate)}
        </span>
      </div>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontStyle: 'italic',
        fontWeight: 400,
        fontSize: isDesktop ? 22 : 19,
        color: 'var(--color-fg)',
        letterSpacing: '-0.01em',
        lineHeight: 1.05,
      }}>
        {day.destName}
      </div>
      {day.transfer && (
        <div style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.06em',
          color: day.critical ? 'var(--color-warning)' : 'var(--color-stone)',
          marginTop: 2,
        }}>
          ↗ {day.transfer}
        </div>
      )}
    </div>
  );
}

// ── Island root ───────────────────────────────────────────────────────────────

export function TripStatus({ days, variant = 'mobile' }: Props) {
  const [state, setState] = useState(() => computeTripState(days));

  // Refresh at midnight so the widget stays accurate without a page reload
  useEffect(() => {
    const now = new Date();
    const midnight = new Date(now);
    midnight.setHours(24, 0, 0, 0);
    const t = setTimeout(() => setState(computeTripState(days, new Date())), midnight.getTime() - now.getTime());
    return () => clearTimeout(t);
  }, [days]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, width: '100%' }}>
      <Countdown state={state} variant={variant} />
      {state.phase === 'inflight' && state.tomorrowDay && (
        <TomorrowCallout day={state.tomorrowDay} variant={variant} />
      )}
    </div>
  );
}
