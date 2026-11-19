#!/usr/bin/env bash
# Arranca Alter completo: backend (FastAPI) + frontend (Next.js).
#
#   ./run.sh            modo desarrollo (recarga al guardar)
#   ./run.sh --prod     compila el frontend y lo sirve en modo producción
#   ./run.sh --install  fuerza reinstalar dependencias antes de arrancar
#   ./run.sh --help
#
# Puertos: BACKEND_PORT=8001 FRONTEND_PORT=3001 ./run.sh
# Ctrl+C para todo.
#
# Funciona en Git Bash (Windows), Linux y macOS.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
MODE="dev"
FORCE_INSTALL=0

# --- Colores ---------------------------------------------------------------
if [ -t 1 ]; then
  VIOLET=$'\033[38;2;108;60;225m'; CYAN=$'\033[36m'; RED=$'\033[31m'; YELLOW=$'\033[33m'
  BOLD=$'\033[1m'; RESET=$'\033[0m'
else
  VIOLET=""; CYAN=""; RED=""; YELLOW=""; BOLD=""; RESET=""
fi
info() { printf '%s▸%s %s\n' "$VIOLET" "$RESET" "$*"; }
warn() { printf '%s! %s%s\n' "$YELLOW" "$*" "$RESET"; }
fail() { printf '%s✗ %s%s\n' "$RED" "$*" "$RESET" >&2; exit 1; }

usage() { sed -n '2,12p' "${BASH_SOURCE[0]}" | sed 's/^# \{0,1\}//'; }

for arg in "$@"; do
  case "$arg" in
    --prod) MODE="prod" ;;
    --install) FORCE_INSTALL=1 ;;
    -h|--help) usage; exit 0 ;;
    *) usage; fail "Opción desconocida: $arg" ;;
  esac
done

IS_WINDOWS=0
case "$(uname -s)" in MINGW*|MSYS*|CYGWIN*) IS_WINDOWS=1 ;; esac

# --- Herramientas ----------------------------------------------------------
find_python() {
  local cmd
  for cmd in python3 python py; do
    if command -v "$cmd" >/dev/null 2>&1 \
      && "$cmd" -c 'import sys; sys.exit(sys.version_info < (3, 10))' >/dev/null 2>&1; then
      echo "$cmd"; return 0
    fi
  done
  return 1
}

# Node recién instalado puede no estar aún en el PATH de esta terminal.
if ! command -v npm >/dev/null 2>&1; then
  for dir in "/c/Program Files/nodejs" "/usr/local/bin" "/opt/homebrew/bin"; do
    [ -x "$dir/npm" ] || [ -f "$dir/npm.cmd" ] && PATH="$dir:$PATH"
  done
fi
command -v npm >/dev/null 2>&1 || fail "No se encuentra Node.js/npm. Instálalo desde https://nodejs.org (versión LTS)."
PYTHON="$(find_python)" || fail "Hace falta Python 3.10 o superior (https://www.python.org)."

if [ "$IS_WINDOWS" = 1 ]; then VENV_PY="$BACKEND/.venv/Scripts/python.exe"; else VENV_PY="$BACKEND/.venv/bin/python"; fi

port_in_use() {
  (exec 3<>"/dev/tcp/127.0.0.1/$1") 2>/dev/null
}

# --- Dependencias ----------------------------------------------------------
setup_backend() {
  if [ ! -x "$VENV_PY" ]; then
    info "Creando entorno virtual de Python…"
    "$PYTHON" -m venv "$BACKEND/.venv"
    FORCE_INSTALL=1
  fi
  local marker="$BACKEND/.venv/.alter-installed"
  if [ "$FORCE_INSTALL" = 1 ] || [ ! -f "$marker" ] || [ "$BACKEND/requirements.txt" -nt "$marker" ]; then
    info "Instalando dependencias del backend…"
    "$VENV_PY" -m pip install --quiet --upgrade pip
    "$VENV_PY" -m pip install --quiet -r "$BACKEND/requirements.txt"
    touch "$marker"
  fi
  if [ ! -f "$BACKEND/.env" ]; then
    cp "$BACKEND/.env.example" "$BACKEND/.env"
    warn "Creado backend/.env: añade ANTHROPIC_API_KEY y APIFY_TOKEN para usar datos reales (sin ellas: modo demo)."
  fi
}

setup_frontend() {
  local stamp="$FRONTEND/node_modules/.package-lock.json"
  if [ "$FORCE_INSTALL" = 1 ] || [ ! -f "$stamp" ] || [ "$FRONTEND/package-lock.json" -nt "$stamp" ]; then
    info "Instalando dependencias del frontend…"
    (cd "$FRONTEND" && npm install --no-audit --no-fund --loglevel=error)
  fi
  if [ ! -f "$FRONTEND/.env.local" ]; then
    cp "$FRONTEND/.env.example" "$FRONTEND/.env.local"
    info "Creado frontend/.env.local"
  fi
}

# --- Procesos --------------------------------------------------------------
PIDS=()

# Mata un proceso y todos sus hijos (npm → next, uvicorn → workers).
kill_tree() {
  local pid=$1
  kill -0 "$pid" 2>/dev/null || return 0
  if [ "$IS_WINDOWS" = 1 ] && [ -r "/proc/$pid/winpid" ]; then
    taskkill //F //T //PID "$(cat "/proc/$pid/winpid")" >/dev/null 2>&1 || true
  else
    local child
    for child in $(pgrep -P "$pid" 2>/dev/null); do kill_tree "$child"; done
    kill "$pid" 2>/dev/null || true
  fi
}

CLEANED=0
cleanup() {
  [ "$CLEANED" = 1 ] && return
  CLEANED=1
  [ "${#PIDS[@]}" -eq 0 ] && return
  echo
  info "Parando Alter…"
  local pid
  for pid in "${PIDS[@]}"; do kill_tree "$pid"; done
  wait 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 130' INT TERM

# sed sin búfer: -u en GNU (Linux, Git Bash), -l en macOS.
if sed -u q </dev/null >/dev/null 2>&1; then SED_UNBUFFERED=-u; else SED_UNBUFFERED=-l; fi

# Lanza un comando en segundo plano con un prefijo de color en cada línea.
start() {
  local label=$1 color=$2; shift 2
  "$@" > >(sed "$SED_UNBUFFERED" "s/^/${color}[${label}]${RESET} /") 2>&1 &
  PIDS+=("$!")
}

# --- Arranque --------------------------------------------------------------
printf '\n%s%s  Alter%s · alternativas que ayudan al planeta\n\n' "$BOLD" "$VIOLET" "$RESET"

port_in_use "$BACKEND_PORT" && fail "El puerto $BACKEND_PORT ya está en uso (cámbialo con BACKEND_PORT=…)."
port_in_use "$FRONTEND_PORT" && fail "El puerto $FRONTEND_PORT ya está en uso (cámbialo con FRONTEND_PORT=…)."

setup_backend
setup_frontend

export NEXT_PUBLIC_API_URL="http://localhost:$BACKEND_PORT"
# Solo sobrescribe los orígenes permitidos del .env si el frontend no usa el puerto por defecto.
[ "$FRONTEND_PORT" != 3000 ] && export ALTER_ALLOWED_ORIGINS="http://localhost:$FRONTEND_PORT"

UVICORN_ARGS=(-m uvicorn app.main:app --app-dir "$BACKEND" --port "$BACKEND_PORT")
if [ "$MODE" = dev ]; then
  start api "$CYAN" "$VENV_PY" "${UVICORN_ARGS[@]}" --reload --reload-dir "$BACKEND/app"
  start web "$VIOLET" npm --prefix "$FRONTEND" run dev -- --port "$FRONTEND_PORT"
else
  info "Compilando el frontend…"
  npm --prefix "$FRONTEND" run build
  start api "$CYAN" "$VENV_PY" "${UVICORN_ARGS[@]}" --host 0.0.0.0
  start web "$VIOLET" npm --prefix "$FRONTEND" run start -- --port "$FRONTEND_PORT"
fi

# Espera a que ambos respondan y avisa.
for _ in $(seq 1 60); do
  port_in_use "$BACKEND_PORT" && port_in_use "$FRONTEND_PORT" && break
  sleep 1
done
printf '\n%s✓ Alter está en marcha%s\n' "$BOLD" "$RESET"
printf '  Web:  %shttp://localhost:%s%s\n' "$VIOLET" "$FRONTEND_PORT" "$RESET"
printf '  API:  http://localhost:%s/docs\n' "$BACKEND_PORT"
printf '  Ctrl+C para parar\n\n'

# Si uno de los dos se cae, se para todo.
while :; do
  for pid in "${PIDS[@]}"; do
    if ! kill -0 "$pid" 2>/dev/null; then
      warn "Uno de los procesos se ha detenido; parando el resto."
      exit 1
    fi
  done
  sleep 1
done
