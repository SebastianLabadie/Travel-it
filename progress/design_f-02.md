# Design: F-02 Vista presupuesto

## Resumen

- **Approach**: Replicar patrón `/reservas`: página Astro carga datos → isla Preact `client:only` → responsive vía CSS en `.astro`.
- **Key Decisions**: 6 decisiones documentadas (estado local, CSS en .astro, inline styles con CSS vars, nueva colección, omitir nav del mockup, omitir viz comparación).
- **Files Affected**: 9 nuevos, 6 modificados.
- **Testing Strategy**: Verificación manual (sin infraestructura de tests).

## Componentes a implementar

| Componente | Origen mockup | Complejidad | Notas |
|---|---|---|---|
| `BudgetView.tsx` | `PresupuestoDesktop` + `PresupuestoMobile` | Media | Isla raíz; estado `pax`/`viz` |
| `PaxToggle.tsx` | `PaxToggle` | Baja | Reusable, segmentado sin radius |
| `TotalHero.tsx` | `TotalHero` | Media | Hero grande + group total contramuestra |
| `StackedBar.tsx` | `StackedBar` | Media | Barra apilada horizontal |
| `PercentTable.tsx` | `PercentTable` | Media | Tabla mono con % por categoría |
| `DestinationBreakdown.tsx` | `DestinationBreakdown` | Media | Desglose alojamiento por destino |
| `LineItemsSection.tsx` | `LineItemsSection` | Media | Lista genérica fijos/variables |

## Componentes a omitir

- `PTopNav` / `PTabBarMobile` → ya existen como `TopNav.astro` / `TabBar.astro`
- `PresupuestoVizCompare` → era herramienta de diseño, no producción

## Decisiones clave

1. **Estado local `useState`** (no Zustand): el estado `pax` y `viz` no se comparte entre páginas.
2. **Responsive en `.astro`**: clases `.bdg-mobile` / `.bdg-desktop` con `:global()` CSS, igual que `/reservas`.
3. **Inline styles con CSS vars**: sigue el patrón de `ReservasHeader.tsx` y `CategoryHeader.tsx`.
4. **Nueva colección `budget-items`**: no se puede reutilizar `bookings` porque necesita `range` [min,max], `critical`, `free`.

## Mapeo P_THEME → CSS vars

- `bg` → `var(--color-bg)`
- `bg2` → `var(--color-bg-alt)`
- `paper` → `var(--color-paper)`
- `fg` → `var(--color-fg)`
- `stone` → `var(--color-stone)`
- `rule` → `var(--color-rule)`
- `glacier` → `var(--color-glacier)`
- `moss` → `var(--color-moss)`
- `warning` → `var(--color-warning)`

## Open Questions

- ¿`client:visible` vs `client:only`? `reservas` usa `client:only`; seguir ese patrón.

## Next Step

Listo para `sdd-tasks`.
