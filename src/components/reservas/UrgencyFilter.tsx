import { URGENCY_ORDER, URGENCY_DEFS } from './constants';

interface UrgencyFilterProps {
  counts: Record<string, number>;
  active: string | null;
  onChange: (urgency: string | null) => void;
}

/** Chip filter row with counts per urgency per DESIGN.md §Filtro chip mono */
export function UrgencyFilter({ counts, active, onChange }: UrgencyFilterProps) {
  return (
    <div
      style={{
        display: 'flex',
        gap: 6,
        flexWrap: 'wrap',
        padding: '12px 0',
      }}
    >
      {/* All chip */}
      <button
        onClick={() => onChange(null)}
        aria-pressed={active === null}
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          padding: '5px 10px',
          background: active === null ? 'var(--color-fg)' : 'transparent',
          color: active === null ? 'var(--color-paper)' : 'var(--color-fg)',
          border: '1px solid var(--color-rule)',
          cursor: 'pointer',
          lineHeight: 1,
        }}
      >
        TODOS{' '}
        <span style={{ opacity: 0.7 }}>
          ({Object.values(counts).reduce((a, b) => a + b, 0)})
        </span>
      </button>

      {URGENCY_ORDER.map((key) => {
        const def = URGENCY_DEFS[key];
        const count = counts[key] ?? 0;
        const isActive = active === key;
        return (
          <button
            key={key}
            onClick={() => onChange(isActive ? null : key)}
            aria-pressed={isActive}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              padding: '5px 10px',
              background: isActive ? 'var(--color-fg)' : 'transparent',
              color: isActive ? 'var(--color-paper)' : def.textColor,
              border: `1px solid ${isActive ? 'var(--color-fg)' : def.borderColor}`,
              cursor: 'pointer',
              lineHeight: 1,
            }}
          >
            {def.label}{' '}
            <span style={{ opacity: 0.7 }}>({count})</span>
          </button>
        );
      })}
    </div>
  );
}
