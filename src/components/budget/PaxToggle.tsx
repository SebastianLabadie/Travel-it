interface PaxToggleProps {
  pax: number;
  onChange: (pax: number) => void;
}

/** Segmented 5/6 pax toggle with aria-pressed accessibility */
export function PaxToggle({ pax, onChange }: PaxToggleProps) {
  return (
    <div
      role="group"
      aria-label="Cantidad de pasajeros"
      style={{
        display: 'inline-flex',
        gap: 0,
        borderRadius: 4,
        border: '1px solid var(--color-rule)',
        overflow: 'hidden',
      }}
    >
      {[5, 6].map((n) => {
        const active = pax === n;
        return (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            aria-pressed={active}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              border: 'none',
              borderRight: n === 5 ? '1px solid var(--color-rule)' : 'none',
              background: active ? 'var(--color-fg)' : 'transparent',
              color: active ? 'var(--color-paper)' : 'var(--color-fg)',
              cursor: 'pointer',
              transition: 'background 0.15s, color 0.15s',
            }}
          >
            {n} PAX
          </button>
        );
      })}
    </div>
  );
}
