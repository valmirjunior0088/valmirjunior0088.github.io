#!/usr/bin/env bash
# Fetches the pinned curios release's wasm playground bundle and its rustdoc API docs into public/curios/js and public/curios/docs/rust, and renders the standard library's pages into public/curios/docs/std, exactly what the deploy workflow does before `astro build`. Run this once (`npm run fetch`) to get a working playground and docs links locally; without it, the "Run" button and both docs links fail (the site handles that gracefully, but the playground won't work).
#
# The /std pages are not a release asset: the compiler renders them itself, `curios document --std <DIR>`, off the prelude it embeds. So the release's compiler for this machine is downloaded into .artifacts/, checked against the release's checksums.txt before anything runs it, and asked for them. A machine the release builds no compiler for gets everything but those pages, and is told so.
#
# package.json's "releaseArtifacts" field is the single source of truth for the pinned release — the deploy workflow (.github/workflows/deploy.yml) invokes this same script, so bumping the tag in package.json is the only edit a release needs.
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CURIOS_REPO="$(node -p "require('$ROOT_DIR/package.json').releaseArtifacts.repo")"
CURIOS_TAG="$(node -p "require('$ROOT_DIR/package.json').releaseArtifacts.tag")"
DEST="$ROOT_DIR/public/curios"
ARTIFACTS="$ROOT_DIR/.artifacts"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

# The three platforms a release builds a compiler for, under the names its own install.sh gives them. Anywhere else this stays empty.
case "$(uname -s) $(uname -m)" in
  "Linux x86_64" | "Linux amd64") COMPILER="curios-linux-x86_64" ;;
  "Linux aarch64" | "Linux arm64") COMPILER="curios-linux-aarch64" ;;
  "Darwin arm64" | "Darwin aarch64") COMPILER="curios-macos-aarch64" ;;
  *) COMPILER="" ;;
esac

ASSETS=(curios-js.tar.gz curios-docs.tar.gz)
if [ -n "$COMPILER" ]; then
  ASSETS+=("$COMPILER" checksums.txt)
fi

fetch_via_gh() {
  command -v gh >/dev/null 2>&1 || return 1
  local asset patterns=()
  for asset in "${ASSETS[@]}"; do
    patterns+=(--pattern "$asset")
  done
  gh release download "$CURIOS_TAG" --repo "$CURIOS_REPO" "${patterns[@]}" --dir "$TMP" --clobber
}

fetch_via_curl() {
  local asset
  for asset in "${ASSETS[@]}"; do
    curl -fsSL -o "$TMP/$asset" \
      "https://github.com/$CURIOS_REPO/releases/download/$CURIOS_TAG/$asset"
  done
}

digest_of() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | cut -d' ' -f1
  else
    shasum -a 256 "$1" | cut -d' ' -f1
  fi
}

echo "Fetching curios $CURIOS_TAG from $CURIOS_REPO..."
if ! fetch_via_gh; then
  echo "gh unavailable (or failed) — falling back to a direct curl download" >&2
  fetch_via_curl
fi

mkdir -p "$DEST/js" "$DEST/docs/rust" "$DEST/docs/std"
tar -xzf "$TMP/curios-js.tar.gz" -C "$DEST/js"
tar -xzf "$TMP/curios-docs.tar.gz" -C "$DEST/docs/rust"

if [ -z "$COMPILER" ]; then
  echo "curios $CURIOS_TAG ships no compiler for $(uname -s) $(uname -m), so the /std docs were not rendered" >&2
  echo "Done — public/curios now has the wasm playground bundle and the Rust docs for $CURIOS_TAG."
  exit 0
fi

# The digest travels with the binary, so this catches a truncated download or a swapped asset rather than a compromised release — which is what there is to catch before running something just downloaded.
expected="$(grep " $COMPILER\$" "$TMP/checksums.txt" | cut -d' ' -f1 || true)"
actual="$(digest_of "$TMP/$COMPILER")"
if [ -z "$expected" ] || [ "$expected" != "$actual" ]; then
  echo "checksum mismatch for $COMPILER: expected ${expected:-an entry in checksums.txt}, got $actual" >&2
  exit 1
fi

mkdir -p "$ARTIFACTS"
mv "$TMP/$COMPILER" "$ARTIFACTS/curios"
chmod +x "$ARTIFACTS/curios"
"$ARTIFACTS/curios" document --std "$DEST/docs/std"

echo "Done — public/curios now has the wasm playground bundle, the Rust docs and the /std docs for $CURIOS_TAG."
