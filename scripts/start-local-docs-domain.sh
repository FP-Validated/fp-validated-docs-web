#!/usr/bin/env bash
set -euo pipefail

HOST="${HOST:-127.0.0.1}"
PORT="${PORT:-3000}"

cd "$(dirname "$0")/../website"
exec npm start -- --host "$HOST" --port "$PORT" --no-open
