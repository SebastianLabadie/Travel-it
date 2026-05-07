import type { StatusKey } from './constants';
import { STATUS_DEFS } from './constants';

interface StatusBadgeProps {
  status: StatusKey;
}

/** Status badge — 3 variants per DESIGN.md §5.12 */
export function StatusBadge({ status }: StatusBadgeProps) {
  const def = STATUS_DEFS[status];
  if (!def) return null;

  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '3px 8px',
        border: `1px solid ${def.borderColor}`,
        color: def.textColor,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        lineHeight: 1,
      }}
    >
      {def.prefix ? <span>{def.prefix}</span> : null}
      {def.label}
    </span>
  );
}
