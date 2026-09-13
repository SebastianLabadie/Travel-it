import { useState, useEffect } from 'preact/hooks';
import type { ScheduleDayWithDate, SlotKind } from '../../lib/types';
import { computeTripState, localISODate } from '../../lib/tripState';
import { DayHeader } from './DayHeader';
import { SlotRow } from './SlotRow';
import {
  KIND_DEFS,
  KIND_ORDER,
  NIGHT_FILLS,
  computeStats,
  nightsFromSchedule,
} from './constants';

// ── Types ────────────────────────────────────────────────────────────────────

interface TimelineViewProps {
  schedule: ScheduleDayWithDate[];
}

type Tree = 'm' | 'd';

const dayAnchor = (tree: Tree, isoDate: string) => `tl-${tree}-${isoDate}`;

/** Distinct transport kinds used in a day, in legend order (for the index). */
function dayKinds(day: ScheduleDayWithDate): SlotKind[] {
  const used = new Set(day.slots.map((s) => s.kind));
  return KIND_ORDER.filter((k) => used.has(k) && k !== 'note' && k !== 'food' && k !== 'lodging');
}

// ── Summary strip ─────────────────────────────────────────────────────────────

function SummaryStrip({ schedule }: { schedule: ScheduleDayWithDate[] }) {
  const nights = nightsFromSchedule(schedule);
  const stats = computeStats(schedule);

  const statItems = [
    { value: `${stats.carDays} días`, label: 'de auto' },
    { value: `~${Math.round(stats.driveHours)} h`, label: 'al volante' },
    { value: `${stats.flightDays} vuelos`, label: `+ ${stats.catamarans} catamaranes` },
    { value: `${stats.fullPackLegs} tramos`, label: 'con mochila completa' },
  ];

  return (
    <div className="tl-summary">
      {/* 17 nights, one cell each */}
      <ol
        aria-label={`${nights.length} noches por destino`}
        style={{
          display: 'flex',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          border: '1px solid var(--color-rule)',
        }}
      >
        {nights.map((n, i) => {
          const prev = nights[i - 1];
          const first = !prev || prev.slug !== n.slug;
          return (
            <li
              key={n.index}
              title={`Noche ${n.index} · ${n.sleep}`}
              style={{
                flex: 1,
                minWidth: 0,
                height: 30,
                background: NIGHT_FILLS[n.slug] ?? 'var(--color-bg-alt)',
                borderLeft: first && i > 0 ? '1px solid var(--color-fg)' : 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: 8,
                letterSpacing: '0.08em',
                color: 'var(--color-fg)',
                overflow: 'hidden',
              }}
            >
              <span className={first ? 'tl-night-code' : 'tl-night-code tl-night-code--rest'}>
                {n.code}
              </span>
              <span className="tl-sr-only">
                Noche {n.index}: {n.sleep}
              </span>
            </li>
          );
        })}
      </ol>

      {/* Mini stats */}
      <dl className="tl-stats">
        {statItems.map((s) => (
          <div key={s.label} style={{ padding: '10px 0 0' }}>
            <dt
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 20,
                fontStyle: 'italic',
                lineHeight: 1,
                color: 'var(--color-fg)',
              }}
            >
              {s.value}
            </dt>
            <dd
              style={{
                margin: '4px 0 0',
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--color-stone)',
              }}
            >
              {s.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

// ── Legend ────────────────────────────────────────────────────────────────────

function Legend() {
  return (
    <ul
      aria-label="Leyenda de transportes"
      className="tl-legend"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px 14px',
        listStyle: 'none',
        margin: 0,
        padding: 0,
      }}
    >
      {KIND_ORDER.map((k) => {
        const def = KIND_DEFS[k];
        return (
          <li
            key={k}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.12em',
              color: 'var(--color-fg)',
            }}
          >
            <span aria-hidden="true" style={{ color: def.color, fontSize: 12, lineHeight: 1 }}>
              {def.glyph}
            </span>
            {def.label}
          </li>
        );
      })}
    </ul>
  );
}

// ── Day index (desktop column / mobile chip row) ─────────────────────────────

interface DayIndexProps {
  schedule: ScheduleDayWithDate[];
  tree: Tree;
  todayISO: string | null;
  variant: 'column' | 'chips';
}

function DayIndex({ schedule, tree, todayISO, variant }: DayIndexProps) {
  const isChips = variant === 'chips';
  return (
    <nav aria-label="Índice de días" className={isChips ? 'tl-chips' : 'tl-index'}>
      <ol
        style={{
          listStyle: 'none',
          margin: 0,
          padding: 0,
          display: 'flex',
          flexDirection: isChips ? 'row' : 'column',
          gap: isChips ? 6 : 0,
        }}
      >
        {schedule.map((day, i) => {
          const isToday = todayISO !== null && day.isoDate === todayISO;
          const accent = isToday
            ? 'var(--color-glacier)'
            : day.critical
              ? 'var(--color-warning)'
              : 'transparent';
          return (
            <li key={day.isoDate} style={{ flexShrink: 0 }}>
              <a
                href={`#${dayAnchor(tree, day.isoDate)}`}
                aria-current={isToday ? 'date' : undefined}
                style={
                  isChips
                    ? {
                        display: 'inline-flex',
                        flexDirection: 'column',
                        gap: 2,
                        padding: '5px 10px',
                        border: `1px solid ${isToday || day.critical ? accent : 'var(--color-rule)'}`,
                        textDecoration: 'none',
                        color: 'var(--color-fg)',
                        background: isToday ? 'var(--color-paper)' : 'transparent',
                      }
                    : {
                        display: 'grid',
                        gridTemplateColumns: '44px 1fr auto',
                        gap: 8,
                        alignItems: 'baseline',
                        padding: '9px 16px 9px 13px',
                        borderTop: '1px solid var(--color-rule)',
                        borderLeft: `3px solid ${accent}`,
                        textDecoration: 'none',
                        color: 'var(--color-fg)',
                        background: isToday
                          ? 'var(--color-paper)'
                          : day.critical
                            ? 'color-mix(in srgb, var(--color-warning) 8%, transparent)'
                            : 'transparent',
                      }
                }
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    color: isToday ? 'var(--color-fg)' : 'var(--color-stone)',
                    fontWeight: isToday ? 600 : 400,
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {day.date}
                </span>
                {!isChips && (
                  <span
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 14,
                      fontStyle: 'italic',
                      lineHeight: 1.2,
                    }}
                  >
                    {day.title}
                  </span>
                )}
                <span
                  aria-hidden="true"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    letterSpacing: '0.1em',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {dayKinds(day).map((k) => (
                    <span key={k} style={{ color: KIND_DEFS[k].color }}>
                      {KIND_DEFS[k].glyph}
                    </span>
                  ))}
                </span>
                {day.critical && <span className="tl-sr-only">Día crítico. </span>}
                <span className="tl-sr-only">Día {i + 1}, {day.title}</span>
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// ── Day list ─────────────────────────────────────────────────────────────────

interface DayListProps {
  schedule: ScheduleDayWithDate[];
  tree: Tree;
  todayISO: string | null;
}

function DayList({ schedule, tree, todayISO }: DayListProps) {
  return (
    <ol className="tl-days" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {schedule.map((day, i) => {
        const isToday = todayISO !== null && day.isoDate === todayISO;
        return (
          <li
            key={day.isoDate}
            id={dayAnchor(tree, day.isoDate)}
            data-today={isToday ? 'true' : undefined}
            style={{ marginBottom: 28, scrollMarginTop: 8 }}
          >
            <DayHeader day={day} index={i} isToday={isToday} />
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {day.slots.map((slot, j) => (
                <SlotRow key={`${day.isoDate}-${j}`} slot={slot} isoDate={day.isoDate} />
              ))}
            </ul>
          </li>
        );
      })}
    </ol>
  );
}

// ── Root island ──────────────────────────────────────────────────────────────

/**
 * TimelineView — Preact island (client:visible).
 * Hour-by-hour movement plan: summary strip, transport legend, sticky day
 * headers and slot rows. Renders both a mobile tree (chip index + list) and
 * a desktop tree (index column + list); CSS in timeline.astro flips them at
 * 1024px. Today is computed client-side (F-04) and auto-scrolled into view.
 */
export function TimelineView({ schedule }: TimelineViewProps) {
  const [todayISO, setTodayISO] = useState<string | null>(null);

  useEffect(() => {
    const now = new Date();
    const slim = schedule.map((d) => ({
      isoDate: d.isoDate,
      dest: d.to,
      destName: d.to,
      main: d.title,
      transfer: null,
      critical: d.critical,
    }));
    const state = computeTripState(slim, now);
    if (state.phase !== 'inflight') return;

    const iso = localISODate(now);
    setTodayISO(iso);

    // Auto-scroll to today in whichever tree is visible (respects reduced motion).
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const target = [dayAnchor('m', iso), dayAnchor('d', iso)]
      .map((id) => document.getElementById(id))
      .find((el) => el !== null && el.offsetParent !== null);
    target?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  }, [schedule]);

  if (schedule.length === 0) {
    return (
      <p
        style={{
          padding: '24px 20px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-stone)',
        }}
      >
        No hay horarios cargados todavía.
      </p>
    );
  }

  const totalDays = schedule.length;
  const totalNights = totalDays - 1;

  return (
    <section
      className="tl-root"
      aria-label="Timeline del viaje"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {/* ── Page header ─────────────────────────────────────── */}
      <div className="tl-header">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'var(--color-stone)',
          }}
        >
          06 · TIMELINE
        </div>
        <h1
          className="tl-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            margin: '4px 0 6px',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          Cómo nos <span style={{ fontStyle: 'italic' }}>movemos</span>.
        </h1>
        <p
          style={{
            margin: '0 0 14px',
            fontSize: 12,
            lineHeight: 1.5,
            color: 'var(--color-stone)',
          }}
        >
          {totalDays} días · {totalNights} noches · horarios y transportes, día por día.
        </p>

        <SummaryStrip schedule={schedule} />
        <div style={{ marginTop: 14 }}>
          <Legend />
        </div>
      </div>

      {/* ── Mobile: chip index + single column ─────────────── */}
      <div className="tl-mobile">
        <DayIndex schedule={schedule} tree="m" todayISO={todayISO} variant="chips" />
        <div style={{ padding: '0 20px 24px' }}>
          <DayList schedule={schedule} tree="m" todayISO={todayISO} />
        </div>
      </div>

      {/* ── Desktop: index column + day list ───────────────── */}
      <div className="tl-desktop">
        <DayIndex schedule={schedule} tree="d" todayISO={todayISO} variant="column" />
        <div className="tl-scroll">
          <DayList schedule={schedule} tree="d" todayISO={todayISO} />
        </div>
      </div>
    </section>
  );
}
