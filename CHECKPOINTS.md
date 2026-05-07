# CHECKPOINTS — Estado final correcto

Criterios objetivos que un revisor (humano, sdd-verify, o reviewer ad-hoc) recorre antes de marcar una feature como `done`. Si queda algún checkbox vacío en C1–C7, el cierre se rechaza.

## C1 — El arnés está completo

- [ ] `AGENTS.md`, `CHECKPOINTS.md`, `feature_list.json`, `decisions.json`, `progress/current.md` existen
- [ ] `docs/PRD.md`, `docs/TASKS.md`, `docs/Patagonia_2026.md` existen
- [ ] `./init.sh` termina con exit code 0

## C2 — El estado del backlog es coherente

- [ ] Como mucho 1 feature en `in_progress` en `feature_list.json`
- [ ] Toda feature `done` tiene `pr: <num>` linkeado a un PR mergeado
- [ ] Toda feature `blocked` tiene `blocker` explicando por qué
- [ ] Decisiones `resolved` tienen `resolution` registrada
- [ ] `progress/current.md` describe sesión activa, sin basura de sesiones previas

## C3 — La calidad del código respeta el design system

- [ ] `pnpm astro check` → 0 errores de tipos
- [ ] `pnpm build` → exit 0
- [ ] PR ≤ 400 líneas cambiadas (o `size:exception` justificado en TASKS.md o sdd_change)
- [ ] TypeScript strict, sin `any`, sin `as` salvo `as const`
- [ ] Sin emojis en UI ni en código (DESIGN.md §8) — usar ASCII (`↗ ↳ ✓ ▢ ↻ !! ◇ ☰`)
- [ ] Sin valores hex inline en componentes — todo via tokens del DS
- [ ] Sin `rounded-*` salvo pins del mapa

## C4 — Accesibilidad y performance

- [ ] Lighthouse Performance ≥ 90 (mobile)
- [ ] Lighthouse Accessibility = 100
- [ ] LCP ≤ 2.0s en 4G simulado
- [ ] `:focus-visible` con outline 2px var(--color-fg)
- [ ] Componentes interactivos con aria correcto (`aria-current`, `aria-expanded`, `aria-controls`)
- [ ] `prefers-reduced-motion` respetado
- [ ] Skip-link al `<main>` presente

## C5 — Datos validados en build

- [ ] Todo cambio en `src/content/*.json` valida con Zod (`pnpm astro check` falla si no)
- [ ] Tipos derivados via `z.infer<typeof schema>` — no duplicar tipos manualmente
- [ ] Helpers de query en `src/lib/trip.ts` — no leer collections directo desde componentes

## C6 — La sesión se cerró bien

- [ ] No hay archivos sin trackear sospechosos (`*.tmp`, logs, dumps)
- [ ] `progress/current.md` movido a `progress/history.md` con fecha + resumen
- [ ] `progress/current.md` reseteado a plantilla
- [ ] Feature trabajada está en estado correcto (`done` con PR linkeado, o `blocked` con razón)
- [ ] Decisiones nuevas o resueltas están en `decisions.json`

## C7 — Trazabilidad SDD ↔ harness

- [ ] Si la feature usó SDD: `feature_list.json[].sdd_change` apunta al change name
- [ ] El change SDD pasó `/sdd-verify` con status PASS antes del merge
- [ ] El change SDD fue archivado (`/sdd-archive`) tras merge

---

**Cómo usar este archivo:** copiar el bloque relevante a `progress/review_<feature>.md` al hacer review, marcar `[x]` o `[ ]` por cada item, y rechazar el cierre si queda alguno vacío en C1–C7.
