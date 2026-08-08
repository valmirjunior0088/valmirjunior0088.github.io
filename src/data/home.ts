export interface Feature {
  glyph: string;
  title: string;
  body: string;
}

export const FEATURES: Feature[] = [
  {
    glyph: "ΠΣ",
    title: "Dependent by design",
    body: "Function and tuple types are Π/Σ types — a type can mention a value that came before it, like a vector indexed by its own length.",
  },
  {
    glyph: "μ",
    title: "Indexed inductive types",
    body: "Declare your own data and proof families with index telescopes and per-constructor targets — the same machinery `Vec` and `Eq` are built from.",
  },
  {
    glyph: "≡",
    title: "Proofs, not comments",
    body: "A proof-irrelevant `Prop` sort, propositional equality, and the `refl` / `sym` / `trans` / `cong` toolkit, ready in the standard library — state an equation as a type and prove it by matching.",
  },
  {
    glyph: "@",
    title: "Erased at runtime",
    body: "Mark an argument `@` and it vanishes after type-checking — type parameters, lengths, and proofs steer the checker, then leave no trace in the compiled WebAssembly. Zero runtime cost.",
  },
  {
    glyph: "{·}",
    title: "Patterns, not just tags",
    body: "Destructure tuples and structs in a `let`, lambda, or parameter, and nest match arms across several scrutinees — checked for overlap and completeness. Match on plain literals and packed `Bits`/`Bytes`, not only constructor tags.",
  },
  {
    glyph: "=>",
    title: "Ad-hoc polymorphism",
    body: "`concept` and `satisfy` declarations give you typeclass-style interfaces — every operator (`+`, `==`, `<`) dispatches through one. Mark a concept's sort `pub` to expose its witness record, or leave it sealed behind the interface.",
  },
  {
    glyph: "≤",
    title: "Universes, inferred",
    body: "`Type` is a cumulative hierarchy, so a type of types is just another type — and the levels are inferred rather than written. You never annotate one to make a definition fit.",
  },
  {
    glyph: "⊢",
    title: "A second opinion",
    body: "An independent kernel re-checks every compilation from the finished terms alone — strict positivity, termination, erasure, universes. Still being refined, and a second opinion rather than a proof of soundness.",
  },
  {
    glyph: "Io",
    title: "Effects are data",
    body: "Every host operation — printing, clocks, sockets — returns an `Io` description; calling one performs nothing, and nothing turns an `Io(T)` back into a `T`. The program's tail is the one description the runtime forces.",
  },
  {
    glyph: "!",
    title: "Do-notation everywhere",
    body: "Postfix `!` is monadic bind, so every body is a do-block — `Option`, `Parse`, `Async`, `Io` alike. An action from another monad lifts through a declared `Lift` edge: `/std/Async` embeds `Io`, so a fiber prints without ceremony.",
  },
];

export interface StdlibModule {
  name: string;
  body: string;
}

export const STDLIB_MODULES: StdlibModule[] = [
  {
    name: "/std/http",
    body: "Request/response over TCP or TLS, every call an `Async`.",
  },
  {
    name: "/std/Json",
    body: "A full codec — encode, decode, and the `Json` tree between.",
  },
  {
    name: "/std/Toml",
    body: "A full TOML 1.0.0 codec — parse, print, and every conflict caught.",
  },
  {
    name: "/std/Async",
    body: "Cooperative fibers and tasks — `spawn`, `join`, `cancel`, `race`.",
  },
  {
    name: "/std/Io",
    body: "Host effects as descriptions — performed once, at the program's tail.",
  },
  {
    name: "/std/Parse",
    body: "Parser combinators — the HTTP decoder is written in them.",
  },
  {
    name: "/std/Map",
    body: "A canonical crit-bit trie: same entries, same shape.",
  },
  {
    name: "/std/Fmt",
    body: "Format strings whose argument types are computed by the checker.",
  },
  {
    name: "/std/Str",
    body: "Proof-carrying UTF-8; every `Char` is a certified Unicode scalar.",
  },
  {
    name: "/std/BigNat",
    body: "Arbitrary precision, with machine-checked arithmetic laws.",
  },
];

// Pre-highlighted HTML lines, same convention as HERO_SNIPPET:
// .kw keywords, .ty types/sorts, .cm comments, .str strings.
export const STDLIB_SNIPPET = {
  filename: "pulse.crs",
  lines: [
    '<span class="kw">use</span> /std/{<span class="ty">Async</span>, http, <span class="ty">Parse</span>, <span class="ty">Json</span>, <span class="ty">Result</span>, <span class="ty">Fmt</span>, <span class="ty">Io</span>, print};',
    "",
    '<span class="cm">-- race two TLS mirrors, decode whichever answers first</span>',
    '<span class="kw">let</span> pulse : <span class="ty">Async</span>({}) =',
    '    <span class="kw">let</span> reply = Async/race([',
    '        http/perform(http/get_tls(<span class="str">"eu.api.dev"</span>, 443, <span class="str">"/"</span>)),',
    '        http/perform(http/get_tls(<span class="str">"us.api.dev"</span>, 443, <span class="str">"/"</span>))',
    "    ])!;",
    '    <span class="cm">-- build the report as an Io description&hellip;</span>',
    '    <span class="kw">let</span> report : <span class="ty">Io</span>({}) = <span class="kw">match</span> reply',
    "    | success(r) =&gt;",
    '        <span class="kw">match</span> Parse/run(Json/decode, r.body)',
    '        | success(j) =&gt; Fmt/print(<span class="str">"pulse = %\\n"</span>)(Json/encode(j))',
    '        | failure(e) =&gt; Fmt/print(<span class="str">"bad json: %\\n"</span>)(e)',
    '        <span class="kw">end</span>',
    '    | failure(_) =&gt; print(<span class="str">"both mirrors down\\n"</span>)',
    '    <span class="kw">end</span>;',
    '    <span class="cm">-- &hellip;the ! sequences it here, lifted Io &rarr; Async</span>',
    '    <span class="kw">let</span> _ = report!;',
    "    Async/pure(());",
    "",
    "Async/run(pulse)",
  ],
};

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
      { lang: "Rust → wasm", value: "261.3 ms · 1.00×" },
      { lang: "AssemblyScript", value: "316.3 ms · 1.21×" },
      { lang: "Curios", value: "438.4 ms · 1.68×", variant: "highlight" },
      { lang: "Grain", value: "29,898 ms · 114.4×", variant: "faint" },
    ],
  },
  {
    filename: "trees — allocation, D=21",
    rows: [
      { lang: "language", value: "mean · vs best", variant: "head" },
      { lang: "Rust → wasm", value: "127.0 ms · 1.00×" },
      { lang: "AssemblyScript", value: "232.1 ms · 1.83×" },
      { lang: "Curios", value: "260.0 ms · 2.05×", variant: "highlight" },
      { lang: "Grain", value: "1,787 ms · 14.1×", variant: "faint" },
    ],
  },
];
