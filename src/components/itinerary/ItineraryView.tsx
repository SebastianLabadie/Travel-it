import { useState, useEffect } from 'preact/hooks';
import type { Destination, DayWithDate } from '../../lib/types';
import { localISODate } from '../../lib/tripState';
import { DifficultyBadge } from './DifficultyBadge';
import { DestinationImage } from '../DestinationImage';

// ── Types ────────────────────────────────────────────────────────────────────

type ViewMode = 'destinos' | 'timeline';

interface ItineraryViewProps {
  destinations: Destination[];
  days: DayWithDate[];
}

// ── localStorage helpers ─────────────────────────────────────────────────────

const LS_KEY = 'travel-it:itin-view:v1';

function loadView(): ViewMode {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw === 'destinos' || raw === 'timeline') return raw;
  } catch {
    /* localStorage unavailable */
  }
  return 'destinos';
}

function saveView(v: ViewMode): void {
  try {
    localStorage.setItem(LS_KEY, v);
  } catch {
    /* localStorage unavailable */
  }
}

// ── Vista Destinos ────────────────────────────────────────────────────────────

interface DestinosViewProps {
  destinations: Destination[];
  days: DayWithDate[];
}

function DestinosView({ destinations, days }: DestinosViewProps) {
  // A destination carries the critical signal when one of its days is critical (AC-F2-09)
  const critDestSlugs = new Set<string>(days.filter((d) => d.critical).map((d) => d.dest));

  return (
    <div style={{ padding: '0 20px 20px' }}>
      {destinations.map((d, i) => {
        const isCrit = critDestSlugs.has(d.slug);
        return (
          <div
            key={d.slug}
            id={d.slug}
            style={{
              borderTop: '1px solid var(--color-rule)',
              padding: '16px 0',
              background: isCrit ? '#C9601A08' : 'transparent',
            }}
          >
            {/* Header row */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--color-stone)',
                  letterSpacing: '0.1em',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 24,
                  fontStyle: 'italic',
                  flex: 1,
                }}
              >
                {d.name}
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--color-stone)',
                }}
              >
                {d.country}
              </span>
            </div>

            {/* Image + meta */}
            <div style={{ display: 'flex', gap: 12, marginTop: 10 }}>
              <DestinationImage slug={d.slug} name={d.name} width={64} height={64} />
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'var(--color-stone)',
                    letterSpacing: '0.1em',
                  }}
                >
                  {d.startDate.toUpperCase()} → {d.endDate.toUpperCase()} · {d.nights}N
                </div>
                <div
                  style={{
                    fontSize: 11,
                    lineHeight: 1.45,
                    marginTop: 4,
                    color: 'var(--color-fg)',
                  }}
                >
                  {d.summary}
                </div>
              </div>
            </div>

            {/* Activity chips */}
            {d.activities.length > 0 && (
              <div
                style={{
                  marginTop: 10,
                  display: 'flex',
                  flexWrap: 'wrap' as const,
                  gap: 6,
                }}
              >
                {d.activities.slice(0, 3).map((a) => (
                  <span
                    key={a.title}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      padding: '3px 8px',
                      border: '1px solid var(--color-rule)',
                      color: 'var(--color-fg)',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {a.title}
                  </span>
                ))}
              </div>
            )}

            {/* Stay line — compact alojamiento + price range (mobile) */}
            <div
              style={{
                marginTop: 8,
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--color-stone)',
              }}
            >
              {d.stay.type} · {d.stay.range ? `USD ${d.stay.range[0]}–${d.stay.range[1]}` : 'A confirmar'}
            </div>

            {/* Critical signal */}
            {isCrit && (
              <div
                style={{
                  marginTop: 8,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 8,
                  color: 'var(--color-warning)',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase' as const,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span
                  style={{
                    display: 'inline-block',
                    width: 0,
                    height: 14,
                    borderLeft: '1px solid var(--color-warning)',
                  }}
                />
                !! INCLUYE DÍA CRÍTICO
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Vista Timeline ─────────────────────────────────────────────────────────────

interface TimelineViewProps {
  destinations: Destination[];
  days: DayWithDate[];
}

function TimelineView({ destinations, days }: TimelineViewProps) {
  const destMap = new Map<string, Destination>();
  for (const d of destinations) destMap.set(d.slug, d);

  // Computed client-side to avoid hydration mismatch (page is statically generated)
  const [todayISO, setTodayISO] = useState<string | null>(null);
  useEffect(() => { setTodayISO(localISODate(new Date())); }, []);

  return (
    <div style={{ padding: '0 20px 20px', position: 'relative' }}>
      {/* Vertical rule line */}
      <div
        style={{
          position: 'absolute',
          left: 76,
          top: 0,
          bottom: 0,
          width: 1,
          background: 'var(--color-rule)',
        }}
      />
      <ol style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {days.map((day, idx) => {
          const dest = destMap.get(day.dest);
          const isToday = todayISO !== null && day.isoDate === todayISO;
          const isCombo = isToday && day.critical;
          return (
            <li
              key={idx}
              style={{
                display: 'flex',
                gap: 12,
                padding: '10px 0',
                position: 'relative',
                background: day.critical ? '#C9601A10' : 'transparent',
                borderLeft: day.critical
                  ? '3px solid var(--color-warning)'
                  : '3px solid transparent',
                paddingLeft: day.critical ? 4 : 0,
              }}
            >
              {/* Date */}
              <div
                style={{
                  width: 44,
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: isToday ? 'var(--color-fg)' : 'var(--color-stone)',
                  fontWeight: isToday ? 600 : 400,
                  paddingTop: 3,
                  flexShrink: 0,
                }}
              >
                {day.date.toUpperCase()}
              </div>

              {/* Timeline pin — glacier fill + ring when today */}
              <div style={{ position: 'relative', flexShrink: 0, marginTop: 4 }}>
                {isToday && (
                  <div
                    className={isCombo ? 'f04-pulse-ring' : ''}
                    style={{
                      position: 'absolute',
                      inset: -4,
                      border: `1.5px solid ${isCombo ? 'var(--color-warning)' : 'var(--color-fg)'}`,
                    }}
                  />
                )}
                <div
                  style={{
                    position: 'relative',
                    zIndex: 1,
                    width: 12,
                    height: 12,
                    background: isToday
                      ? 'var(--color-glacier)'
                      : day.critical
                      ? 'var(--color-warning)'
                      : 'var(--color-bg)',
                    border: `1.5px solid ${day.critical ? 'var(--color-warning)' : 'var(--color-fg)'}`,
                  }}
                />
              </div>

              {/* Content */}
              <div style={{ flex: 1, paddingLeft: 4 }}>
                {isToday && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 8,
                      color: isCombo ? 'var(--color-warning)' : 'var(--color-fg)',
                      letterSpacing: '0.2em',
                      fontWeight: 600,
                      marginBottom: 2,
                    }}
                  >
                    HOY
                  </div>
                )}
                {day.critical && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 8,
                      color: 'var(--color-warning)',
                      letterSpacing: '0.16em',
                      marginBottom: 2,
                    }}
                  >
                    !! CRÍTICO
                  </div>
                )}
                {dest && (
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 15,
                      fontStyle: 'italic',
                    }}
                  >
                    {dest.name}
                  </div>
                )}
                <div style={{ fontSize: 11, color: 'var(--color-fg)', marginTop: 2 }}>
                  {day.main}
                </div>
                {day.transfer && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--color-stone)',
                      marginTop: 3,
                    }}
                  >
                    ↗ {day.transfer}
                  </div>
                )}
                {day.critical && day.note && (
                  <div
                    style={{
                      marginTop: 6,
                      padding: '8px 10px',
                      background: 'var(--color-paper)',
                      borderLeft: '2px solid var(--color-warning)',
                      fontFamily: 'var(--font-mono)',
                      fontSize: 9,
                      color: 'var(--color-warning)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    <div style={{ fontWeight: 600 }}>DÍA CRÍTICO</div>
                    <div
                      style={{
                        fontFamily: 'var(--font-body)',
                        letterSpacing: 0,
                        fontSize: 10,
                        lineHeight: 1.4,
                        marginTop: 3,
                        color: 'var(--color-fg)',
                      }}
                    >
                      {day.note}
                    </div>
                  </div>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// ── Desktop view ──────────────────────────────────────────────────────────────

interface DesktopViewProps {
  destinations: Destination[];
  days: DayWithDate[];
}

function DesktopView({ destinations, days }: DesktopViewProps) {
  const [activeSlug, setActiveSlug] = useState<string>(
    destinations[0]?.slug ?? ''
  );
  const [todayISO, setTodayISO] = useState<string | null>(null);
  useEffect(() => { setTodayISO(localISODate(new Date())); }, []);

  const dest = destinations.find((d) => d.slug === activeSlug);
  const destDays = days.filter((d) => d.dest === activeSlug);
  const activeIdx = destinations.findIndex((d) => d.slug === activeSlug);

  // A destination carries the critical signal when one of its days is critical (AC-F2-09)
  const critDestSlugs = new Set<string>(days.filter((d) => d.critical).map((d) => d.dest));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '320px 1fr 380px',
        flex: 1,
        overflow: 'hidden',
      }}
    >
      {/* ── Sidebar: destination list ──────────────────────────── */}
      <nav
        aria-label="Lista de destinos"
        style={{
          borderRight: '1px solid var(--color-rule)',
          overflowY: 'auto' as const,
        }}
      >
        <div
          style={{
            padding: '14px 20px 6px',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'var(--color-stone)',
          }}
        >
          BASES
        </div>
        {destinations.map((d, i) => {
          const sel = d.slug === activeSlug;
          const isCrit = critDestSlugs.has(d.slug);
          return (
            <button
              key={d.slug}
              onClick={() => setActiveSlug(d.slug)}
              aria-current={sel ? 'true' : undefined}
              style={{
                width: '100%',
                textAlign: 'left' as const,
                cursor: 'pointer',
                padding: '12px 20px',
                border: 'none',
                borderLeft: `3px solid ${sel ? 'var(--color-fg)' : 'transparent'}`,
                background: sel
                  ? 'var(--color-paper)'
                  : isCrit
                    ? '#C9601A08'
                    : 'transparent',
                display: 'flex',
                alignItems: 'baseline',
                gap: 10,
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 10,
                  color: 'var(--color-stone)',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 17,
                    fontStyle: 'italic',
                  }}
                >
                  {d.name}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    color: 'var(--color-stone)',
                    marginTop: 2,
                  }}
                >
                  {d.startDate} → {d.endDate} · {d.nights}N
                </div>
                {isCrit && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 8,
                      color: 'var(--color-warning)',
                      letterSpacing: '0.16em',
                      marginTop: 4,
                    }}
                  >
                    !! INCLUYE DÍA CRÍTICO
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </nav>

      {/* ── Detail panel ──────────────────────────────────────── */}
      <main
        style={{
          overflowY: 'auto' as const,
          padding: '24px 32px',
        }}
      >
        {dest ? (
          <>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 9,
                letterSpacing: '0.2em',
                color: 'var(--color-warning)',
              }}
            >
              DESTINO · {String(activeIdx + 1).padStart(2, '0')}
            </div>
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 44,
                fontStyle: 'italic',
                fontWeight: 400,
                margin: '4px 0 4px',
                letterSpacing: '-0.02em',
              }}
            >
              {dest.name}
            </h2>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                color: 'var(--color-stone)',
                letterSpacing: '0.1em',
              }}
            >
              {dest.coords[1].toFixed(2)}°S · {Math.abs(dest.coords[0]).toFixed(2)}°W · {dest.country}
            </div>

            {/* Image + summary */}
            <div style={{ display: 'flex', gap: 16, marginTop: 18 }}>
              <DestinationImage slug={dest.slug} name={dest.name} width={200} height={130} />
              <div
                style={{
                  flex: 1,
                  fontSize: 14,
                  lineHeight: 1.55,
                  color: 'var(--color-fg)',
                }}
              >
                {dest.summary}
              </div>
            </div>

            {/* Activities */}
            <div style={{ marginTop: 24 }}>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.2em',
                  color: 'var(--color-stone)',
                  marginBottom: 8,
                }}
              >
                ACTIVIDADES SUGERIDAS
              </div>
              {dest.activities.map((a) => (
                <div
                  key={a.title}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr auto auto',
                    gap: 16,
                    padding: '12px 0',
                    borderTop: '1px solid var(--color-rule)',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 17,
                      fontStyle: 'italic',
                    }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--color-stone)',
                    }}
                  >
                    {a.hours}h
                  </div>
                  <DifficultyBadge difficulty={a.difficulty} />
                </div>
              ))}
            </div>

            {/* Stay + out */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 16,
                marginTop: 24,
              }}
            >
              <div
                style={{
                  padding: 16,
                  background: 'var(--color-paper)',
                  border: '1px solid var(--color-rule)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    color: 'var(--color-stone)',
                  }}
                >
                  ALOJAMIENTO
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 18,
                    fontStyle: 'italic',
                    marginTop: 4,
                  }}
                >
                  {dest.stay.type}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 11,
                    color: 'var(--color-fg)',
                    marginTop: 4,
                  }}
                >
                  {dest.stay.range ? `USD ${dest.stay.range[0]}–${dest.stay.range[1]}` : 'A confirmar'}{' '}
                  <span style={{ color: 'var(--color-stone)' }}>/ persona / noche</span>
                </div>
              </div>
              <div
                style={{
                  padding: 16,
                  background: 'var(--color-paper)',
                  border: '1px solid var(--color-rule)',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.16em',
                    color: 'var(--color-stone)',
                  }}
                >
                  SALIDA
                </div>
                <div
                  style={{
                    fontSize: 13,
                    marginTop: 4,
                    lineHeight: 1.4,
                  }}
                >
                  ↗ {dest.out}
                </div>
              </div>
            </div>
          </>
        ) : (
          <p
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: 'var(--color-stone)',
            }}
          >
            Seleccioná un destino de la lista.
          </p>
        )}
      </main>

      {/* ── Days column ───────────────────────────────────────── */}
      <div
        style={{
          borderLeft: '1px solid var(--color-rule)',
          overflowY: 'auto' as const,
          background: 'var(--color-bg-alt)',
        }}
      >
        <div
          style={{
            padding: '14px 20px 6px',
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.2em',
            color: 'var(--color-stone)',
          }}
        >
          DÍAS EN ESTA BASE
        </div>
        {destDays.length === 0 && (
          <p
            style={{
              padding: '14px 20px',
              fontFamily: 'var(--font-mono)',
              fontSize: 10,
              color: 'var(--color-stone)',
            }}
          >
            Sin días registrados.
          </p>
        )}
        {destDays.map((day, idx) => {
          const isToday = todayISO !== null && day.isoDate === todayISO;
          return (
          <div
            key={idx}
            style={{
              padding: '14px 20px',
              borderTop: '1px solid var(--color-rule)',
              background: isToday
                ? 'rgba(122,178,201,0.12)'
                : day.critical
                ? '#C9601A10'
                : 'transparent',
              borderLeft: isToday
                ? '3px solid var(--color-glacier)'
                : day.critical
                ? '3px solid var(--color-warning)'
                : '3px solid transparent',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 17,
                  fontStyle: 'italic',
                }}
              >
                {day.date}
              </span>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {isToday && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 8,
                      color: 'var(--color-glacier)',
                      letterSpacing: '0.2em',
                      fontWeight: 600,
                    }}
                  >
                    HOY
                  </span>
                )}
                {day.critical && (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 8,
                      color: 'var(--color-warning)',
                      letterSpacing: '0.18em',
                      fontWeight: 600,
                    }}
                  >
                    !! CRÍTICO
                  </span>
                )}
              </div>
            </div>
            <div style={{ fontSize: 12, marginTop: 4, color: 'var(--color-fg)' }}>
              {day.main}
            </div>
            {day.transfer && (
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  color: 'var(--color-stone)',
                  marginTop: 4,
                }}
              >
                ↗ {day.transfer}
              </div>
            )}
            {day.note && (
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--color-warning)',
                  marginTop: 6,
                  fontStyle: 'italic',
                  lineHeight: 1.4,
                }}
              >
                ↳ {day.note}
              </div>
            )}
          </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Root island ──────────────────────────────────────────────────────────────

/**
 * ItineraryView — Preact island (client:visible).
 * Dual-view toggle (Destinos / Timeline) with localStorage persistence.
 * Desktop: 3-column grid (320px sidebar / 1fr detail / 380px days).
 */
export function ItineraryView({ destinations, days }: ItineraryViewProps) {
  const [view, setView] = useState<ViewMode>(loadView);

  useEffect(() => {
    saveView(view);
  }, [view]);

  // Empty state guard (AC-F2-15)
  if (destinations.length === 0) {
    return (
      <p
        style={{
          padding: '24px 20px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-stone)',
        }}
      >
        No hay destinos disponibles todavía.
      </p>
    );
  }

  return (
    <section aria-label="Itinerario del viaje" style={{ display: 'flex', flexDirection: 'column' as const }}>
      {/* ── Page header ──────────────────────────────────────── */}
      <div
        className="itin-header"
        style={{ padding: '16px 20px 12px' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'var(--color-stone)',
          }}
        >
          02 · ITINERARIO
        </div>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 36,
            fontWeight: 400,
            margin: '4px 0 14px',
            letterSpacing: '-0.02em',
          }}
        >
          La <span style={{ fontStyle: 'italic' }}>traza</span>.
        </h1>

        {/* Toggle — role="tablist" per NFR-A11y */}
        <div
          role="tablist"
          aria-label="Vista del itinerario"
          style={{
            display: 'inline-flex',
            border: '1px solid var(--color-fg)',
            padding: 2,
          }}
        >
          {(['destinos', 'timeline'] as const).map((id) => (
            <button
              key={id}
              role="tab"
              aria-selected={view === id}
              onClick={() => setView(id)}
              style={{
                padding: '7px 16px',
                background: view === id ? 'var(--color-fg)' : 'transparent',
                color: view === id ? 'var(--color-paper)' : 'var(--color-fg)',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'var(--font-mono)',
                fontSize: 10,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
              }}
            >
              {id === 'destinos' ? 'Destinos' : 'Timeline'}
            </button>
          ))}
        </div>
      </div>

      {/* ── Mobile/tablet views (hidden at desktop via CSS) ── */}
      <div className="itin-mobile">
        {view === 'destinos' ? (
          <DestinosView destinations={destinations} days={days} />
        ) : (
          <TimelineView destinations={destinations} days={days} />
        )}
      </div>

      {/* ── Desktop 3-col view (hidden below desktop via CSS) ── */}
      <div className="itin-desktop">
        <DesktopView destinations={destinations} days={days} />
      </div>
    </section>
  );
}
