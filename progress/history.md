# Historial de sesiones

Bitácora append-only. Cada sesión cerrada se vuelca acá con fecha, feature, resultado.

---

## 2026-05-07 — Setup harness organizacional sobre SDD

**Feature:** integración de harness Engineering (betta-tech/ejemplo-harness-subagentes) sobre SDD existente.

**Hecho:**
- Creado `feature_list.json` con backlog post-MVP (10 features migradas de TASKS.md y discusión)
- Creado `decisions.json` con 6 decisiones pendientes migradas de PRD §4 y Patagonia_2026.md
- Creado `init.sh` con gates: node ≥22, pnpm, archivos del harness, validador, `astro check`
- Creado `scripts/validate-feature-list.mjs` para validación de schemas
- Creado `scripts/feature-list.schema.json` (JSON Schema draft-07)
- Creado `CHECKPOINTS.md` con criterios C1–C7 adaptados al stack (Astro, TS, design system)
- Creado `AGENTS.md` documentando flujo harness + SDD integrado
- Creado `progress/current.md` (plantilla) y `progress/history.md` (este archivo)
- Actualizado `package.json` con scripts `init` y `validate`
- Actualizado `docs/TASKS.md` con nota de histórico (backlog migrado)

**Decisiones tomadas:**
- Harness se integra sobre SDD, no lo reemplaza. SDD sigue siendo el motor de planning. Harness aporta feature_list.json, init.sh, CHECKPOINTS, progress/.
- TASKS.md queda como histórico read-only de PR-0..PR-7. Backlog post-MVP vive en feature_list.json.
- Decisiones del PRD migradas a decisions.json para ser consultables y resolvibles.

**Próximos pasos:**
- Resolver D-02 (5 vs 6 personas) antes de F-01 (reservas tracker)
- Elegir primera feature pendiente para arrancar (F-01, F-02 o F-03 según prioridad)
- Considerar resolver D-01 (backend yes/no) — gatekeeper de F-09 y F-10
