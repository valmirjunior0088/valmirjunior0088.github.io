// Thin wrapper around the wasm-pack build of `curios-js` (see
// curios-js/src/lib.rs in the compiler repo: wasm-bindgen exports of the
// compile pipeline — `compile`/`typecheck` — plus the browser run harness,
// `run`, which owns instantiating a compiled program against a JS host and
// everything that host needs to know about the ABI. This file no longer
// hand-rolls any of that.
//
// This file is hand-written and lives outside Astro's build graph on
// purpose: it's served as-is from /curios/loader.js, and it dynamically
// imports /curios/wasm/curios_js.js — the ES module wasm-pack generates —
// which itself fetches /curios/wasm/curios_js_bg.wasm at runtime. None of
// that needs a bundler; it's exactly how `wasm-pack build --target web`
// output is meant to be used.
//
// Everything under /curios/wasm/ is NOT produced by this repo's build.
// It's fetched from the curios repo's release assets — see scripts/fetch.sh
// (`npm run fetch`) to populate it for local dev; the deploy workflow runs
// the same script. If you're seeing "failed to load the compiler" errors
// below, that step hasn't been done yet.

// Memoized so the ~multi-MB compiler wasm is only fetched once per page
// load. `loadModule()` reports whether *this* call is the one that kicked
// off the fetch (`startedNow`), so callers can time and annotate just the
// first, slow load and stay silent on the instant cache hits after it.
let modulePromise = null;

function loadModule() {
  const startedNow = !modulePromise;
  if (startedNow) {
    modulePromise = import("/curios/wasm/curios_js.js")
      .then(async (mod) => {
        await mod.default();
        return mod;
      })
      .catch((error) => {
        modulePromise = null; // let the next Run click retry instead of staying stuck
        throw error;
      });
  }
  return { promise: modulePromise, startedNow };
}

const utf8 = new TextDecoder();

/**
 * Typecheck, compile, then run `source` in-browser, reporting timing for
 * each phase — mirrors the three-stage pipeline (`typecheck_entrypoint` is a
 * prefix of `compile_entrypoint`; running delegates to the compiler's own
 * `run` export, which instantiates the module against its browser host and
 * calls the entrypoint directly, no server round-trip).
 *
 * The compiler itself is a multi-MB wasm download fetched lazily on the
 * first call anywhere on the page; `loadMs` reports how long that first
 * load took (network + wasm instantiation) so the caller can surface it as
 * its own step, and is omitted once the module's already cached.
 *
 * Returns one of:
 *   { ok: true, loadMs?, typeMs, wasmMs, bytes: Uint8Array, run: { stdout, stderr, exitCode, trap } }
 *   { ok: false, phase: "load" | "typecheck" | "compile", ms, error: string }
 */
export async function compileAndReport(source) {
  const { promise, startedNow } = loadModule();
  const loadStart = performance.now();
  let mod;
  try {
    mod = await promise;
  } catch (error) {
    return {
      ok: false,
      phase: "load",
      ms: performance.now() - loadStart,
      error: `Couldn't load the curios compiler: ${error.message || error}`,
    };
  }
  const loadMs = startedNow ? performance.now() - loadStart : undefined;

  const t0 = performance.now();
  try {
    mod.typecheck(source);
  } catch (error) {
    return { ok: false, phase: "typecheck", ms: performance.now() - t0, error: String(error) };
  }
  const typeMs = performance.now() - t0;

  const t1 = performance.now();
  let bytes;
  try {
    bytes = mod.compile(source);
  } catch (error) {
    return { ok: false, phase: "compile", ms: performance.now() - t1, error: String(error) };
  }
  const wasmMs = performance.now() - t1;

  // `run`'s stdout/stderr are the raw accumulated bytes; decode them for the
  // plain-text display this page does with them.
  const outcome = await mod.run(bytes, undefined);
  const run = {
    stdout: utf8.decode(outcome.stdout),
    stderr: utf8.decode(outcome.stderr),
    exitCode: outcome.exitCode,
    trap: outcome.trap,
  };

  return { ok: true, loadMs, typeMs, wasmMs, bytes, run };
}
