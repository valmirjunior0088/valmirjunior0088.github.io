;; A tiny, hand-written module that lets loader.js read and build `Bin`
;; values (`array (mut i8)`) produced by compiled curios programs.
;;
;; curios' wasm codegen targets the GC proposal: strings/byte strings are
;; `array (mut i8)` refs, not linear memory, so plain JS can't inspect or
;; construct them (a wasm GC ref crossing into JS is an opaque object per
;; the GC proposal's MVP-JS.md). But GC types canonicalize structurally
;; ("isorecursive" — see the GC proposal Overview.md): any two modules that
;; declare the exact same array/struct shape, loaded into the same engine,
;; get the *same* runtime type. So this module — built once, independently,
;; with zero coordination with the compiler — can hand back accessor
;; functions that operate on `Bin` values a compiled program produces, and
;; the engine treats them as the same type. No compiler change needed.
;;
;; The shape here must keep matching curios-cont's `bin_type()`
;; (`curios-cont/src/to_wasm/module_emitter.rs`): a final array of mutable
;; packed i8, no supertype. If that ever changes, rebuild this file.
;;
;; Rebuild with the `wat` crate (same one wasmtime uses), e.g.:
;;   cargo new --bin /tmp/bridge-build && cd /tmp/bridge-build
;;   cargo add wat
;;   # main.rs: std::fs::write("bridge.wasm", wat::parse_file("bridge.wat")?)?;
;;   cargo run --release
;; or with Bytecode Alliance's `wasm-tools` CLI: `wasm-tools parse bridge.wat -o bridge.wasm`.

(module
  (type $bin (array (mut i8)))

  (func (export "bin_len") (param $b (ref $bin)) (result i32)
    (array.len (local.get $b)))

  (func (export "bin_get") (param $b (ref $bin)) (param $i i32) (result i32)
    (array.get_u $bin (local.get $b) (local.get $i)))

  (func (export "bin_new") (param $len i32) (result (ref $bin))
    (array.new_default $bin (local.get $len)))

  (func (export "bin_set") (param $b (ref $bin)) (param $i i32) (param $v i32)
    (array.set $bin (local.get $b) (local.get $i) (local.get $v)))
)
