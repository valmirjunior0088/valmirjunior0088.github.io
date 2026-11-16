// The page's side of the compiler. The work itself lives in worker.js, on its own thread, because compiling is a synchronous WebAssembly call and a page that runs it freezes for the duration; this file only spawns that worker once, forwards a request, and turns its messages back into the promise-and-callback shape the playground consumes. A worker that dies is thrown away, so the next run gets a fresh one rather than a silent stall.

let worker = null;
let nextId = 0;
const pending = new Map();

// How each failure reads in the pane. A refusal is the compiler's own report and passes through untouched; the rest are the playground's trouble rather than the program's, and say which part of it gave out.
const WORDING = {
  load: (cause) => `Couldn't load the curios compiler: ${cause}`,
  run: (cause) => `Couldn't run the program: ${cause}`,
  internal: (cause) => `The playground failed: ${cause}`,
};

function settle(id, result) {
  const request = pending.get(id);
  if (!request) return;
  pending.delete(id);
  const word = !result.ok && WORDING[result.phase];
  request.resolve(word ? { ...result, error: word(result.error) } : result);
}

function getWorker() {
  if (worker) return worker;
  worker = new Worker("/curios/worker.js", { type: "module" });

  worker.addEventListener("message", ({ data }) => {
    if (data.kind === "phase") pending.get(data.id)?.onPhase?.(data.event);
    else settle(data.id, data.result);
  });

  // An error at this level is the worker itself failing to start — a script that would not parse, a file that never arrived. Everything after that is caught inside the worker and comes back as an ordinary result, so this is always a failure to load. Every request in flight gets the same answer, and the worker is dropped so a retry starts clean.
  worker.addEventListener("error", (event) => {
    const dead = worker;
    worker = null;
    dead.terminate();
    for (const id of [...pending.keys()]) settle(id, { ok: false, phase: "load", error: event.message || "the worker would not start" });
  });

  return worker;
}

export function compileAndReport(source, onPhase) {
  const id = nextId++;
  return new Promise((resolve) => {
    pending.set(id, { resolve, onPhase });
    try {
      getWorker().postMessage({ id, source });
    } catch (error) {
      settle(id, { ok: false, phase: "load", error: error?.message || String(error) });
    }
  });
}
