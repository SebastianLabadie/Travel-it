import type { Booking, TeamMember } from '../../lib/types';
import { MemberCard } from './MemberCard';
import { MEMBER_LABEL, computeOwnerProgress, unassignedBookings } from './constants';

interface TeamViewProps {
  team: TeamMember[];
  bookings: Booking[];
}

/** Compact per-member progress row: n reservado/pagado of total bookings owned. */
function ProgressRow({ team, bookings }: TeamViewProps) {
  const rows = computeOwnerProgress(team, bookings);
  const unassigned = unassignedBookings(bookings);

  return (
    <section aria-labelledby="tm-progress" className="tm-progress">
      <h2
        id="tm-progress"
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          fontWeight: 400,
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--color-stone)',
          margin: '0 0 8px',
        }}
      >
        Avance de reservas por responsable
      </h2>
      <ul className="tm-progress-grid" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {rows.map(({ member, total, done, paid }) => {
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          return (
            <li key={member.id} style={{ borderTop: '1px solid var(--color-rule)', padding: '10px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 8 }}>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    letterSpacing: '0.14em',
                    color: 'var(--color-fg)',
                  }}
                >
                  {MEMBER_LABEL[member.id]}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 20,
                    fontStyle: 'italic',
                    lineHeight: 1,
                    color: 'var(--color-fg)',
                  }}
                >
                  {done}
                  <span style={{ fontSize: 12, color: 'var(--color-stone)' }}>/{total}</span>
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={total}
                aria-valuenow={done}
                aria-label={`${MEMBER_LABEL[member.id]}: ${done} de ${total} reservas resueltas`}
                style={{ height: 4, background: 'var(--color-rule)', marginTop: 8, position: 'relative' }}
              >
                <div
                  style={{
                    position: 'absolute',
                    inset: '0 auto 0 0',
                    width: `${pct}%`,
                    background: 'var(--color-moss)',
                  }}
                />
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 9,
                  letterSpacing: '0.08em',
                  color: 'var(--color-stone)',
                  marginTop: 6,
                }}
              >
                {done} reservado/pagado · {paid} pagado · {total - done} pendiente
              </div>
            </li>
          );
        })}
      </ul>
      {unassigned.length > 0 && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 9,
            letterSpacing: '0.06em',
            color: 'var(--color-stone)',
            margin: '10px 0 0',
          }}
        >
          Sin responsable ({unassigned.length}): {unassigned.map((b) => b.title).join(' · ')}
        </p>
      )}
    </section>
  );
}

/**
 * TeamView — rendered statically (no client directive): the page has no
 * interactive state, so shipping JS for it would be waste.
 */
export function TeamView({ team, bookings }: TeamViewProps) {
  if (team.length === 0) {
    return (
      <p
        style={{
          padding: '24px 20px',
          fontFamily: 'var(--font-mono)',
          fontSize: 11,
          color: 'var(--color-stone)',
        }}
      >
        Todavía no hay responsables asignados.
      </p>
    );
  }

  return (
    <section aria-label="Responsables por zona">
      <div className="tm-header">
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.18em',
            color: 'var(--color-stone)',
          }}
        >
          07 · EQUIPO
        </div>
        <h1
          className="tm-title"
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 400,
            margin: '4px 0 6px',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          Quién busca <span style={{ fontStyle: 'italic' }}>qué</span>.
        </h1>
        <p style={{ margin: 0, fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg)', maxWidth: 560 }}>
          Cada zona tiene un responsable de alojamiento, actividades y restaurantes. Propone
          opciones, el grupo decide.
        </p>
        <p
          style={{
            margin: '8px 0 0',
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.04em',
            color: 'var(--color-stone)',
          }}
        >
          Asignación inicial editable en <code>src/content/team/</code>.
        </p>
      </div>

      <div className="tm-grid">
        {team.map((m) => (
          <MemberCard key={m.id} member={m} />
        ))}
      </div>

      <ProgressRow team={team} bookings={bookings} />
    </section>
  );
}
