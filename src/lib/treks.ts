/**
 * treks.ts
 * Trek track data — synthetic GPS tracks for the three main hikes.
 * Coordinates are approximated from known trailheads and destinations.
 */

export interface Trek {
  id: string;
  name: string;
  sub: string;
  distance: string;
  ascent: string;
  hours: string;
  difficulty: 'easy' | 'medium' | 'hard';
  day: string;
  start: [number, number];
  end: [number, number];
  path: [number, number][];
}

/**
 * Generate intermediate waypoints with slight jitter for a realistic GPS look.
 */
function jitter(path: [number, number][], n: number, mag = 0.0035): [number, number][] {
  const out: [number, number][] = [];
  for (let i = 0; i < path.length - 1; i++) {
    const a = path[i]!;
    const b = path[i + 1]!;
    out.push(a);
    for (let j = 1; j < n; j++) {
      const t = j / n;
      const lat = a[0] + (b[0] - a[0]) * t + (Math.sin(j * 1.7 + i) * mag);
      const lng = a[1] + (b[1] - a[1]) * t + (Math.cos(j * 2.1 + i) * mag);
      out.push([lat, lng]);
    }
  }
  out.push(path[path.length - 1]!);
  return out;
}

export const TREKS: Trek[] = [
  {
    id: 'fitz-roy',
    name: 'Laguna de los Tres',
    sub: 'Fitz Roy · El Chaltén',
    distance: '20.6 km',
    ascent: '+820 m',
    hours: '9–10 h',
    difficulty: 'hard',
    day: 'día 06 · 26 nov',
    start: [-49.3315, -72.8868],
    end: [-49.2710, -72.9510],
    path: jitter(
      [
        [-49.3315, -72.8868],
        [-49.3185, -72.9050],
        [-49.3015, -72.9210],
        [-49.2880, -72.9320],
        [-49.2785, -72.9410],
        [-49.2710, -72.9510],
      ],
      6,
      0.004
    ),
  },
  {
    id: 'base-torres',
    name: 'Base de las Torres',
    sub: 'Torres del Paine',
    distance: '19.2 km',
    ascent: '+760 m',
    hours: '8–9 h',
    difficulty: 'hard',
    day: 'día 10 · 30 nov',
    start: [-50.9423, -72.9888],
    end: [-50.9230, -73.0470],
    path: jitter(
      [
        [-50.9423, -72.9888],
        [-50.9355, -73.0080],
        [-50.9300, -73.0245],
        [-50.9270, -73.0360],
        [-50.9230, -73.0470],
      ],
      7,
      0.0028
    ),
  },
  {
    id: 'esmeralda',
    name: 'Laguna Esmeralda',
    sub: 'Tierra del Fuego · Ushuaia',
    distance: '10.4 km',
    ascent: '+280 m',
    hours: '4–5 h',
    difficulty: 'medium',
    day: 'día 16 · 06 dic',
    start: [-54.7290, -67.9320],
    end: [-54.6620, -67.8350],
    path: jitter(
      [
        [-54.7290, -67.9320],
        [-54.7100, -67.9050],
        [-54.6950, -67.8810],
        [-54.6800, -67.8590],
        [-54.6700, -67.8430],
        [-54.6620, -67.8350],
      ],
      7,
      0.003
    ),
  },
];
