import type { TeamMember } from '../../lib/types';
import { formatTargetDate } from './constants';

interface MemberCardProps {
  member: TeamMember;
}

const eyebrow = {
  fontFamily: 'var(--font-mono)',
  fontSize: 9,
  letterSpacing: '0.18em',
  textTransform: 'uppercase' as const,
  color: 'var(--color-stone)',
};

function Block({ label, children }: { label: string; children: preact.ComponentChildren }) {
  return (
    <div style={{ borderTop: '1px solid var(--color-rule)', paddingTop: 12, marginTop: 14 }}>
      <div style={eyebrow}>{label}</div>
      {children}
    </div>
  );
}

function PlainList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
      {items.map((it) => (
        <li
          key={it}
          style={{
            display: 'flex',
            gap: 8,
            padding: '5px 0',
            borderBottom: '1px dashed var(--color-rule)',
            fontSize: 12,
            lineHeight: 1.45,
            color: 'var(--color-fg)',
          }}
        >
          <span aria-hidden="true" style={{ color: 'var(--color-stone)', flexShrink: 0 }}>↳</span>
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** Static, checklist-styled list (DESIGN.md §5.7 look, no interaction). */
function CheckList({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', margin: '8px 0 0', padding: 0 }}>
      {items.map((it) => (
        <li
          key={it}
          style={{
            display: 'flex',
            gap: 10,
            alignItems: 'flex-start',
            padding: '6px 0',
            borderBottom: '1px dashed var(--color-rule)',
            fontSize: 12,
            lineHeight: 1.45,
            color: 'var(--color-fg)',
          }}
        >
          <span
            aria-hidden="true"
            style={{
              width: 14,
              height: 14,
              border: '1.5px solid var(--color-fg)',
              flexShrink: 0,
              marginTop: 2,
            }}
          />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

/** One zone owner: name, zone, lodging brief, activities and food to shortlist. */
export function MemberCard({ member }: MemberCardProps) {
  const { zone, lodging } = member;
  return (
    <article
      aria-labelledby={`tm-${member.id}`}
      style={{
        background: 'var(--color-paper)',
        border: '1px solid var(--color-rule)',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={eyebrow}>
        {String(member.order).padStart(2, '0')} · RESPONSABLE
      </div>
      <h2
        id={`tm-${member.id}`}
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 38,
          fontStyle: 'italic',
          fontWeight: 400,
          letterSpacing: '-0.02em',
          lineHeight: 1,
          margin: '4px 0 8px',
          color: 'var(--color-fg)',
        }}
      >
        {member.name}
      </h2>
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 17,
          fontStyle: 'italic',
          color: 'var(--color-fg)',
          lineHeight: 1.2,
        }}
      >
        {zone.label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.1em',
          color: 'var(--color-stone)',
          marginTop: 4,
          textTransform: 'uppercase',
        }}
      >
        {zone.dates} · {zone.nights} {zone.nights === 1 ? 'noche' : 'noches'}
        {member.notes ? ` · ${member.notes}` : ''}
      </div>

      <Block label="Alojamiento">
        <p style={{ margin: '8px 0 0', fontSize: 13, lineHeight: 1.5, color: 'var(--color-fg)' }}>
          {lodging.brief}
        </p>
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 11,
            color: 'var(--color-fg)',
            marginTop: 6,
          }}
        >
          <span style={{ color: 'var(--color-stone)' }}>Presupuesto:</span> {lodging.budget}
        </div>
        <PlainList items={lodging.requirements} />
      </Block>

      <Block label="Actividades">
        <CheckList items={member.activities} />
      </Block>

      <Block label="Comer">
        <PlainList items={member.food} />
      </Block>

      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
          borderTop: '1px solid var(--color-fg)',
          paddingTop: 12,
          marginTop: 'auto',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.1em',
            color: 'var(--color-fg)',
          }}
        >
          <span style={{ color: 'var(--color-stone)' }}>Fecha objetivo:</span>{' '}
          <time dateTime={member.deadline}>{formatTargetDate(member.deadline)}</time>
        </span>
        <a
          href="/reservas"
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--color-fg)',
            textDecoration: 'none',
            borderBottom: '1px solid var(--color-fg)',
            paddingBottom: 1,
          }}
        >
          Ver reservas de esta zona <span style={{ color: 'var(--color-stone)' }}>↗</span>
        </a>
      </div>
    </article>
  );
}
