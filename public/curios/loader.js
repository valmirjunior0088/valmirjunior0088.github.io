// The page's side of the compiler. The work itself lives in worker.js, on its own thread, because compiling is a synchronous WebAssembly call and a page that runs it freezes for the duration; this file only spawns that worker once, forwards a request, and turns its messages back into the promise-and-callback shape the playground consumes. A worker that dies is thrown away, so the next run gets a fresh one rather than a silent stall.

let worker = null;
let nextId = 0;
const pending = new Map();

function fail(id, error) {
  const request = pending.get(id);
  if (!request) return;
  pending.delete(id);
  request.resolve({ ok: false, phase: "load", ms: 0, error: `Couldn't load the curios compiler: ${error}` });
}

function getWorker() {
  if (worker) return worker;
  worker = new Worker("/curios/worker.js", { type: "module" });

  worker.addEventListener("message", ({ data }) => {
    const request = pending.get(data.id);
    if (!request) return;
    if (data.kind === "phase") {
      request.onPhase?.(data.event);
    } else {
      pending.delete(data.id);
      request.resolve(data.result);
    }
  });

  // An error at this level is the worker itself failing — a script that would not parse, a bundle that never fetched — not a program being refused, which comes back as an ordinary result. Every request in flight gets the same answer, and the worker is dropped so a retry starts clean.
  worker.addEventListener("error", (event) => {
    const dead = worker;
    worker = null;
    dead.terminate();
    for (const id of [...pending.keys()]) fail(id, event.message || "worker error");
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
      fail(id, error.message || error);
    }
  });
}
