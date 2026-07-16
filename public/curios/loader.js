let modulePromise = null;

function warmUp(mod) {
  const start = performance.now();
  try {
    mod.compile("()");
  } catch {}
  return performance.now() - start;
}

function loadModule() {
  const startedNow = !modulePromise;
  if (startedNow) {
    modulePromise = import("/curios/web/curios_web.js")
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

async function notify(onPhase, event) {
  if (!onPhase) return;
  await onPhase(event);
  await new Promise((resolve) => setTimeout(resolve));
}

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

  const t1 = performance.now();
  let bytes;
  try {
    bytes = mod.compile(source);
  } catch (error) {
    return { ok: false, phase: "compile", ms: performance.now() - t1, error: String(error) };
  }
  const wasmMs = performance.now() - t1;
  await notify(onPhase, { phase: "compile", wasmMs, byteLength: bytes.length });

  const t2 = performance.now();
  const outcome = await mod.run(bytes, undefined);
  const runMs = performance.now() - t2;
  const run = {
    stdout: utf8.decode(outcome.stdout),
    stderr: utf8.decode(outcome.stderr),
    exitCode: outcome.exitCode,
    trap: outcome.trap,
  };

  return { ok: true, loadMs, warmMs, wasmMs, runMs, bytes, run };
}
