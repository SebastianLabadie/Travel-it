import type { MemberId } from '../../lib/types';

interface OwnerChipProps {
  owner: MemberId;
  prefix?: string;
}

/** Small mono chip naming the team member responsible for a booking. */
export function OwnerChip({ owner, prefix }: OwnerChipProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        padding: '2px 6px',
        border: '1px solid var(--color-rule)',
        color: 'var(--color-fg)',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        lineHeight: 1.2,
        whiteSpace: 'nowrap',
      }}
    >
      {prefix && <span style={{ color: 'var(--color-stone)' }}>{prefix}</span>}
      {owner}
    </span>
  );
}
