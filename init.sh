#!/usr/bin/env bash
# init.sh — Gate ejecutable del harness.
# Corre al iniciar sesión y antes de marcar cualquier feature como done.
# Si falla, la sesión NO debe avanzar.

set -u
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
NC='\033[0m'

ok()    { printf "${GREEN}[OK]${NC}    %s\n" "$1"; }
warn()  { printf "${YELLOW}[WARN]${NC}  %s\n" "$1"; }
fail()  { printf "${RED}[FAIL]${NC}  %s\n" "$1"; }

EXIT_CODE=0

echo "── 1. Verificando entorno ─────────────────────────────"

if ! command -v node >/dev/null 2>&1; then
  fail "node no está instalado"
  exit 1
fi
ok "node -> $(node --version)"

NODE_OK=$(node -e 'process.exit(parseInt(process.versions.node.split(".")[0]) >= 22 ? 0 : 1)' && echo 1 || echo 0)
if [ "$NODE_OK" != "1" ]; then
  fail "Se requiere Node >= 22.12.0 (package.json engines)"
  exit 1
fi
ok "Versión de Node compatible"

if ! command -v pnpm >/dev/null 2>&1; then
  fail "pnpm no está instalado (corepack enable o npm i -g pnpm)"
  exit 1
fi
ok "pnpm -> $(pnpm --version)"

echo ""
echo "── 2. Verificando archivos del harness ────────────────"

for f in AGENTS.md CHECKPOINTS.md feature_list.json decisions.json progress/current.md docs/PRD.md docs/TASKS.md; do
  if [ ! -f "$f" ]; then
    fail "Falta archivo: $f"
    EXIT_CODE=1
  else
    ok "Existe $f"
  fi
done

echo ""
echo "── 3. Validando feature_list.json y decisions.json ────"

if node scripts/validate-feature-list.mjs; then
  ok "Schemas válidos"
else
  fail "feature_list.json o decisions.json inválido"
  EXIT_CODE=1
fi

echo ""
echo "── 4. Dependencias ────────────────────────────────────"

if [ -d node_modules ]; then
  ok "node_modules presente"
else
  warn "node_modules ausente — corré 'pnpm install --frozen-lockfile'"
fi

echo ""
echo "── 5. Type check ──────────────────────────────────────"

if pnpm exec astro check 2>&1 | tail -5; then
  ok "astro check sin errores"
else
  fail "astro check con errores"
  EXIT_CODE=1
fi

echo ""
echo "── 6. Resumen ──────────────────────────────────────────"

if [ $EXIT_CODE -eq 0 ]; then
  ok "Entorno listo. Podés empezar a trabajar."
else
  fail "Entorno NO está listo. Resolvé los errores antes de avanzar."
fi

exit $EXIT_CODE
