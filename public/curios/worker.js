// The compiler's thread. `compile` is a synchronous WebAssembly call that holds whichever thread runs it for as long as the type checker takes, and `run` is much the same behind a promise — so both happen here, off the page, and the page only ever hears about them through messages. Each request is `{ id, source }`; the answers are `{ id, kind: "phase", event }` around every step and one `{ id, kind: "done", result }` at the end, in the same shape loader.js hands the page.

let modulePromise = null;

// Every step is announced twice: `{ phase: "begin", step }` before it starts and `{ phase: "end", step, ms }` once it is timed. The page draws a breadcrumb from that — finished steps behind, the one in play on the end — which it cannot do from durations alone, since a duration only exists after the wait it is measuring is over.
function loadModule(onPhase) {
  if (modulePromise) return modulePromise;

  // Only the request that starts the load narrates it. One that arrives mid-load waits on the same promise and its line starts at the compile, which is the truth of what that request paid for.
  modulePromise = (async () => {
    onPhase({ phase: "begin", step: "load" });
    const loadStart = performance.now();
    const mod = await import("/curios/js/curios_js.js");
    // The wasm is named explicitly rather than left to the bundle's own default: curios builds its browser bundle through wasm-bindgen's library rather than its command line, and the library omits the default module path the command line emits, so an argument-less init reaches WebAssembly.instantiate with nothing to instantiate. Naming it here is what the default would have resolved to anyway, and it stays correct if the bundle regains one.
    await mod.default({ module_or_path: "/curios/js/curios_js_bg.wasm" });
    onPhase({ phase: "end", step: "load", ms: performance.now() - loadStart });

    // The first compile pays whatever the module defers until it is asked for real work. Spending that on a throwaway program keeps it out of the number reported for the program you actually wrote — and it is a wait worth naming, because on a cold page it is long enough to see.
    onPhase({ phase: "begin", step: "warm" });
    const warmStart = performance.now();
    try {
      mod.compile("/std/Io/pure(())");
    } catch {}
    onPhase({ phase: "end", step: "warm", ms: performance.now() - warmStart });

    return mod;
  })().catch((error) => {
    modulePromise = null;
    throw error;
  });

  return modulePromise;
}

const utf8 = new TextDecoder();

async function compileAndReport(source, onPhase) {
  const loadStart = performance.now();
  let mod;
  try {
    mod = await loadModule(onPhase);
  } catch (error) {
    return {
      ok: false,
      phase: "load",
      ms: performance.now() - loadStart,
      error: `Couldn't load the curios compiler: ${error.message || error}`,
    };
  }

  onPhase({ phase: "begin", step: "compile" });
  const t1 = performance.now();
  let bytes;
  try {
    bytes = mod.compile(source);
  } catch (error) {
    return { ok: false, phase: "compile", ms: performance.now() - t1, error: String(error) };
  }
  onPhase({ phase: "end", step: "compile", ms: performance.now() - t1 });

  onPhase({ phase: "begin", step: "run" });
  const t2 = performance.now();
  let outcome;
  try {
    outcome = await mod.run(bytes, undefined);
  } catch (error) {
    return { ok: false, phase: "run", ms: performance.now() - t2, error: `Couldn't run the program: ${error.message || error}` };
  }
  // The size rides along with the run's timing because that is where the page reads it out: one crumb for how much WebAssembly ran and how long it took.
  onPhase({ phase: "end", step: "run", ms: performance.now() - t2, bytes: bytes.length });

  const run = {
    stdout: utf8.decode(outcome.stdout),
    stderr: utf8.decode(outcome.stderr),
    exitCode: outcome.exitCode,
    trap: outcome.trap,
  };

  // The timings have all been sent as they happened; what is left for the end is what the pane needs.
  return { ok: true, bytes, run };
}

self.addEventListener("message", async ({ data: { id, source } }) => {
  const result = await compileAndReport(source, (event) => self.postMessage({ id, kind: "phase", event }));
  const transfer = result.ok ? [result.bytes.buffer] : [];
  self.postMessage({ id, kind: "done", result }, transfer);
});
