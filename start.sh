#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"; ENV_FILE="$ROOT_DIR/.env"; MIGRATION_DIR="$ROOT_DIR/migrations"
read_env(){ awk -F= -v key="$1" '$0 !~ /^[[:space:]]*#/ && $1==key {value=substr($0,index($0,"=")+1);gsub(/^[[:space:]]+|[[:space:]]+$/,"",value);gsub(/^["\047]|["\047]$/,"",value);print value;exit}' "$ENV_FILE"; }
load_key(){ local key="$1" parsed;[ -n "${!key-}" ]&&return 0;[ -f "$ENV_FILE" ]||return 0;parsed="$(read_env "$key")";[ -z "$parsed" ]||export "$key=$parsed"; }
for key in DATABASE_URL JWT_SECRET GOVERNANCE_TENANT_ID ENABLE_GENERATED_FEATURES ALLOW_SCHEMA_MIGRATION PORT BACKEND_PORT FRONTEND_PORT;do load_key "$key";done
BACKEND_PORT="${BACKEND_PORT:-${PORT:-5000}}"; FRONTEND_PORT="${FRONTEND_PORT:-3000}"
export BACKEND_PORT FRONTEND_PORT
fail(){ printf 'error: %s\n' "$*" >&2;exit 1; }
check(){ local secret="${JWT_SECRET:-}";[ -n "${DATABASE_URL:-}" ]||fail "DATABASE_URL is required";[ -n "${GOVERNANCE_TENANT_ID:-}" ]||fail "GOVERNANCE_TENANT_ID is required";[ "${#secret}" -ge 32 ]||fail "JWT_SECRET must contain at least 32 characters";[ "${ENABLE_GENERATED_FEATURES:-false}" != true ]||[ "${NODE_ENV:-development}" != production ]||fail "generated prototype is forbidden in production";command -v node >/dev/null||fail "node is required";printf 'configuration valid for tenant %s\n' "$GOVERNANCE_TENANT_ID"; }
migrate(){ check;[ "${ALLOW_SCHEMA_MIGRATION:-0}" = 1 ]||fail "set ALLOW_SCHEMA_MIGRATION=1";command -v psql >/dev/null||fail "psql is required";for f in "$MIGRATION_DIR"/*.sql;do psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f "$f";done; }
start(){ check;[ -d "$ROOT_DIR/node_modules" ]||fail "dependencies are missing; install explicitly";cd "$ROOT_DIR";PORT="$BACKEND_PORT" BACKEND_PORT="$BACKEND_PORT" FRONTEND_PORT="$FRONTEND_PORT" ./node_modules/.bin/tsx server/index.ts; }
case "${1:-check}" in check)check;;migrate)migrate;;start)start;;*)fail "usage: $0 {check|migrate|start}";;esac
