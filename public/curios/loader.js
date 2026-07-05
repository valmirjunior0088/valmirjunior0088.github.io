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

// The very first call into the compiler module pays a large one-time cost
// (lazy wasm compilation / JIT warm-up plus the compiler's own one-time
// init — empirically ~1.6s where every later call is ~40ms), regardless of
// which program it's given. Absorb it here with a throwaway compile of a
// trivial program, timed as `warmMs`, so the user's own typecheck/compile
// numbers measure only their program.
const WARM_UP_SOURCE = 'use /std/{Io};\n\nIo/print("")';

function loadModule() {
  const startedNow = !modulePromise;
  if (startedNow) {
    modulePromise = import("/curios/wasm/curios_js.js")
      .then(async (mod) => {
        await mod.default();
        const warmStart = performance.now();
        try {
          mod.compile(WARM_UP_SOURCE);
        } catch {
          // Warm-up is best-effort; a failure here surfaces soon enough on
          // the user's real program with a proper phase attached.
        }
        return { mod, warmMs: performance.now() - warmStart };
      })
      .catch((error) => {
        modulePromise = null; // let the next Run click retry instead of staying stuck
        throw error;
      });
  }
  return { promise: modulePromise, startedNow };
}

const utf8 = new TextDecoder();

// Reports a completed phase to the caller's `onPhase`, then yields a
// macrotask so whatever the callback put in the DOM can paint before the
// next synchronous compiler call blocks the main thread.
async function notify(onPhase, event) {
  if (!onPhase) return;
  await onPhase(event);
  await new Promise((resolve) => setTimeout(resolve));
}

/**
 * Typecheck, compile, then run `source` in-browser, reporting timing for
 * each phase — mirrors the three-stage pipeline (`typecheck_entrypoint` is a
 * prefix of `compile_entrypoint`; running delegates to the compiler's own
 * `run` export, which instantiates the module against its browser host and
 * calls the entrypoint directly, no server round-trip).
 *
 * The compiler itself is a multi-MB wasm download fetched lazily on the
 * first call anywhere on the page; `loadMs` reports how long that first
 * load took (network + wasm instantiation) and `warmMs` how long the
 * one-time first-call warm-up took, so the caller can surface them as their
 * own steps. Both are omitted once the module's already cached.
 *
 * `onPhase`, if given, is called as each phase completes — with
 * { phase: "load", loadMs, warmMs } (first load only), then
 * { phase: "typecheck", typeMs }, then { phase: "compile", wasmMs,
 * byteLength } — so a UI can render progress as it happens rather than all
 * at once at the end. The callback can just append to the DOM: after each
 * one, a macrotask yield gives the browser a chance to paint before the
 * next (synchronous) phase starts. The phase timers exclude that wait.
 *
 * Returns one of:
 *   { ok: true, loadMs?, warmMs?, typeMs, wasmMs, runMs, bytes: Uint8Array, run: { stdout, stderr, exitCode, trap } }
 *   { ok: false, phase: "load" | "typecheck" | "compile", ms, error: string }
 */
export async function compileAndReport(source, onPhase) {
  const { promise, startedNow } = loadModule();
  const loadStart = performance.now();
  let mod, warmMs;
  try {
    ({ mod, warmMs } = await promise);
  } catch (error) {
    return {
      ok: false,
      phase: "load",
      ms: performance.now() - loadStart,
      error: `Couldn't load the curios compiler: ${error.message || error}`,
    };
  }
  const loadMs = startedNow ? performance.now() - loadStart - warmMs : undefined;
  if (!startedNow) warmMs = undefined;
  if (loadMs !== undefined) await notify(onPhase, { phase: "load", loadMs, warmMs });

  const t0 = performance.now();
  try {
    mod.typecheck(source);
  } catch (error) {
    return { ok: false, phase: "typecheck", ms: performance.now() - t0, error: String(error) };
  }
  const typeMs = performance.now() - t0;
  await notify(onPhase, { phase: "typecheck", typeMs });

  const t1 = performance.now();
  let bytes, foreignNames;
  try {
    ({ bytes, foreignNames } = mod.compile(source));
  } catch (error) {
    return { ok: false, phase: "compile", ms: performance.now() - t1, error: String(error) };
  }
  const wasmMs = performance.now() - t1;
  await notify(onPhase, { phase: "compile", wasmMs, byteLength: bytes.length });

  // `run`'s stdout/stderr are the raw accumulated bytes; decode them for the
  // plain-text display this page does with them. The playground doesn't
  // implement `hooks.foreign`, so a program with `foreign` declarations
  // compiles fine but traps at run time on the missing host import.
  const t2 = performance.now();
  const outcome = await mod.run(bytes, foreignNames, undefined);
  const runMs = performance.now() - t2;
  const run = {
    stdout: utf8.decode(outcome.stdout),
    stderr: utf8.decode(outcome.stderr),
    exitCode: outcome.exitCode,
    trap: outcome.trap,
  };

  return { ok: true, loadMs, warmMs, typeMs, wasmMs, runMs, bytes, run };
}
