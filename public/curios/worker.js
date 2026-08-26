// The compiler's thread. `compile` is a synchronous WebAssembly call that holds whichever thread runs it for as long as the type checker takes, and `run` is much the same behind a promise — so both happen here, off the page, and the page only ever hears about them through messages. Each request is `{ id, source }`; the answers are `{ id, kind: "phase", event }` for every phase that finishes and one `{ id, kind: "done", result }` at the end, in the same shape loader.js hands the page.

let modulePromise = null;

function warmUp(mod) {
  const start = performance.now();
  try {
    mod.compile("/std/Io/pure(())");
  } catch {}
  return performance.now() - start;
}

function loadModule() {
  const startedNow = !modulePromise;
  if (startedNow) {
    modulePromise = import("/curios/js/curios_js.js")
      .then(async (mod) => {
        await mod.default();
        return { mod, warmMs: warmUp(mod) };
      })
      .catch((error) => {
        modulePromise = null;
        throw error;
      });
  }
  return { promise: modulePromise, startedNow };
}

const utf8 = new TextDecoder();

async function compileAndReport(source, onPhase) {
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
  if (loadMs !== undefined) onPhase({ phase: "load", loadMs, warmMs });

  const t1 = performance.now();
  let bytes;
  try {
    bytes = mod.compile(source);
  } catch (error) {
    return { ok: false, phase: "compile", ms: performance.now() - t1, error: String(error) };
  }
  const wasmMs = performance.now() - t1;
  onPhase({ phase: "compile", wasmMs, byteLength: bytes.length });

  const t2 = performance.now();
  let outcome;
  try {
    outcome = await mod.run(bytes, undefined);
  } catch (error) {
    return { ok: false, phase: "run", ms: performance.now() - t2, error: `Couldn't run the program: ${error.message || error}` };
  }
  const runMs = performance.now() - t2;
  const run = {
    stdout: utf8.decode(outcome.stdout),
    stderr: utf8.decode(outcome.stderr),
    exitCode: outcome.exitCode,
    trap: outcome.trap,
  };

  return { ok: true, loadMs, warmMs, wasmMs, runMs, bytes, run };
}

self.addEventListener("message", async ({ data: { id, source } }) => {
  const result = await compileAndReport(source, (event) => self.postMessage({ id, kind: "phase", event }));
  const transfer = result.ok ? [result.bytes.buffer] : [];
  self.postMessage({ id, kind: "done", result }, transfer);
});
