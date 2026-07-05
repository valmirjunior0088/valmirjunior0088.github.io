// Content for the curios landing page's features grid and benchmarks
// section — extracted so the markup can map over data instead of
// repeating near-identical card structure per entry (same rationale as
// examples.ts for the playground snippets).

export interface Feature {
  glyph: string;
  title: string;
  // Backtick-wrapped `terms` render as inline <code> on the landing page.
  body: string;
}

export const FEATURES: Feature[] = [
  {
    glyph: "Π Σ",
    title: "Dependent by design",
    body: "Function and tuple types are Π/Σ types — a type can mention a value that came before it, like a vector indexed by its own length.",
  },
  {
    glyph: "≡",
    title: "Proofs, not comments",
    body: "A proof-irrelevant `Prop` sort, propositional equality, and the `refl` / `sym` / `trans` / `cong` toolkit, ready in the standard library.",
  },
  {
    glyph: "μ",
    title: "Indexed inductive types",
    body: "Declare your own data and proof families with index telescopes and per-constructor targets — the same machinery `Vec` and `Eq` are built from.",
  },
  {
    glyph: "@",
    title: "Erased at runtime",
    body: "Mark an argument `@` and it vanishes after type-checking — type parameters, lengths, and proofs steer the checker, then leave no trace in the compiled WebAssembly. Zero runtime cost.",
  },
  {
    glyph: "⇒",
    title: "Ad-hoc polymorphism",
    body: "`concept` and `satisfy` declarations give you typeclass-style interfaces — every operator (`+`, `==`, `<`) dispatches through one, and postfix `!` sequences any `Monad` witness as do-notation.",
  },
  {
    glyph: "▦",
    title: "Patterns, not just tags",
    body: "Destructure tuples and structs in a `let`, lambda, or parameter, and nest match arms arbitrarily across several scrutinees — all checked for overlap and completeness by the compiler.",
  },
];

export interface BenchmarkRow {
  lang: string;
  value: string;
  variant?: "head" | "highlight" | "faint";
}

export interface Benchmark {
  filename: string;
  rows: BenchmarkRow[];
}

export const BENCHMARKS: Benchmark[] = [
  {
    filename: "lcg — integer loop, N=100,000,000",
    rows: [
      { lang: "language", value: "mean · vs best", variant: "head" },
      { lang: "Rust → wasm", value: "268.3 ms · 1.00×" },
      { lang: "AssemblyScript", value: "315.0 ms · 1.17×" },
      { lang: "Curios", value: "444.6 ms · 1.66×", variant: "highlight" },
      { lang: "Grain", value: "29,684 ms · 110.6×", variant: "faint" },
    ],
  },
  {
    filename: "trees — allocation, D=21",
    rows: [
      { lang: "language", value: "mean · vs best", variant: "head" },
      { lang: "Rust → wasm", value: "123.8 ms · 1.00×" },
      { lang: "AssemblyScript", value: "226.4 ms · 1.83×" },
      { lang: "Curios", value: "322.2 ms · 2.60×", variant: "highlight" },
      { lang: "Grain", value: "1,781.8 ms · 14.4×", variant: "faint" },
    ],
  },
];
