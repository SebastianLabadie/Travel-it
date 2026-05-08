import type { BudgetItem } from '../../lib/types';
import { fmt, fmtRange } from '../../lib/budget';

interface LineItemsSectionProps {
  items: BudgetItem[];
  pax: number;
  title: string;
  layout: 'stacked' | 'side-by-side';
}

/** Generic line-item list with placeholder, free and critical handling */
export function LineItemsSection({
  items,
  pax,
  title,
  layout,
}: LineItemsSectionProps) {
  const isStacked = layout === 'stacked';

  return (
    <div style={{ marginTop: isStacked ? 28 : 36 }}>
      <div
        style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          letterSpacing: '0.18em',
          color: 'var(--color-stone)',
          textTransform: 'uppercase',
          marginBottom: isStacked ? 12 : 16,
        }}
      >
        {title}
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {items.map((item) => {
          const isPlaceholder = item.range === null;
          const isFree = item.free;

          const perPerson: [number, number] | null =
            isPlaceholder || isFree
              ? null
              : [
                  item.range[0] / (item.perPerson ? 1 : pax),
                  item.range[1] / (item.perPerson ? 1 : pax),
                ];

          const group: [number, number] | null =
            isPlaceholder || isFree ? null : item.range;

          return (
            <div
              key={item.id}
              style={{
                display: 'grid',
                gridTemplateColumns: isStacked
                  ? '1fr auto'
                  : '1fr 110px 130px 130px',
                gap: isStacked ? 8 : 12,
                alignItems: 'center',
                padding: isStacked ? '10px 0' : '12px 0',
                borderBottom: '1px solid var(--color-rule)',
              }}
            >
              {/* Label + meta */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: isStacked ? 13 : 14,
                      fontWeight: 500,
                      color: item.critical
                        ? 'var(--color-warning)'
                        : 'var(--color-fg)',
                    }}
                  >
                    {item.label}
                  </div>
                  {item.critical && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        color: 'var(--color-warning)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      !! CRÍTICO
                    </span>
                  )}
                  {isFree && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        color: 'var(--color-moss)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      GRATIS
                    </span>
                  )}
                </div>
                {item.date && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--color-stone)',
                      marginTop: 2,
                    }}
                  >
                    {item.date}
                  </div>
                )}
              </div>

              {/* Per-person */}
              <div style={{ textAlign: 'right' }}>
                {isPlaceholder ? (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--color-stone)',
                    }}
                  >
                    — · pendiente confirmar
                  </span>
                ) : isFree ? (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 11,
                      color: 'var(--color-moss)',
                    }}
                  >
                    —
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: isStacked ? 11 : 12,
                      color: 'var(--color-fg)',
                    }}
                  >
                    {fmtRange(perPerson!)}
                  </span>
                )}
              </div>

              {/* Group total (desktop) */}
              {!isStacked && (
                <div style={{ textAlign: 'right' }}>
                  {isPlaceholder ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 10,
                        color: 'var(--color-stone)',
                      }}
                    >
                      — · pendiente confirmar
                    </span>
                  ) : isFree ? (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--color-moss)',
                      }}
                    >
                      —
                    </span>
                  ) : (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 11,
                        color: 'var(--color-stone)',
                      }}
                    >
                      {fmtRange(group!)}
                    </span>
                  )}
                </div>
              )}

              {/* Scope label (desktop) */}
              {!isStacked && (
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 9,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--color-stone)',
                    textAlign: 'right',
                  }}
                >
                  {item.perPerson ? 'por persona' : 'grupo'}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
