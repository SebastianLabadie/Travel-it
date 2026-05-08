# Spec — F-02 Vista presupuesto

## Estado

Completado: 2026-05-07
Fase: sdd-spec

## Resumen

Se escribieron las especificaciones delta para F-02 basadas en la proposal y el design mockup (`design/presupuesto.jsx`). Tres dominios cubiertos: `budget-data`, `budget-view`, `navigation`.

## Dominios especificados

| Dominio | Tipo | Requerimientos | Escenarios |
|---|---|---|---|
| budget-data | New | 1 (schema de content collection) | 2 |
| budget-view | New | 6 (página, pax toggle, categorías, hero, visualización, destinos, líneas) | 7 |
| navigation | Modified | 1 (extender tabs) | 1 |

## Cobertura

- **Happy paths**: cubiertos (carga de página, toggle pax, cambio de vista bar/table)
- **Edge cases**: cubiertos (placeholder sin rango, actividad gratis, item crítico, group-cost split)
- **Error states**: no aplica (datos estáticos, sin API externa)

## Decisiones clave documentadas

1. **Schema `budget-items`**: unifica vuelos, transfers, seguro y actividades en una sola colección discriminada por `cat`.
2. **Cálculo per-pax para group costs**: items con `perPerson: false` se dividen por pax para mantener honesta la vista /pax.
3. **Proporciones sobre midpoint**: StackedBar y PercentTable usan `(min+max)/2` para calcular porcentajes, no el mínimo ni el máximo.
4. **Responsive vía CSS en `.astro`**: el mockup usa `density` prop; la spec respeta el patrón existente del proyecto (CSS de visibilidad en Astro, no en el island) para evitar hydration mismatch.
5. **Navegación cross-cutting**: extender `activeTab` union en `BaseLayout.astro`, `TopNav.astro` y `TabBar.astro`.

## Reglas de cálculo resumidas

| Regla | Fórmula |
|---|---|
| Lodging por destino | `[min×noches, max×noches]` |
| Divisor per-pax | `1` si `perPerson`, sino `pax` |
| Total categoría | Suma de `range[0]/div` y `range[1]/div` |
| Total por persona | Suma de los 5 mínimos y 5 máximos |
| Total grupo | `[totalMin×pax, totalMax×pax]` |
| % proporción | `midpoint / sumaDeMidpoints × 100` |

## Próximo paso

Listo para `sdd-design` (o `sdd-tasks` si el design ya está definido por el mockup). El mockup `design/presupuesto.jsx` ya contiene la interfaz visual completa; probablemente se pueda saltar a `sdd-tasks` directamente.

## Artifact

Persistido en Engram: `topic_key = sdd/f-02/spec` (obs #1729).
