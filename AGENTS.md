# AGENTS.md — Mapa para agentes de IA

Punto de entrada para cualquier agente que trabaje en este repo. NO es biblia de reglas: es un **mapa**. Lee solo lo que necesites cuando lo necesites (divulgación progresiva).

Este proyecto integra **harness organizacional** (este archivo, `feature_list.json`, `init.sh`, `CHECKPOINTS.md`, `progress/`) **sobre SDD** (proposal → spec → design → tasks → apply → verify → archive). El harness define **qué** hacer y **cuándo** está hecho. SDD define **cómo** se planifica e implementa.

---

## 1. Antes de empezar (obligatorio)

1. Ejecutar `./init.sh`. Verde → seguir. Rojo → parar y resolver entorno.
2. Leer `progress/current.md` para entender estado de la última sesión.
3. Leer `feature_list.json`. Elegir **una** feature con `status: pending` y prioridad más alta. No trabajar dos en paralelo.
4. Si la feature requiere planning estructurado (>200 líneas estimadas o impacto multi-archivo), promoverla a SDD: `/sdd-new <slug>`.

## 2. Mapa del repo

| Archivo / dir | Qué contiene | Cuándo leerlo |
|---------------|--------------|---------------|
| `feature_list.json` | Backlog post-MVP con status (pending / in_progress / done / blocked) | Siempre, al empezar |
| `decisions.json` | Decisiones pendientes que afectan scope | Al elegir feature, para ver bloqueadores |
| `progress/current.md` | Sesión activa | Siempre, al empezar |
| `progress/history.md` | Bitácora append-only | Si necesitás contexto histórico |
| `CHECKPOINTS.md` | Criterios objetivos de "done" | Antes de cerrar sesión / merge |
| `docs/PRD.md` | Requisitos funcionales y no-funcionales del MVP | Antes de implementar feature nueva |
| `docs/TASKS.md` | Histórico de PRs PR-0..PR-7 (read-only) | Para ver cómo se hicieron features previas |
| `docs/Patagonia_2026.md` | Source of truth del contenido del viaje | Al editar content collections |
| `design/DESIGN.md` | Tokens, componentes, layouts canónicos | Antes de tocar UI |
| `init.sh` | Gate ejecutable del entorno | Al empezar y antes de marcar `done` |
| `scripts/validate-feature-list.mjs` | Validador del backlog | Lo corre `init.sh`, no lo invoques manual |

## 3. Reglas duras (no negociables)

- **Una sola feature `in_progress` a la vez.** `init.sh` rechaza más de una.
- **No declarar `done` sin pasar `init.sh` + PR mergeado.**
- **Documentar en `progress/current.md` mientras trabajás**, no al final.
- **Trazabilidad SDD ↔ harness:** si usás SDD, completá `feature_list.json[].sdd_change` con el change name.
- **Si te bloqueás, registrar en `progress/current.md` + cambiar status a `blocked` con `blocker`.** No inventar workarounds.

## 4. Cómo elegir una feature

```
1. Abrir feature_list.json
2. Filtrar status == "pending"
3. Ordenar por priority desc (high > medium > low)
4. Verificar depends_on resueltos
5. Verificar decisions.json — ¿hay decisión bloqueante?
6. Cambiar status a "in_progress" + guardar
7. Anotar en progress/current.md: feature, hora inicio, plan breve
```

## 5. Flujo de trabajo (harness + SDD)

```
feature_list.json (pending)
  ↓ elegís
status: in_progress + progress/current.md actualizado
  ↓ feature compleja (>200 líneas estimadas)
/sdd-new <slug> → exploration → proposal → spec → design → tasks
  ↓ feature simple
implementación directa con sub-agente Implementer
  ↓ verificación
/sdd-verify  o  reviewer recorre CHECKPOINTS.md
  ↓ todo OK
PR mergeado → /sdd-archive
  ↓
feature_list.json: status: done, pr: <num>, sdd_change: <name>
progress/current.md → progress/history.md
```

## 6. Cierre de sesión

1. Correr `./init.sh` → todo verde.
2. Si feature acabada: `status: done` + `pr: <num>` en `feature_list.json`.
3. Mover resumen de `progress/current.md` al final de `progress/history.md` con fecha.
4. Resetear `progress/current.md` a plantilla.
5. Sin archivos temporales, sin TODOs sin contexto.
6. Recorrer `CHECKPOINTS.md` C6.

## 7. Anti-teléfono-descompuesto (sub-agentes)

Cuando lances sub-agentes (sdd-explore, sdd-apply, general-purpose), instruí que **escriban resultados en `progress/<phase>_<feature>.md`** y devuelvan solo la referencia, no el contenido. Engram también sirve, pero `progress/` es commiteable y auditable en git.

| Archivo | Quién escribe | Qué contiene |
|---------|---------------|--------------|
| `progress/current.md` | Leader / orchestrator | Plan vivo |
| `progress/explore_<feature>.md` | sdd-explore / general-purpose | Hallazgos de investigación |
| `progress/impl_<feature>.md` | sdd-apply / implementer | Archivos tocados + tests |
| `progress/review_<feature>.md` | sdd-verify / reviewer | Checklist contra CHECKPOINTS.md |
| `progress/history.md` | Leader | Append-only, resumen de sesión cerrada |

## 8. Si te bloqueás

- Releé el doc relevante (`docs/`, `design/DESIGN.md`).
- Si la herramienta no hace lo esperado, **no inventes workaround**: documentá el bloqueo en `progress/current.md`, cambiá feature a `blocked` con `blocker`, y parás.
