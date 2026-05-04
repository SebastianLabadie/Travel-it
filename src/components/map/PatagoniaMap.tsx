/**
 * PatagoniaMap.tsx
 * Preact island — Leaflet 1.9.4 map of the Patagonia 2026 route.
 *
 * Hydration: client:only="preact" (Leaflet is DOM-imperative; no SSR)
 * Tile provider: CARTO Voyager (no token)
 * Fallback tile: https://tile.openstreetmap.org/{z}/{x}/{y}.png (swap single line)
 *
 * Props:
 *   destinations — ordered array of Destination from content collections
 *   routes       — Route[] from content collections
 *   height       — px height of the map container (default 360)
 *   autoplay     — play animation on mount (default true)
 *   staticMode   — skip animation, disable drag/tap (default false)
 *   showCriticalNote — render field note at Ushuaia (default true)
 */

import { useEffect, useRef, useState } from 'preact/hooks';
import type { Destination, Route } from '../../lib/types';
import { PIN_CSS, pinHtml, popupHtml, FIELD_NOTE_HTML } from './pin-styles';
import 'leaflet/dist/leaflet.css';

// ── Types ────────────────────────────────────────────────────────────────────

export type PatagoniaMapProps = {
  destinations: Destination[];
  routes: Route[];
  height?: number;
  autoplay?: boolean;
  staticMode?: boolean;
  showCriticalNote?: boolean;
};

// ── Helpers ──────────────────────────────────────────────────────────────────

const wait = (ms: number): Promise<void> =>
  new Promise((res) => setTimeout(res, ms));

// ── Component ────────────────────────────────────────────────────────────────

export default function PatagoniaMap({
  destinations,
  routes,
  height = 360,
  autoplay = true,
  staticMode = false,
  showCriticalNote = true,
}: PatagoniaMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // animKey increment triggers effect re-run (replay)
  const [animKey, setAnimKey] = useState(0);
  const [step, setStep] = useState<number>(staticMode ? destinations.length - 1 : -1);

  useEffect(() => {
    if (!containerRef.current) return;

    let cancelled = false;

    // Dynamic import keeps Leaflet out of the SSG critical path
    let L: typeof import('leaflet');

    async function init() {
      L = await import('leaflet');
      if (cancelled || !containerRef.current) return;

      // `tap` is a valid Leaflet option not reflected in @types/leaflet 1.9.x
      const map = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        dragging: !staticMode,
        keyboard: true,
      } as import('leaflet').MapOptions);

      // Bbox: Montevideo (~-34°S) hasta Cabo de Hornos
      map.fitBounds(
        [[-55.2, -76], [-34, -55]],
        { padding: [12, 12] }
      );

      // CARTO Voyager tiles — AC-F1-01
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        { subdomains: 'abcd', maxZoom: 12, minZoom: 4 }
      ).addTo(map);

      // Track all layers for cleanup
      const markerLayers: import('leaflet').Marker[] = [];
      const lineLayers: import('leaflet').Polyline[] = [];
      let noteLayer: import('leaflet').Marker | null = null;

      // ── Build markers ──────────────────────────────────────────────────────

      function makeMarker(dest: Destination, idx: number): import('leaflet').Marker {
        const isCrit = dest.slug === 'ushuaia';
        const html = pinHtml(idx + 1, dest.name, isCrit);
        const icon = L.divIcon({
          html,
          className: 'ptg-divicon',
          iconSize: [120, 44],
          iconAnchor: [12, 22],
        });
        // coords is [lon, lat]; Leaflet expects [lat, lon]
        const m = L.marker([dest.coords[1], dest.coords[0]], {
          icon,
          opacity: staticMode ? 1 : 0,
        });
        // Popup per AC-F1-04 — name, date range, nights, itinerary link
        const popupContent = popupHtml(dest.name, dest.startDate, dest.endDate, dest.nights, dest.slug);
        m.bindPopup(popupContent, { className: 'ptg-popup', closeButton: false });
        return m;
      }

      // ── Fade-in helper ────────────────────────────────────────────────────

      function fadeIn(marker: import('leaflet').Marker, durationMs: number): Promise<void> {
        const el = marker.getElement();
        if (!el) return wait(durationMs);
        el.style.opacity = '0';
        el.style.transition = `opacity ${durationMs}ms ease-out`;
        // force reflow so the transition fires
        void el.offsetWidth;
        el.style.opacity = '1';
        marker.setOpacity(1);
        return wait(durationMs);
      }

      // ── rAF polyline animation ────────────────────────────────────────────

      function animatePolyline(
        latlngs: [number, number][],
        opts: import('leaflet').PolylineOptions,
        durationMs: number
      ): Promise<void> {
        const poly = L.polyline([latlngs[0] as [number, number]], opts).addTo(map);
        lineLayers.push(poly);

        // Pre-compute segment lengths
        let totalDist = 0;
        const segDist: number[] = [];
        for (let i = 1; i < latlngs.length; i++) {
          const prev = latlngs[i - 1];
          const curr = latlngs[i];
          if (prev === undefined || curr === undefined) continue;
          const d = map.distance(prev, curr);
          segDist.push(d);
          totalDist += d;
        }

        return new Promise((res) => {
          const start = performance.now();

          function tick(now: number) {
            if (cancelled) return res();
            const progress = Math.min(1, (now - start) / durationMs);
            const target = totalDist * progress;
            let acc = 0;
            const built: [number, number][] = [latlngs[0] as [number, number]];

            for (let i = 0; i < segDist.length; i++) {
              const seg = segDist[i];
              const a = latlngs[i];
              const b = latlngs[i + 1];
              if (seg === undefined || a === undefined || b === undefined) continue;
              if (acc + seg <= target) {
                built.push(b);
                acc += seg;
              } else {
                const r = (target - acc) / seg;
                built.push([
                  a[0] + (b[0] - a[0]) * r,
                  a[1] + (b[1] - a[1]) * r,
                ]);
                break;
              }
            }

            poly.setLatLngs(built);
            if (progress < 1) {
              requestAnimationFrame(tick);
            } else {
              res();
            }
          }

          requestAnimationFrame(tick);
        });
      }

      // ── Static mode: render everything instantly ──────────────────────────

      if (staticMode) {
        for (let i = 0; i < destinations.length; i++) {
          const dest = destinations[i];
          if (!dest) continue;
          const m = makeMarker(dest, i);
          m.addTo(map);
          markerLayers.push(m);
        }

        for (const route of routes) {
          const latlngs = route.coords.map((c): [number, number] => [c[1], c[0]]);
          const opts: import('leaflet').PolylineOptions =
            route.mode === 'plane'
              ? { color: 'var(--color-warning)', weight: 2.5, opacity: 0.95, dashArray: '6 5', lineCap: 'round' }
              : { color: 'var(--color-fg)', weight: 3, opacity: 0.9, lineCap: 'round' };
          const poly = L.polyline(latlngs, opts).addTo(map);
          lineLayers.push(poly);
        }

        if (showCriticalNote) {
          const ush = destinations.find((d) => d.slug === 'ushuaia');
          if (ush) {
            const noteIcon = L.divIcon({
              html: FIELD_NOTE_HTML,
              className: 'ptg-divicon',
              iconSize: [200, 90],
              iconAnchor: [-12, 90],
            });
            noteLayer = L.marker([ush.coords[1], ush.coords[0]], {
              icon: noteIcon,
              interactive: false,
            }).addTo(map);
          }
        }

        // cleanup and return early
        return () => {
          cancelled = true;
          markerLayers.forEach((m) => map.removeLayer(m));
          lineLayers.forEach((l) => map.removeLayer(l));
          if (noteLayer) map.removeLayer(noteLayer);
          map.remove();
        };
      }

      // ── Animated mode ─────────────────────────────────────────────────────

      // Place all markers first (opacity 0) so Leaflet creates the DOM elements
      for (let i = 0; i < destinations.length; i++) {
        const dest = destinations[i];
        if (!dest) continue;
        const m = makeMarker(dest, i);
        m.addTo(map);
        markerLayers.push(m);
      }

      // Check reduced-motion preference
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      async function run() {
        if (!autoplay) {
          // If autoplay is off, show everything immediately
          for (let i = 0; i < markerLayers.length; i++) {
            const m = markerLayers[i];
            if (m) m.setOpacity(1);
          }
          for (const route of routes) {
            const latlngs = route.coords.map((c): [number, number] => [c[1], c[0]]);
            const opts: import('leaflet').PolylineOptions =
              route.mode === 'plane'
                ? { color: 'var(--color-warning)', weight: 2.5, dashArray: '6 5', lineCap: 'round' }
                : { color: 'var(--color-fg)', weight: 3, lineCap: 'round' };
            const poly = L.polyline(latlngs, opts).addTo(map);
            lineLayers.push(poly);
          }
          return;
        }

        for (let i = 0; i < destinations.length; i++) {
          if (cancelled) return;
          const dest = destinations[i];
          const marker = markerLayers[i];
          if (!dest || !marker) continue;

          if (reducedMotion) {
            marker.setOpacity(1);
          } else {
            await fadeIn(marker, 280);
          }
          setStep(i);

          // Field note appears when Ushuaia is revealed
          if (showCriticalNote && dest.slug === 'ushuaia') {
            const noteIcon = L.divIcon({
              html: FIELD_NOTE_HTML,
              className: 'ptg-divicon',
              iconSize: [200, 90],
              iconAnchor: [-12, 90],
            });
            const note = L.marker([dest.coords[1], dest.coords[0]], {
              icon: noteIcon,
              opacity: 0,
              interactive: false,
            }).addTo(map);
            noteLayer = note;

            if (!reducedMotion) {
              await wait(50);
              await fadeIn(note, 380);
            } else {
              note.setOpacity(1);
            }
          }

          // Draw the route leading out of this destination
          if (i < destinations.length - 1) {
            const route = routes.find((r) => r.from === dest.slug);
            if (route) {
              const latlngs = route.coords.map((c): [number, number] => [c[1], c[0]]);
              const opts: import('leaflet').PolylineOptions =
                route.mode === 'plane'
                  ? { color: 'var(--color-warning)', weight: 2.5, opacity: 0.95, dashArray: '6 5', lineCap: 'round' }
                  : { color: 'var(--color-fg)', weight: 3, opacity: 0.9, lineCap: 'round' };

              if (reducedMotion) {
                const poly = L.polyline(latlngs, opts).addTo(map);
                lineLayers.push(poly);
              } else {
                await animatePolyline(latlngs, opts, 850);
              }
            }
          }
        }
      }

      run();

      return () => {
        cancelled = true;
        markerLayers.forEach((m) => map.removeLayer(m));
        lineLayers.forEach((l) => map.removeLayer(l));
        if (noteLayer) map.removeLayer(noteLayer);
        map.remove();
      };
    }

    // We need to hold a reference to the cleanup returned by init()
    let cleanupFn: (() => void) | undefined;
    init().then((fn) => {
      if (fn) cleanupFn = fn;
    });

    return () => {
      cancelled = true;
      if (cleanupFn) cleanupFn();
    };
  }, [animKey]); // eslint-disable-line react-hooks/exhaustive-deps

  const totalStops = destinations.length;
  const stepLabel =
    step < 0
      ? `Etapa 00 / ${String(totalStops).padStart(2, '0')}`
      : `Etapa ${String(step + 1).padStart(2, '0')} / ${String(totalStops).padStart(2, '0')}`;

  return (
    <section
      aria-label="Mapa del recorrido por la Patagonia"
      style={{ position: 'relative', width: '100%', height }}
    >
      {/* Inject scoped CSS for Leaflet divIcons */}
      <style dangerouslySetInnerHTML={{ __html: PIN_CSS }} />

      {/* Leaflet mount point */}
      <div
        ref={containerRef}
        style={{ position: 'absolute', inset: 0 }}
        role="img"
        aria-label="Mapa interactivo con las 6 bases de la ruta patagónica"
      />

      {/* Screen-reader fallback list of destinations */}
      <ul
        aria-label="Lista de destinos (versión texto del mapa)"
        style={{
          position: 'absolute',
          width: 1,
          height: 1,
          overflow: 'hidden',
          clip: 'rect(0 0 0 0)',
          whiteSpace: 'nowrap',
        }}
      >
        {destinations.map((d, i) => (
          <li key={d.slug}>
            {String(i + 1).padStart(2, '0')}. {d.name} ({d.country}) — {d.startDate} al {d.endDate}, {d.nights} noches
          </li>
        ))}
      </ul>

      {/* Map chrome: only shown in animated mode */}
      {!staticMode && (
        <>
          {/* Step indicator — bottom left */}
          <div
            aria-live="polite"
            aria-atomic="true"
            style={{
              position: 'absolute',
              left: 10,
              bottom: 10,
              zIndex: 500,
              background: 'var(--color-paper)',
              border: '1px solid var(--color-fg)',
              padding: '6px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              color: 'var(--color-fg)',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              pointerEvents: 'none',
            }}
          >
            {stepLabel}
          </div>

          {/* Compass rose — decorative, bottom-right above replay */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              right: 10,
              bottom: 46,
              zIndex: 500,
              width: 28,
              height: 28,
              pointerEvents: 'none',
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* N pointer */}
              <polygon
                points="14,2 11,14 14,11 17,14"
                fill="var(--color-fg)"
              />
              {/* S pointer */}
              <polygon
                points="14,26 11,14 14,17 17,14"
                fill="var(--color-stone)"
              />
              {/* Center dot */}
              <circle cx="14" cy="14" r="2" fill="var(--color-fg)" />
              {/* N label */}
              <text
                x="14"
                y="1"
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize="5"
                fill="var(--color-fg)"
                fontWeight="600"
              >N</text>
            </svg>
          </div>

          {/* Replay button — bottom right */}
          <button
            type="button"
            onClick={() => {
              setStep(-1);
              setAnimKey((k) => k + 1);
            }}
            style={{
              position: 'absolute',
              right: 10,
              bottom: 10,
              zIndex: 500,
              background: 'var(--color-paper)',
              border: '1px solid var(--color-fg)',
              padding: '6px 10px',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: 9,
              letterSpacing: '0.16em',
              color: 'var(--color-fg)',
              textTransform: 'uppercase',
            }}
          >
            &#8635; REPLAY
          </button>
        </>
      )}
    </section>
  );
}
