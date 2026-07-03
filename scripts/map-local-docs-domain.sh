#!/usr/bin/env bash
set -euo pipefail

HOSTS_FILE="${HOSTS_FILE:-/etc/hosts}"
DOMAIN="${DOMAIN:-docs.4pillars.info}"
TARGET="${TARGET:-127.0.0.1}"
LINE="${TARGET} ${DOMAIN}"
PATTERN="^[[:space:]]*${TARGET//./\\.}[[:space:]]+${DOMAIN//./\\.}([[:space:]]|$)"
if [ "$HOSTS_FILE" != "/etc/hosts" ] && [ ! -f "$HOSTS_FILE" ]; then
  touch "$HOSTS_FILE"
fi

if grep -Eq "$PATTERN" "$HOSTS_FILE"; then
  echo "${DOMAIN} already maps to ${TARGET} in ${HOSTS_FILE}"
  exit 0
fi

if [ "$HOSTS_FILE" = "/etc/hosts" ]; then
  printf '\n%s\n' "$LINE" | sudo tee -a "$HOSTS_FILE" >/dev/null
else
  printf '\n%s\n' "$LINE" >> "$HOSTS_FILE"
fi

echo "Mapped ${DOMAIN} to ${TARGET} in ${HOSTS_FILE}"
