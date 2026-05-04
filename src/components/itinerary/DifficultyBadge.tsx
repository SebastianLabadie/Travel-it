import type { Difficulty } from '../../lib/types';

interface DifficultyBadgeProps {
  difficulty: Difficulty;
}

/** Activity difficulty badge — 3 variants per DESIGN.md §5.6 */
export function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 9,
        letterSpacing: '0.1em',
        textTransform: 'uppercase' as const,
        padding: '3px 8px',
        border: `1px solid ${
          difficulty === 'hard'
            ? 'var(--color-warning)'
            : difficulty === 'medium'
              ? 'var(--color-moss)'
              : 'var(--color-rule)'
        }`,
        color:
          difficulty === 'hard'
            ? 'var(--color-warning)'
            : difficulty === 'medium'
              ? 'var(--color-moss)'
              : 'var(--color-stone)',
      }}
    >
      {difficulty}
    </span>
  );
}
