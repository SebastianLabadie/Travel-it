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

  /* Trek pins — 24×24 hit area with 16×16 visible circles (PR-1) */
  .ptg-trekpin {
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .ptg-trekpin::before {
    content: '';
    width: 16px;
    height: 16px;
    border-radius: 50%;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
  }

  .ptg-trekpin.start::before {
    background: var(--color-paper);
    border: 1.5px solid var(--color-moss);
  }

  .ptg-trekpin.end::before {
    background: var(--color-moss);
    border: 1.5px solid var(--color-paper);
  }

  .ptg-trekpin-tip {
    position: absolute;
    left: 22px;
    top: -3px;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-fg);
    background: var(--color-paper);
    border: 1px solid var(--color-rule);
    padding: 1px 5px;
    white-space: nowrap;
    opacity: 0;
    transition: opacity 0.15s ease-out;
    pointer-events: none;
  }

  .ptg-trekpin:hover .ptg-trekpin-tip {
    opacity: 1;
  }

  /* Trek popup styles (PR-1 — used in PR-2 for popups) */
  .ptg-popup-tag {
    font-family: var(--font-mono);
    font-size: 8px;
    color: var(--color-moss);
    letter-spacing: 0.18em;
    font-weight: 600;
    text-transform: uppercase;
  }

  .ptg-popup-name {
    font-family: var(--font-display);
    font-style: italic;
    font-size: 17px;
    line-height: 1.15;
    color: var(--color-fg);
    margin-top: 4px;
  }

  .ptg-popup-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 4px;
    margin-top: 10px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--color-fg);
  }

  .ptg-popup-stats div {
    line-height: 1.3;
  }

  .ptg-popup-stats span {
    display: block;
    font-size: 8px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-stone);
  }

  .ptg-popup-foot {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px dashed var(--color-rule);
  }

  .ptg-popup-link {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--color-fg);
    text-decoration: none;
    border-bottom: 1px solid var(--color-fg);
  }

  /* Difficulty badges (PR-1) */
  .ptg-diff {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    padding: 2px 6px;
    border: 1px solid;
  }

  .ptg-diff.easy {
    color: var(--color-moss);
    border-color: var(--color-moss);
  }

  .ptg-diff.medium {
    color: var(--color-glacier);
    border-color: var(--color-glacier);
  }

  .ptg-diff.hard {
    color: var(--color-warning);
    border-color: var(--color-warning);
  }

  /* Trek line hover transition */
  .ptg-trek-line {
    transition: stroke-width 0.2s ease-out, stroke-opacity 0.2s ease-out;
  }

  /* Layer toggle stack */
  .ptg-toggles {
    position: absolute;
    top: 10px;
    right: 10px;
    z-index: 500;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: var(--font-mono);
  }

  .ptg-toggle {
    background: var(--color-paper);
    border: 1px solid var(--color-fg);
    color: var(--color-fg);
    font-size: 10px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    padding: 5px 9px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 110px;
    font-family: inherit;
    text-align: left;
  }

  .ptg-toggle.active {
    background: var(--color-fg);
    color: var(--color-paper);
  }

  .ptg-toggle:focus-visible {
    outline: 2px solid var(--color-fg);
    outline-offset: 2px;
  }

  .ptg-toggle-dot {
    width: 6px;
    height: 6px;
    flex-shrink: 0;
  }

  .ptg-toggle-dot.transfers {
    background: var(--color-fg);
  }

  .ptg-toggle.active .ptg-toggle-dot.transfers {
    background: var(--color-paper);
  }

  .ptg-toggle-dot.treks {
    background: transparent;
    border: 1px dotted var(--color-moss);
  }

  .ptg-toggle.active .ptg-toggle-dot.treks {
    border-color: var(--color-paper);
  }

  .ptg-toggle-dot.notas {
    background: var(--color-warning);
  }

  /* Trek popup wrapper overrides */
  .ptg-trek-popup .leaflet-popup-content-wrapper {
    background: var(--color-paper);
    color: var(--color-fg);
    border-radius: 0;
    border: 1px solid var(--color-fg);
    box-shadow: var(--shadow-lg);
    padding: 0;
  }

  .ptg-trek-popup .leaflet-popup-content {
    margin: 0;
  }

  .ptg-trek-popup .leaflet-popup-tip {
    background: var(--color-paper);
    border: 1px solid var(--color-fg);
  }

  /* Reduced motion: disable all transitions and animations */
  @media (prefers-reduced-motion: reduce) {
    .ptg-pin-num,
    .ptg-pin-label,
    .ptg-note,
    .ptg-trek-line,
    .ptg-trekpin,
    .ptg-trekpin-tip {
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

/** Build the HTML string for a trek popup (F-05). */
export function trekPopupHtml(trek: {
  id: string;
  day: string;
  name: string;
  distance: string;
  ascent: string;
  hours: string;
  difficulty: string;
}): string {
  const itinerarySlugByTrekId: Record<string, string> = {
    'fitz-roy': 'chalten',
    'base-torres': 'paine',
    esmeralda: 'ushuaia',
  };
  const itinerarySlug = itinerarySlugByTrekId[trek.id];
  const detailLink = itinerarySlug
    ? `<a class="ptg-popup-link" href="/itinerario#${itinerarySlug}">&#8599; ver detalle</a>`
    : '';

  return `<div class="ptg-popup">\n` +
    `  <div class="ptg-popup-tag">${trek.day}</div>\n` +
    `  <div class="ptg-popup-name">${trek.name}</div>\n` +
    `  <div class="ptg-popup-stats">\n` +
    `    <div><span>dist</span>${trek.distance}</div>\n` +
    `    <div><span>desn</span>${trek.ascent}</div>\n` +
    `    <div><span>hrs</span>${trek.hours}</div>\n` +
    `  </div>\n` +
    `  <div class="ptg-popup-foot">\n` +
    `    <span class="ptg-diff ${trek.difficulty}">${trek.difficulty}</span>\n` +
    `    ${detailLink}\n` +
    `  </div>\n` +
    `</div>`;
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
