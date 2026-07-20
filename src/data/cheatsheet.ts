export interface CheatsheetEntry {
  examples: string[][];
  note: string;
}

export interface CheatsheetSection {
  title: string;
  entries: CheatsheetEntry[];
}

// Each entry holds one or more examples; an example is an array of
// pre-highlighted HTML lines (same convention as HERO_SNIPPET):
// .kw keywords, .ty types/sorts, .cm comments, .str strings.
// Examples render side by side within their row, separated by hairlines.
// Notes render on the right of each row; backticks become <code>.
export const CHEATSHEET: CheatsheetSection[] = [
  {
    title: "modules",
    entries: [
      {
        examples: [['<span class="kw">use</span> /std/{<span class="ty">Nat</span>, <span class="ty">Bool</span>};']],
        note: "bring modules into scope",
      },
      {
        examples: [['<span class="kw">pub use</span> Option/*;']],
        note: "re-export a module's contents",
      },
      {
        examples: [['<span class="kw">pub mod</span> <span class="ty">Nat</span>;']],
        note: "load `Nat.crs` as a submodule",
      },
      {
        examples: [[
          '<span class="kw">pub mod</span> <span class="ty">Internal</span>',
          '    <span class="kw">pub let</span> value : <span class="ty">Nat</span> = 1;',
          '<span class="kw">end</span>',
        ]],
        note: "inline module, closed by `end`",
      },
    ],
  },
  {
    title: "bindings",
    entries: [
      {
        examples: [['<span class="kw">let</span> increment(n : <span class="ty">Nat</span>) -&gt; <span class="ty">Nat</span> = n + 1;']],
        note: "function sugar — a lambda with a telescope",
      },
      {
        examples: [['<span class="kw">let</span> (a, b) = pair;']],
        note: "destructuring, not a match",
      },
      {
        examples: [['<span class="kw">let</span> Point { x = px, y = py } = point;']],
        note: "any irrefutable pattern works in a binder",
      },
      {
        examples: [['(x : <span class="ty">Nat</span>) =&gt; x + 1']],
        note: "a lambda — annotate only when context doesn't supply the type",
      },
      {
        examples: [["(Point { x, y }) =&gt; x + y"]],
        note: "lambda parameters take irrefutable patterns too",
      },
    ],
  },
  {
    title: "types",
    entries: [
      {
        examples: [['(x : <span class="ty">Nat</span>, y : <span class="ty">Nat</span>) -&gt; <span class="ty">Nat</span>']],
        note: "Π — later parts see earlier names",
      },
      {
        examples: [['(@A : <span class="ty">Type</span>, x : A) -&gt; A']],
        note: "`@` is implicit, erased at runtime",
      },
      {
        examples: [['(@A : <span class="ty">Type</span>, <span class="kw">use</span> <span class="ty">Show</span>(A), v : A) -&gt; <span class="ty">Str</span>']],
        note: "`use` asks for a witness",
      },
      {
        examples: [['{value : A, proof : <span class="ty">Valid</span>(value)}']],
        note: "Σ — data plus its receipt",
      },
      {
        examples: [['f(@<span class="ty">Nat</span>, x)']],
        note: "supply an implicit at the call — omitted ones are inferred",
      },
    ],
  },
  {
    title: "tuples",
    entries: [
      {
        examples: [["(1, true)"], ["(left = 1, right = true)"]],
        note: "tuple values — fields may be labeled",
      },
      {
        examples: [["pair.0"], ["pair.fst"], ["config.network.port"]],
        note: "projection, positional or labeled — chains freely",
      },
      {
        examples: [["()"]],
        note: "the unit value; its type is the empty tuple `{}`",
      },
    ],
  },
  {
    title: "inductive types",
    entries: [
      {
        examples: [[
          '<span class="kw">pub induct</span> <span class="ty">Vec</span>(T : <span class="ty">Type</span>) : (n : <span class="ty">Nat</span>) -&gt; <span class="kw">pub</span> <span class="ty">Type</span>',
          "| nil() : (0)",
          '| cons(@m : <span class="ty">Nat</span>, x : T, xs : <span class="ty">Vec</span>(T, m)) : (m + 1)',
          '<span class="kw">end</span>',
        ]],
        note: "an indexed family — the length lives in the type",
      },
    ],
  },
  {
    title: "structs",
    entries: [
      {
        examples: [['<span class="kw">pub struct</span> <span class="ty">Point</span> : <span class="kw">pub</span> <span class="ty">Type</span> { x : <span class="ty">Nat</span>, y : <span class="ty">Nat</span> }']],
        note: "a nominal dependent record",
      },
      {
        examples: [['<span class="kw">let</span> p : <span class="ty">Point</span> = Point { x = 1, y = 2 };']],
        note: "construct with labels",
      },
      {
        examples: [['<span class="kw">let</span> q : <span class="ty">Point</span> = Point { ..p, y = 9 };']],
        note: "`..p` copies the rest, overrides follow",
      },
      {
        examples: [["p.x + q.y"]],
        note: "project with a dot",
      },
    ],
  },
  {
    title: "pattern matching",
    entries: [
      {
        examples: [[
          '<span class="kw">match</span> (left, right)',
          "| (some(x), some(y)) =&gt; x + y",
          "| (some(x), none()) =&gt; x",
          "| (none(), _) =&gt; 0",
          '<span class="kw">end</span>',
        ]],
        note: "several scrutinees — checked for overlap and completeness",
      },
      {
        examples: [['<span class="kw">match</span> option | some(v) =&gt; consume(v) | _ =&gt; fallback <span class="kw">end</span>']],
        note: "a final bare `_` covers the constructors not named",
      },
      {
        examples: [['<span class="kw">match</span> tag | 0 =&gt; first | 1 =&gt; second | _ =&gt; otherwise <span class="kw">end</span>']],
        note: "literal dispatch — the `_` default is mandatory",
      },
      {
        examples: [[
          '<span class="kw">match</span> bits',
          "| b\\ =&gt; base",
          "| b\\head\\..tail; hyp =&gt; step(head, hyp)",
          '<span class="kw">end</span>',
        ]],
        note: "packed folds — a `Bits` head is `Bool`, a `Bytes` head is `Byte`",
      },
    ],
  },
  {
    title: "condition ladders",
    entries: [
      {
        examples: [[
          '<span class="kw">match</span>',
          "| prefer_fresh &amp;&amp; fresh &gt; 0 =&gt; fresh",
          "| some(n) = cached =&gt; n",
          "| _ =&gt; 0",
          '<span class="kw">end</span>',
        ]],
        note: "no scrutinee — tried top to bottom, `some(n) = cached` is a bind-arm, final `_` is mandatory",
      },
    ],
  },
  {
    title: "folds & induction",
    entries: [
      {
        examples: [[
          '<span class="kw">match</span> n : (m) =&gt; P(m)',
          "| 0 =&gt; base",
          "| pred + 1; hyp =&gt; step(pred, hyp)",
          '<span class="kw">end</span>',
        ]],
        note: "the motive names the result family; `; hyp` binds the result for the smaller structure",
      },
      {
        examples: [[
          '<span class="kw">match</span> values',
          "| [] =&gt; 0",
          "| [head, ..tail]; sum =&gt; head + sum",
          '<span class="kw">end</span>',
        ]],
        note: "a fold, for free",
      },
      {
        examples: [[
          '<span class="kw">rec</span> even(n : <span class="ty">Nat</span>) -&gt; <span class="ty">Bool</span> =',
          '    <span class="kw">match</span> n | 0 =&gt; true | p + 1; _ =&gt; odd(p) <span class="kw">end</span>',
          '<span class="kw">and</span> odd(n : <span class="ty">Nat</span>) -&gt; <span class="ty">Bool</span> =',
          '    <span class="kw">match</span> n | 0 =&gt; false | p + 1; _ =&gt; even(p) <span class="kw">end</span>;',
          "even(input)",
        ]],
        note: "`rec` members need types; `and` joins a mutual group, one `;` ends it",
      },
    ],
  },
  {
    title: "operators",
    entries: [
      {
        examples: [["a + b"], ["a == b"], ["a &amp;&amp; b"]],
        note: "whitespace required, left-associative — each dispatches through a concept (`Add`, `Eql`, `And`)",
      },
    ],
  },
  {
    title: "concepts",
    entries: [
      {
        examples: [[
          '<span class="kw">pub concept</span> <span class="ty">Show</span>(A : <span class="ty">Type</span>) : <span class="ty">Type</span> {',
          '    show(A) -&gt; <span class="ty">Str</span>,',
          "}",
        ]],
        note: "a typeclass-style interface",
      },
      {
        examples: [['<span class="kw">satisfy</span> <span class="ty">Show</span>(<span class="ty">Nat</span>) { show(n) = Nat/to_str(n) }']],
        note: "one witness per key, program-wide",
      },
      {
        examples: [[
          '<span class="kw">let</span> join(@A : <span class="ty">Type</span>, <span class="kw">use</span> <span class="ty">Show</span>(A), v : A) -&gt; <span class="ty">Str</span> =',
          "    Show/show(v);",
        ]],
        note: "resolved silently at the call site",
      },
      {
        examples: [[
          '<span class="kw">pub concept</span> <span class="ty">Ord</span>(A : <span class="ty">Type</span>) : <span class="ty">Type</span> {',
          '    <span class="kw">use</span> <span class="ty">Eql</span>(A),',
          '    cmp(A, A) -&gt; <span class="ty">Order</span>,',
          "}",
        ]],
        note: "a `use` field is a superclass edge — satisfiable by projection",
      },
      {
        examples: [[
          '<span class="kw">satisfy</span> (@A : <span class="ty">Type</span>, <span class="kw">use</span> <span class="ty">Show</span>(A)) =&gt; <span class="ty">Show</span>(<span class="ty">Lst</span>(A)) {',
          '    show(values) = Lst/fold(values, <span class="str">""</span>, (v, r) =&gt; Str/concat(r, Show/show(v))),',
          "}",
        ]],
        note: "a parameterized witness — its premises resolve recursively",
      },
      {
        examples: [[
          '<span class="kw">let</span> reverse : <span class="ty">Ord</span>(<span class="ty">Nat</span>) = Ord { cmp(a, b) = compare_reverse(a, b) };',
          'sort(<span class="kw">use</span> reverse, values)',
        ]],
        note: "override resolution — pass an ordinary concept value with `use`",
      },
    ],
  },
  {
    title: "monads",
    entries: [
      {
        examples: [[
          '<span class="kw">let</span> sum(a : <span class="ty">Option</span>(<span class="ty">Nat</span>), b : <span class="ty">Option</span>(<span class="ty">Nat</span>)) -&gt; <span class="ty">Option</span>(<span class="ty">Nat</span>) =',
          '    <span class="kw">let</span> x = a!;',
          '    <span class="kw">let</span> y = b!;',
          "    Option/some(x + y);",
        ]],
        note: "postfix `!` is `Monad/bind` — every body is a do-block",
      },
    ],
  },
  {
    title: "proofs",
    entries: [
      {
        examples: [[
          '<span class="kw">pub let</span> sym(@A : <span class="ty">Type</span>, @x : A, @y : A, p : <span class="ty">Eq</span>(x, y)) -&gt; <span class="ty">Eq</span>(y, x) =',
          '    <span class="kw">match</span> p : (q : <span class="ty">Eq</span>(A, s, t)) =&gt; <span class="ty">Eq</span>(t, s)',
          "    | refl(z) =&gt; Eq/refl()",
          '    <span class="kw">end</span>;',
        ]],
        note: "match on the proof — all of it erases before runtime",
      },
    ],
  },
  {
    title: "goals",
    entries: [
      {
        examples: [['<span class="kw">let</span> todo : <span class="ty">Nat</span> = ?;']],
        note: "a written goal — reports scope and expected type, then fails the build",
      },
    ],
  },
  {
    title: "foreign",
    entries: [
      {
        examples: [[
          '<span class="kw">foreign</span> random : <span class="ty">Nat</span>;',
          '<span class="kw">pub foreign</span> log : (<span class="ty">Bin</span>) -&gt; <span class="ty">Nat</span>;',
        ]],
        note: "implemented by the embedder — wire types only, `Bin` arrives as `Bytes`",
      },
    ],
  },
  {
    title: "literals",
    entries: [
      {
        examples: [["[1, ..rest, 9]"]],
        note: "list literal, spread anywhere",
      },
      {
        examples: [["b\\1\\0\\1"]],
        note: "packed `Bits`, LSB first",
      },
      {
        examples: [["x\\48\\69\\..suffix"]],
        note: "packed `Bytes`, with spread",
      },
      {
        examples: [['<span class="str">\'λ\'</span>'], ['<span class="str">"hello\\n"</span>'], ["0xFF"], ["1.0e9"]],
        note: "`Char`, `Str`, numbers typed by context",
      },
    ],
  },
];
