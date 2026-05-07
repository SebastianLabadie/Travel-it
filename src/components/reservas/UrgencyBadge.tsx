import type { UrgencyKey } from './constants';
import { URGENCY_DEFS } from './constants';

interface UrgencyBadgeProps {
  urgency: UrgencyKey;
}

/** Urgency badge — 4 variants per DESIGN.md §5.11 */
export function UrgencyBadge({ urgency }: UrgencyBadgeProps) {
  const def = URGENCY_DEFS[urgency];
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
        background: def.bgColor ?? 'transparent',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        lineHeight: 1,
      }}
    >
      {def.label}
    </span>
  );
}
