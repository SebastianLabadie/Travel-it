import { CATEGORY_LABELS, CATEGORY_ICONS } from './constants';

interface CategoryHeaderProps {
  category: string;
  count: number;
}

/** Category section header with border-top and item count per DESIGN.md §5.13 */
export function CategoryHeader({ category, count }: CategoryHeaderProps) {
  const label = CATEGORY_LABELS[category] ?? category;
  const icon = CATEGORY_ICONS[category] ?? '';

  return (
    <div
      style={{
        borderTop: '1px solid var(--color-fg)',
        padding: '18px 0 6px',
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: 'var(--color-fg)',
          display: 'flex',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <span style={{ fontSize: 11 }}>{icon}</span>
        <span>{label}</span>
      </div>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'var(--color-stone)',
        }}
      >
        {count}
      </div>
    </div>
  );
}
