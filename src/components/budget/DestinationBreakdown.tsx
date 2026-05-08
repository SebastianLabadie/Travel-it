import type { Destination } from '../../lib/types';
import { fmt, fmtRange } from '../../lib/budget';

interface DestinationBreakdownProps {
  destinations: Destination[];
  pax: number;
  layout: 'stacked' | 'side-by-side';
}

/** Accommodation breakdown per destination with ranking badges */
export function DestinationBreakdown({
  destinations,
  pax,
  layout,
}: DestinationBreakdownProps) {
  const isStacked = layout === 'stacked';

  const dests = destinations
    .filter((d) => d.nights > 0 && d.stay.range)
    .map((d) => {
      const perPerson: [number, number] = [
        d.stay.range![0] * d.nights,
        d.stay.range![1] * d.nights,
      ];
      const group: [number, number] = [
        perPerson[0] * pax,
        perPerson[1] * pax,
      ];
      const mid = (perPerson[0] + perPerson[1]) / 2;
      return { ...d, perPerson, group, mid };
    })
    .sort((a, b) => a.order - b.order);

  const mids = dests.map((d) => d.mid);
  const sumMids = mids.reduce((a, b) => a + b, 0);

  let highestIdx = -1;
  let lowestIdx = -1;
  if (dests.length > 1) {
    let highest = -Infinity;
    let lowest = Infinity;
    dests.forEach((d, i) => {
      if (d.mid > highest) {
        highest = d.mid;
        highestIdx = i;
      }
      if (d.mid < lowest) {
        lowest = d.mid;
        lowestIdx = i;
      }
    });
  }

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
        Alojamiento por destino
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 0,
        }}
      >
        {dests.map((d, i) => {
          const pct = sumMids > 0 ? (d.mid / sumMids) * 100 : 0;
          const isHighest = i === highestIdx;
          const isLowest = i === lowestIdx;

          return (
            <div
              key={d.slug}
              style={{
                padding: isStacked ? '10px 0' : '12px 0',
                borderBottom: '1px solid var(--color-rule)',
                background: isHighest
                  ? 'rgba(201, 96, 26, 0.06)'
                  : isLowest
                    ? 'rgba(90, 116, 88, 0.06)'
                    : 'transparent',
              }}
            >
              {/* Main row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: isStacked
                    ? '1fr auto'
                    : '32px 1fr 130px 140px 100px',
                  gap: isStacked ? 8 : 12,
                  alignItems: 'center',
                }}
              >
                {/* Order (desktop only) */}
                {!isStacked && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: 10,
                      color: 'var(--color-stone)',
                    }}
                  >
                    {String(d.order).padStart(2, '0')}
                  </div>
                )}

                {/* Name + badges */}
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
                      color: 'var(--color-fg)',
                    }}
                  >
                    {d.name}
                  </div>
                  {isHighest && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        color: 'var(--color-warning)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      !! MÁS CARO
                    </span>
                  )}
                  {isLowest && (
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 9,
                        color: 'var(--color-moss)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                      }}
                    >
                      ↓ MÁS BARATO
                    </span>
                  )}
                </div>

                {/* Nights */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: 10,
                    color: 'var(--color-stone)',
                    textAlign: isStacked ? 'right' : 'left',
                  }}
                >
                  {d.nights} noches
                </div>

                {/* Per-person */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: isStacked ? 11 : 12,
                    color: 'var(--color-fg)',
                    textAlign: 'right',
                  }}
                >
                  {fmtRange(d.perPerson)}
                </div>

                {/* Group total */}
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: isStacked ? 10 : 11,
                    color: 'var(--color-stone)',
                    textAlign: 'right',
                  }}
                >
                  {fmtRange(d.group)}
                </div>
              </div>

              {/* Mini bar */}
              <div
                style={{
                  marginTop: 6,
                  height: 3,
                  background: 'var(--color-rule)',
                  borderRadius: 2,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: `${pct}%`,
                    background: 'var(--color-fg)',
                    transition: 'width 0.3s',
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
