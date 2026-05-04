/**
 * pin-styles.ts
 * HTML strings and CSS class names for PatagoniaMap Leaflet divIcons.
 * All color tokens reference CSS custom properties; literals are only used
 * inside the injected <style> block where CSS vars are already resolved by
 * the browser — Leaflet adds divIcon HTML to the DOM after mount so the
 * vars are available at the correct cascade scope.
 *
 * Token hex values are ONLY used in keyframes / rgba where CSS vars cannot
 * be used (e.g. rgba() for the pulse animation).
 */

export const PIN_CSS = `
  .leaflet-container {
    background: var(--color-bg);
    font-family: var(--font-body);
  }

  /* Leaflet reset: remove default white box and border from divIcon wrapper */
  .ptg-divicon {
    background: transparent !important;
    border: none !important;
  }

  /* Pin row: circle + label side by side */
  .ptg-pin {
    display: flex;
    align-items: center;
    gap: 6px;
    transform: translate(-12px, -12px);
  }

  /* Numbered circle */
  .ptg-pin-num {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--color-paper);
    color: var(--color-fg);
    border: 1.5px solid var(--color-fg);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-mono);
    font-size: 10px;
    font-weight: 600;
    box-shadow: var(--shadow-md);
    flex-shrink: 0;
  }

  /* Critical pin override (Ushuaia) */
  .ptg-pin-crit .ptg-pin-num {
    background: var(--color-warning);
    color: var(--color-paper);
    border-color: var(--color-warning);
    animation: ptgPulse 1.6s ease-out infinite;
  }

  /* Destination label card beside the pin */
  .ptg-pin-label {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 13px;
    color: var(--color-fg);
    background: var(--color-paper);
    padding: 2px 7px;
    border: 1px solid var(--color-rule);
    white-space: nowrap;
    box-shadow: var(--shadow-sm);
  }

  /* Field note (critical day) */
  .ptg-note {
    width: 200px;
    padding: 10px 12px;
    background: var(--color-paper);
    border: 1px solid var(--color-warning);
    box-shadow: var(--shadow-lg);
    transform: rotate(-2deg);
    position: relative;
  }

  /* Dashed guide line from note toward the pin */
  .ptg-note::before {
    content: '';
    position: absolute;
    left: -22px;
    top: 50%;
    width: 22px;
    height: 1px;
    border-top: 1px dashed var(--color-warning);
  }

  .ptg-note-tag {
    font-family: var(--font-mono);
    font-size: 8px;
    color: var(--color-warning);
    letter-spacing: 0.18em;
    font-weight: 600;
    text-transform: uppercase;
  }

  .ptg-note-title {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 13px;
    color: var(--color-fg);
    margin-top: 4px;
  }

  .ptg-note-body {
    font-size: 10px;
    color: var(--color-fg);
    margin-top: 4px;
    line-height: 1.4;
    font-family: var(--font-body);
  }

  .ptg-note-body span {
    color: var(--color-warning);
  }

  /* Pulse keyframe — RGBA literals required here (CSS vars can't be used in rgba()) */
  @keyframes ptgPulse {
    0%   { box-shadow: 0 0 0 0   rgba(201, 96, 26, 0.6); }
    100% { box-shadow: 0 0 0 14px rgba(201, 96, 26, 0);   }
  }

  /* Pin popup (AC-F1-04) */
  .ptg-popup .leaflet-popup-content-wrapper {
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    border-radius: 0;
    box-shadow: var(--shadow-lg);
    padding: 0;
  }

  .ptg-popup .leaflet-popup-content {
    margin: 0;
    padding: 12px 16px;
    max-width: 240px;
  }

  .ptg-popup .leaflet-popup-tip-container {
    display: none;
  }

  .ptg-popup-name {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 13px;
    color: var(--color-fg);
    display: block;
    margin-bottom: 4px;
  }

  .ptg-popup-dates {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--color-stone);
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 2px;
  }

  .ptg-popup-nights {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--color-stone);
    letter-spacing: 0.1em;
    display: block;
    margin-bottom: 8px;
  }

  .ptg-popup-link {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--color-fg);
    text-decoration: none;
    border-bottom: 1px solid var(--color-rule);
  }

  .ptg-popup-link:hover {
    border-bottom-color: var(--color-fg);
  }

  /* Reduced motion: disable all transitions and animations */
  @media (prefers-reduced-motion: reduce) {
    .ptg-pin-num,
    .ptg-pin-label,
    .ptg-note {
      transition: none !important;
      animation: none !important;
    }
  }
`;

/**
 * Build the HTML string for a pin popup (AC-F1-04).
 * All values come from Zod-validated content — no user-controlled input.
 */
export function popupHtml(
  name: string,
  startDate: string,
  endDate: string,
  nights: number,
  slug: string
): string {
  return `<span class="ptg-popup-name">${name}</span>` +
    `<span class="ptg-popup-dates">${startDate.toUpperCase()} &#8594; ${endDate.toUpperCase()}</span>` +
    `<span class="ptg-popup-nights">${nights} noches</span>` +
    `<a class="ptg-popup-link" href="/itinerario#${slug}">Ver itinerario &#8594;</a>`;
}

/** Build the HTML string for a normal or critical pin divIcon. */
export function pinHtml(num: number, name: string, isCrit: boolean): string {
  const padded = String(num).padStart(2, '0');
  return `<div class="ptg-pin${isCrit ? ' ptg-pin-crit' : ''}">
    <div class="ptg-pin-num">${padded}</div>
    <div class="ptg-pin-label">${name}</div>
  </div>`;
}

/** HTML string for the critical-day field note. */
export const FIELD_NOTE_HTML = `<div class="ptg-note">
  <div class="ptg-note-tag">04 DIC · DÍA CRÍTICO</div>
  <div class="ptg-note-title">PUQ → SCL → USH</div>
  <div class="ptg-note-body">
    Única conexión aérea. Conexión apretada en SCL.<br/>
    <span>Plan B: vuelo del día siguiente.</span>
  </div>
</div>`;
