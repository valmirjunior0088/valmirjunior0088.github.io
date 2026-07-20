export interface CheatCard {
  filename: string;
  blurb: string;
  lines: string[];
}

// Lines are pre-highlighted HTML (same convention as HERO_SNIPPET):
// .kw keywords, .ty types/sorts, .cm comments, .str strings.
export const CHEATSHEET: CheatCard[] = [
  {
    filename: "bindings.crs",
    blurb:
      "A local `let` binds through its `;`. Binders take irrefutable tuple and struct patterns — projection sugar, no dispatch.",
    lines: [
      '<span class="cm">-- function sugar is a lambda with a telescope</span>',
      '<span class="kw">let</span> increment(n : <span class="ty">Nat</span>) -&gt; <span class="ty">Nat</span> = n + 1;',
      '<span class="kw">let</span> (a, b) = pair;         <span class="cm">-- destructuring, not a match</span>',
      '<span class="kw">let</span> Point { x = px, y = py } = point;',
      "increment(a + px)",
    ],
  },
  {
    filename: "types.crs",
    blurb:
      "Function and tuple types are dependent telescopes — anything later may lean on anything earlier.",
    lines: [
      '(x : <span class="ty">Nat</span>, y : <span class="ty">Nat</span>) -&gt; <span class="ty">Nat</span>    <span class="cm">-- Π: later parts see earlier names</span>',
      '(@A : <span class="ty">Type</span>, x : A) -&gt; A     <span class="cm">-- @ = implicit, erased at runtime</span>',
      '(@A : <span class="ty">Type</span>, <span class="kw">use</span> <span class="ty">Show</span>(A), v : A) -&gt; <span class="ty">Str</span>',
      '{value : A, proof : <span class="ty">Valid</span>(value)}  <span class="cm">-- Σ: data plus its receipt</span>',
    ],
  },
  {
    filename: "induct.crs",
    blurb:
      "Each constructor states the indices it produces. The outer `pub` exports the name; the inner one, the representation.",
    lines: [
      '<span class="cm">-- an indexed family: the length lives in the type</span>',
      '<span class="kw">pub induct</span> <span class="ty">Vec</span>(T : <span class="ty">Type</span>) : (n : <span class="ty">Nat</span>) -&gt; <span class="kw">pub</span> <span class="ty">Type</span>',
      "| nil() : (0)",
      '| cons(@m : <span class="ty">Nat</span>, x : T, xs : <span class="ty">Vec</span>(T, m)) : (m + 1)',
      '<span class="kw">end</span>',
    ],
  },
  {
    filename: "struct.crs",
    blurb:
      "Nominal dependent records. `..base` copies the rest; labeled overrides follow in declaration order.",
    lines: [
      '<span class="kw">pub struct</span> <span class="ty">Point</span> : <span class="kw">pub</span> <span class="ty">Type</span> { x : <span class="ty">Nat</span>, y : <span class="ty">Nat</span> }',
      "",
      '<span class="kw">let</span> p : <span class="ty">Point</span> = Point { x = 1, y = 2 };',
      '<span class="kw">let</span> q : <span class="ty">Point</span> = Point { ..p, y = 9 };  <span class="cm">-- copy p, override y</span>',
      "p.x + q.y",
    ],
  },
  {
    filename: "match.crs",
    blurb:
      "Several scrutinees at once, columns considered left to right — checked for overlap and completeness, no row priority.",
    lines: [
      '<span class="kw">match</span> (left, right)',
      "| (some(x), some(y)) =&gt; x + y",
      "| (some(x), none()) =&gt; x",
      "| (none(), _) =&gt; 0",
      '<span class="kw">end</span>',
    ],
  },
  {
    filename: "cond.crs",
    blurb:
      "No scrutinee: an ordered condition ladder, tried top to bottom. The final `_` is mandatory.",
    lines: [
      '<span class="kw">match</span>',
      "| prefer_fresh &amp;&amp; fresh &gt; 0 =&gt; fresh",
      '| some(n) = cached =&gt; n   <span class="cm">-- bind-arm: fires when it matches</span>',
      "| _ =&gt; 0",
      '<span class="kw">end</span>',
    ],
  },
  {
    filename: "fold.crs",
    blurb:
      "The binder after `;` receives the result for the smaller structure — induction and folds without writing `rec`.",
    lines: [
      '<span class="kw">match</span> n : (m) =&gt; P(m)       <span class="cm">-- the motive</span>',
      "| 0 =&gt; base",
      "| pred + 1; hyp =&gt; step(pred, hyp)",
      '<span class="kw">end</span>',
      "",
      '<span class="kw">match</span> values',
      "| [] =&gt; 0",
      '| [head, ..tail]; sum =&gt; head + sum  <span class="cm">-- a fold, for free</span>',
      '<span class="kw">end</span>',
    ],
  },
  {
    filename: "concept.crs",
    blurb:
      "Typeclass-style interfaces. `satisfy` registers a witness — one per key, program-wide — and `use` binders resolve silently at call sites.",
    lines: [
      '<span class="kw">pub concept</span> <span class="ty">Show</span>(A : <span class="ty">Type</span>) : <span class="ty">Type</span> {',
      '    show(A) -&gt; <span class="ty">Str</span>,',
      "}",
      "",
      '<span class="kw">satisfy</span> <span class="ty">Show</span>(<span class="ty">Nat</span>) { show(n) = Nat/to_str(n) }',
      "",
      '<span class="kw">let</span> join(@A : <span class="ty">Type</span>, <span class="kw">use</span> <span class="ty">Show</span>(A), v : A) -&gt; <span class="ty">Str</span> =',
      "    Show/show(v);",
    ],
  },
  {
    filename: "monad.crs",
    blurb:
      "Postfix `!` is `Monad/bind`. Every value body is already a do-block — no header, no `end`.",
    lines: [
      '<span class="kw">let</span> sum(a : <span class="ty">Option</span>(<span class="ty">Nat</span>), b : <span class="ty">Option</span>(<span class="ty">Nat</span>)) -&gt; <span class="ty">Option</span>(<span class="ty">Nat</span>) =',
      '    <span class="kw">let</span> x = a!;',
      '    <span class="kw">let</span> y = b!;',
      "    Option/some(x + y);",
    ],
  },
  {
    filename: "proof.crs",
    blurb:
      "`Eq` is an ordinary indexed inductive in `Prop`. Match on a proof like any other value — all of it erases before runtime.",
    lines: [
      '<span class="cm">-- symmetry, proved by matching on the proof</span>',
      '<span class="kw">pub let</span> sym(@A : <span class="ty">Type</span>, @x : A, @y : A, p : <span class="ty">Eq</span>(x, y)) -&gt; <span class="ty">Eq</span>(y, x) =',
      '    <span class="kw">match</span> p : (q : <span class="ty">Eq</span>(A, s, t)) =&gt; <span class="ty">Eq</span>(t, s)',
      "    | refl(z) =&gt; Eq/refl()",
      '    <span class="kw">end</span>;',
    ],
  },
  {
    filename: "mod.crs",
    blurb:
      "Paths are `/`-separated; a leading `/` is absolute. A file is a module; an inline one ends with `end`.",
    lines: [
      '<span class="kw">use</span> /std/{<span class="ty">Nat</span>, <span class="ty">Bool</span>};      <span class="cm">-- import</span>',
      '<span class="kw">pub use</span> Option/*;         <span class="cm">-- re-export</span>',
      '<span class="kw">pub mod</span> <span class="ty">Nat</span>;              <span class="cm">-- loads Nat.crs</span>',
      '<span class="kw">pub mod</span> <span class="ty">Internal</span>',
      '    <span class="kw">pub let</span> value : <span class="ty">Nat</span> = 1;',
      '<span class="kw">end</span>',
    ],
  },
  {
    filename: "literal.crs",
    blurb:
      "Literals for lists, packed bits and bytes, certified `Char`, UTF-8 `Str`, and numbers that pick their type from context.",
    lines: [
      '[1, ..rest, 9]            <span class="cm">-- list spread, any position</span>',
      'b\\1\\0\\1                   <span class="cm">-- packed Bits, LSB first</span>',
      'x\\48\\69\\..suffix          <span class="cm">-- packed Bytes + spread</span>',
      '<span class="str">\'λ\'</span>  <span class="str">"hello\\n"</span>  0xFF  1.0e9',
    ],
  },
];
