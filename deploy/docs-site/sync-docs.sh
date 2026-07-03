#!/usr/bin/env bash
set -euo pipefail

REPO_URL="${REPO_URL:-https://github.com/FP-Validated/fp-validated-docs.git}"
REPO_BRANCH="${REPO_BRANCH:-main}"
GIT_USERNAME="${GIT_USERNAME:-x-access-token}"
SYNC_INTERVAL_SECONDS="${SYNC_INTERVAL_SECONDS:-300}"
WORK_DIR="${WORK_DIR:-/workspace}"
REPO_DIR="${REPO_DIR:-/workspace/repo}"
SITE_DIR="${SITE_DIR:-/var/www/site}"
NPM_CACHE_DIR="${NPM_CACHE_DIR:-/workspace/.npm}"
REVISION_FILE="${REVISION_FILE:-/var/www/site/.built-revision}"

if [ -z "${GIT_TOKEN:-}" ]; then
  echo "GIT_TOKEN is required" >&2
  exit 1
fi

auth_url=$(printf '%s' "$REPO_URL" | sed "s#https://#https://$GIT_USERNAME:$GIT_TOKEN@#")
mkdir -p "$WORK_DIR" "$SITE_DIR" "$NPM_CACHE_DIR"

while true; do
  if [ ! -d "$REPO_DIR/.git" ]; then
    rm -rf "$REPO_DIR"
    git clone --depth 1 --branch "$REPO_BRANCH" "$auth_url" "$REPO_DIR"
  else
    git -C "$REPO_DIR" fetch --depth 1 origin "$REPO_BRANCH"
    git -C "$REPO_DIR" reset --hard "origin/$REPO_BRANCH"
    git -C "$REPO_DIR" clean -fdx
  fi

  revision=$(git -C "$REPO_DIR" rev-parse HEAD)
  built_revision=""
  if [ -f "$REVISION_FILE" ]; then
    built_revision=$(cat "$REVISION_FILE")
  fi

  if [ "$revision" != "$built_revision" ]; then
    npm --prefix "$REPO_DIR/scripts" ci --cache "$NPM_CACHE_DIR"
    npm --prefix "$REPO_DIR/website" ci --cache "$NPM_CACHE_DIR"
    npm --prefix "$REPO_DIR/website" run build
    rm -rf "$SITE_DIR"/*
    cp -a "$REPO_DIR/website/build/." "$SITE_DIR/"
    printf '%s' "$revision" > "$REVISION_FILE"
    echo "Built docs revision $revision"
  fi

  sleep "$SYNC_INTERVAL_SECONDS"
done
