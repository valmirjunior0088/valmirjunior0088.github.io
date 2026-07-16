#!/usr/bin/env bash
# Fetches the pinned curios release's wasm playground bundle and rustdoc API
# docs into public/curios/wasm and public/curios/docs, exactly what the
# deploy workflow does before `astro build`. Run this once (`npm run fetch`)
# to get a working playground and docs link locally; without it, the "Run"
# button and the docs link fail (the site handles that gracefully, but the
# playground won't work).
#
# CURIOS_TAG below is the single source of truth for the pinned release —
# the deploy workflow (.github/workflows/deploy.yml) invokes this same script,
# so bumping the tag here is the only place a release bump needs to happen.
set -euo pipefail

CURIOS_TAG="release/0.4.0"
CURIOS_REPO="valmirjunior0088/curios"

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DEST="$ROOT_DIR/public/curios"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

fetch_via_gh() {
  command -v gh >/dev/null 2>&1 || return 1
  gh release download "$CURIOS_TAG" --repo "$CURIOS_REPO" \
    --pattern 'curios-js.tar.gz' --pattern 'curios-docs.tar.gz' \
    --dir "$TMP" --clobber
}

fetch_via_curl() {
  local asset
  for asset in curios-js.tar.gz curios-docs.tar.gz; do
    curl -fsSL -o "$TMP/$asset" \
      "https://github.com/$CURIOS_REPO/releases/download/$CURIOS_TAG/$asset"
  done
}

echo "Fetching curios $CURIOS_TAG from $CURIOS_REPO..."
if ! fetch_via_gh; then
  echo "gh unavailable (or failed) — falling back to a direct curl download" >&2
  fetch_via_curl
fi

mkdir -p "$DEST/wasm" "$DEST/docs"
tar -xzf "$TMP/curios-js.tar.gz" -C "$DEST/wasm"
tar -xzf "$TMP/curios-docs.tar.gz" -C "$DEST/docs"

echo "Done — public/curios now has the wasm playground bundle and docs for $CURIOS_TAG."
