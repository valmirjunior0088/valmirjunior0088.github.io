// Thin wrapper around the wasm-pack build of `curios-js` (see
// curios-js/src/lib.rs in the compiler repo: wasm-bindgen exports of the
// pure compile pipeline — `compile` and `typecheck`, no host imports).
//
// This file is hand-written and lives outside Astro's build graph on
// purpose: it's served as-is from /curios/loader.js, and it dynamically
// imports /curios/curios_js.js — the ES module wasm-pack generates —
// which itself fetches /curios/curios_js_bg.wasm at runtime. None of
// that needs a bundler; it's exactly how `wasm-pack build --target web`
// output is meant to be used.
//
// curios_js.js/curios_js_bg.wasm are NOT produced by this repo's build.
// They're built from the curios repo (`wasm-pack build curios-js --target
// web --release`) and copied in by hand — see curios-js/build-web.sh over
// there. If you're seeing "failed to fetch" errors below, that step hasn't
// been done yet.

let modulePromise = null;

function loadModule() {
  if (!modulePromise) {
    modulePromise = import("/curios/curios_js.js").then(async (mod) => {
      await mod.default();
      return mod;
    });
  }
  return modulePromise;
}

// The compiler emits programs against the GC proposal: strings/byte strings
// are `array (mut i8)` ("Bin") refs, not linear memory, so plain JS can't
// read or build them directly — a GC ref crossing into JS is opaque. This
// bridge module (hand-written here, see bridge.wat) declares the same array
// shape and, by the GC proposal's structural type canonicalization, the
// engine treats its refs as interchangeable with the compiler's own.
let bridgePromise = null;

function loadBridge() {
  if (!bridgePromise) {
    bridgePromise = fetch("/curios/bridge.wasm")
      .then((response) => response.arrayBuffer())
      .then((bytes) => WebAssembly.instantiate(bytes, {}))
      .then((result) => result.instance.exports);
  }
  return bridgePromise;
}

function decodeBin(bridge, ref) {
  const len = bridge.bin_len(ref);
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = bridge.bin_get(ref, i);
  return bytes;
}

function encodeBin(bridge, bytes) {
  const ref = bridge.bin_new(bytes.length);
  for (let i = 0; i < bytes.length; i++) bridge.bin_set(ref, i, bytes[i]);
  return ref;
}

// Wire status codes from curios-abi's `wire::status` module — must stay in
// sync with that crate.
const STATUS = {
  OK: 0,
  EOF: 1,
  NOT_FOUND: 2,
  PERMISSION_DENIED: 3,
};

// The well-known stdio handle tokens minted by the `/sys/Io` prelude
// (`Io::STDIN/STDOUT/STDERR` in curios-rt/src/host.rs), encoded the same
// way the runtime encodes them: little-endian bytes of the token integer.
function stdioStreamOf(bridge, ioRef) {
  const bytes = decodeBin(bridge, ioRef);
  if (bytes.length === 1 && bytes[0] === 1) return "stdout";
  if (bytes.length === 1 && bytes[0] === 2) return "stderr";
  if (bytes.length === 1 && bytes[0] === 0) return "stdin";
  return null;
}

/** Thrown by the `io_exit` import to unwind out of a running program cleanly. */
class ExitSignal {
  constructor(code) {
    this.code = code;
  }
}

// A from-scratch host for the `env.io_*` imports (see curios-rt/src/engine.rs
// and host.rs for the full native ABI this mirrors). Only stdio, clocks, and
// randomness are real; everything a browser sandbox has no business doing
// (files, sockets, TLS, DNS, process args/poll) reports a clean failure
// instead — `Status::PermissionDenied` where the ABI has a status to report,
// or a readable thrown error for the handful of ops whose return shape needs
// marshaling this bridge doesn't bother building (arrays of handles/args).
function makeBrowserHost(bridge, { onStdout, onStderr }) {
  const utf8 = new TextDecoder();
  const unsupported = (label) => () => {
    throw new Error(`${label} is not supported in the browser playground`);
  };
  const deniedWithHandle = () => [STATUS.PERMISSION_DENIED, bridge.bin_new(0)];

  return {
    io_write(io, bytesRef) {
      const stream = stdioStreamOf(bridge, io);
      const bytes = decodeBin(bridge, bytesRef);
      if (stream === "stdout") onStdout(utf8.decode(bytes));
      else if (stream === "stderr") onStderr(utf8.decode(bytes));
      else return [STATUS.PERMISSION_DENIED, 0];
      return [STATUS.OK, bytes.length];
    },
    io_exit(code) {
      throw new ExitSignal(code);
    },
    io_read() {
      return [STATUS.EOF, bridge.bin_new(0)];
    },
    io_clock_wall() {
      // secs since epoch split base-10⁹ so each limb fits an i31 (see
      // engine.rs's `io_clock_wall_type` doc comment).
      const ms = Date.now();
      const secs = Math.floor(ms / 1000);
      return [Math.floor(secs / 1e9), secs % 1e9, (ms % 1000) * 1e6];
    },
    io_clock_mono() {
      const ms = performance.now();
      return [Math.floor(ms / 1000), Math.round((ms % 1000) * 1e6)];
    },
    io_random(count) {
      const bytes = new Uint8Array(count);
      crypto.getRandomValues(bytes);
      return encodeBin(bridge, bytes);
    },
    io_env() {
      return [STATUS.NOT_FOUND, bridge.bin_new(0)];
    },
    io_open: deniedWithHandle,
    io_lookup: deniedWithHandle,
    io_socket: deniedWithHandle,
    io_tls_server_config: deniedWithHandle,
    io_accept: deniedWithHandle,
    io_connect: () => STATUS.PERMISSION_DENIED,
    io_bind: () => STATUS.PERMISSION_DENIED,
    io_listen: () => STATUS.PERMISSION_DENIED,
    io_start_tls: () => STATUS.PERMISSION_DENIED,
    io_start_tls_server: () => STATUS.PERMISSION_DENIED,
    io_set_nonblocking: () => STATUS.PERMISSION_DENIED,
    io_set_recv_timeout: () => STATUS.PERMISSION_DENIED,
    io_set_send_timeout: () => STATUS.PERMISSION_DENIED,
    io_set_reuseaddr: () => STATUS.PERMISSION_DENIED,
    io_close() {},
    io_resolve: unsupported("network access"),
    io_poll: unsupported("network access"),
    io_args: unsupported("process arguments"),
  };
}

/**
 * Typecheck, compile, then run `source` in-browser, reporting timing for
 * each phase — mirrors the three-stage pipeline (`typecheck_entrypoint` is a
 * prefix of `compile_entrypoint`; running instantiates and calls the
 * compiled module's `func/main` directly, no server round-trip).
 *
 * Returns one of:
 *   { ok: true, typeMs, wasmMs, bytes: Uint8Array, run: { stdout, stderr, exitCode, trap } }
 *   { ok: false, phase: "typecheck" | "compile", ms, error: string }
 */
export async function compileAndReport(source) {
  const mod = await loadModule();

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

  const run = await runCompiled(bytes);

  return { ok: true, typeMs, wasmMs, bytes, run };
}

/** Instantiate and run compiled `bytes`, capturing stdio and the outcome. */
async function runCompiled(bytes) {
  const bridge = await loadBridge();

  let stdout = "";
  let stderr = "";
  const env = makeBrowserHost(bridge, {
    onStdout: (text) => (stdout += text),
    onStderr: (text) => (stderr += text),
  });

  let instance;
  try {
    ({ instance } = await WebAssembly.instantiate(bytes, { env }));
  } catch (error) {
    return { stdout, stderr, exitCode: null, trap: `failed to instantiate: ${error.message}` };
  }

  try {
    instance.exports["func/main"]();
    return { stdout, stderr, exitCode: 0, trap: null };
  } catch (error) {
    if (error instanceof ExitSignal) {
      return { stdout, stderr, exitCode: error.code, trap: null };
    }
    return { stdout, stderr, exitCode: null, trap: error.message || String(error) };
  }
}
