export interface CheatsheetEntry {
  examples: string[][];
  note: string;
}

export interface CheatsheetSection {
  title: string;
  column: 1 | 2;
  entries: CheatsheetEntry[];
}

// Each entry holds one or more examples; an example is an array of
// pre-highlighted HTML lines (same convention as HERO_SNIPPET):
// .kw keywords, .ty types/sorts, .cm comments, .str strings.
// Examples render side by side within their row, separated by hairlines.
// Notes render on the right of each row; backticks become <code>.
// Sections are ordered least to most complex.
// `column` hand-assigns each section to a cheatsheet column (1 left, 2 right);
// rebalance by eye when sections grow or shrink.
export const CHEATSHEET: CheatsheetSection[] = [
  {
    title: "modules",
    column: 1,
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
        note: "load `Nat.crs` as a submodule — only resolves in the native compiler, where a file system backs it",
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
    title: "literals",
    column: 1,
    entries: [
      {
        examples: [["[1, ..rest, 9]"]],
        note: "list literal, spread anywhere",
      },
      {
        examples: [["b[\\1, \\0, \\1]"]],
        note: "packed `Bits`, LSB first — the grain letter glues to the `[`",
      },
      {
        examples: [["x[\\48, \\69, ..suffix]"]],
        note: "packed `Bytes` — `\\` marks a constant atom, `..` spreads a whole value",
      },
      {
        examples: [["b[flag, ..rest]"], ["x[..acc, byte]"]],
        note: "an unescaped entry is an ordinary term contributing one atom — cons and append, with no named form",
      },
      {
        examples: [['<span class="str">\'λ\'</span>'], ['<span class="str">"hello\\n"</span>'], ["0xFF"], ["1.0e9"]],
        note: "`Char`, `Str`, numbers typed by context",
      },
    ],
  },
  {
    title: "bindings",
    column: 1,
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
    title: "operators",
    column: 2,
    entries: [
      {
        examples: [["a + b"], ["a == b"], ["a &amp;&amp; b"]],
        note: "whitespace required on both sides, left-associative — each dispatches through a concept (`Add`, `Eql`, `And`); a path is the opposite and takes none, so `a / b` divides and `a/b` names",
      },
    ],
  },
  {
    title: "tuples",
    column: 1,
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
    title: "structs",
    column: 1,
    entries: [
      {
        examples: [[
          '<span class="kw">pub struct</span> <span class="ty">Point</span> : <span class="kw">pub</span> <span class="ty">Type</span> {',
          '    x : <span class="ty">Nat</span>,',
          '    y : <span class="ty">Nat</span>',
          "}",
        ]],
        note: "a nominal dependent record",
      },
      {
        examples: [[
          '<span class="kw">let</span> p : <span class="ty">Point</span> = Point {',
          "    x = 1,",
          "    y = 2",
          "};",
        ]],
        note: "construct with labels",
      },
      {
        examples: [[
          '<span class="kw">let</span> q : <span class="ty">Point</span> = Point {',
          "    ..p,",
          "    y = 9",
          "};",
        ]],
        note: "`..p` copies the rest, overrides follow",
      },
      {
        examples: [["p.x + q.y"]],
        note: "project with a dot",
      },
    ],
  },
  {
    title: "types",
    column: 1,
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
    title: "inductive types",
    column: 1,
    entries: [
      {
        examples: [[
          '<span class="kw">pub induct</span> <span class="ty">Vec</span>(T : <span class="ty">Type</span>) : (<span class="ty">Nat</span>) -&gt; <span class="kw">pub</span> <span class="ty">Type</span>',
          "| nil() : (0)",
          '| cons(@m : <span class="ty">Nat</span>, x : T, xs : <span class="ty">Vec</span>(T, m)) : (m + 1)',
          '<span class="kw">end</span>',
        ]],
        note: "an indexed family — the length lives in the type",
      },
    ],
  },
  {
    title: "pattern matching",
    column: 2,
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
        examples: [[
          '<span class="kw">match</span> option',
          "| some(v) =&gt; consume(v)",
          "| _ =&gt; fallback",
          '<span class="kw">end</span>',
        ]],
        note: "a final bare `_` covers the constructors not named",
      },
      {
        examples: [[
          '<span class="kw">match</span> tag',
          "| 0 =&gt; first",
          "| 1 =&gt; second",
          "| _ =&gt; otherwise",
          '<span class="kw">end</span>',
        ]],
        note: "literal dispatch — the `_` default is mandatory",
      },
      {
        examples: [[
          '<span class="kw">match</span> bits',
          "| b[] =&gt; base",
          "| b[head, ..tail]; hyp =&gt; step(head, hyp)",
          '<span class="kw">end</span>',
        ]],
        note: "packed folds — a `Bits` head is `Bool`, a `Bytes` head is `Byte`",
      },
    ],
  },
  {
    title: "condition ladders",
    column: 1,
    entries: [
      {
        examples: [[
          '<span class="kw">choose</span>',
          "| prefer_fresh &amp;&amp; fresh &gt; 0 =&gt; fresh",
          "| some(n) = cached =&gt; n",
          "| _ =&gt; 0",
          '<span class="kw">end</span>',
        ]],
        note: "`choose` takes no scrutinee — tried top to bottom, `some(n) = cached` is a bind-arm, final `_` is mandatory",
      },
    ],
  },
  {
    title: "folds & induction",
    column: 2,
    entries: [
      {
        examples: [[
          '<span class="kw">match</span> n : (m) =&gt; P(m)',
          "| 0 =&gt; base",
          "| pred + 1; hyp =&gt; step(pred, hyp)",
          '<span class="kw">end</span>',
        ]],
        note: "the motive binds the indices then the scrutinee, and can be left off wherever the elaborator infers it; `; hyp` binds the result for the smaller structure",
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
          '<span class="kw">match</span> n',
          "| 0 =&gt; (0, true)",
          "| pred + 1; (count, live) =&gt; step(count, live)",
          '<span class="kw">end</span>',
        ]],
        note: "the `;` binder names the fold result, not scrutinee shape — so it takes any irrefutable tuple or struct pattern, exactly like a `let`",
      },
      {
        examples: [[
          '<span class="kw">rec</span> even(n : <span class="ty">Nat</span>) -&gt; <span class="ty">Bool</span> =',
          '    <span class="kw">match</span> n',
          "    | 0 =&gt; true",
          "    | p + 1 =&gt; odd(p)",
          '    <span class="kw">end</span>',
          '<span class="kw">and</span> odd(n : <span class="ty">Nat</span>) -&gt; <span class="ty">Bool</span> =',
          '    <span class="kw">match</span> n',
          "    | 0 =&gt; false",
          "    | p + 1 =&gt; even(p)",
          '    <span class="kw">end</span>;',
          "even(input)",
        ]],
        note: "`rec` members need types; `and` joins a mutual group, one `;` ends it",
      },
    ],
  },
  {
    title: "concepts",
    column: 2,
    entries: [
      {
        examples: [[
          '<span class="kw">pub concept</span> <span class="ty">Show</span>(A : <span class="ty">Type</span>) : <span class="kw">pub</span> <span class="ty">Type</span> {',
          '    show(A) -&gt; <span class="ty">Str</span>',
          "}",
        ]],
        note: "a typeclass-style interface",
      },
      {
        examples: [[
          '<span class="kw">satisfy</span> <span class="ty">Show</span>(<span class="ty">Nat</span>) {',
          "    show(n) = Nat/to_str(n)",
          "}",
        ]],
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
          '<span class="kw">pub concept</span> <span class="ty">Ord</span>(A : <span class="ty">Type</span>) : <span class="kw">pub</span> <span class="ty">Type</span> {',
          '    <span class="kw">use</span> <span class="ty">Eql</span>(A),',
          '    cmp(A, A) -&gt; <span class="ty">Order</span>',
          "}",
        ]],
        note: "a `use` field is a superclass edge — satisfiable by projection",
      },
      {
        examples: [[
          '<span class="kw">satisfy</span> (@A : <span class="ty">Type</span>, <span class="kw">use</span> <span class="ty">Show</span>(A)) =&gt; <span class="ty">Show</span>(<span class="ty">List</span>(A)) {',
          "    show(values) =",
          '        List/fold(values, <span class="str">""</span>, (v, r) =&gt;',
          "            Str/concat(r, Show/show(v)))",
          "}",
        ]],
        note: "a parameterized witness — its premises resolve recursively",
      },
      {
        examples: [[
          '<span class="kw">let</span> reverse : <span class="ty">Ord</span>(<span class="ty">Nat</span>) = Ord {',
          "    cmp(a, b) = compare_reverse(a, b)",
          "};",
          'sort(<span class="kw">use</span> reverse, values)',
        ]],
        note: "override resolution — pass an ordinary concept value with `use`",
      },
    ],
  },
  {
    title: "monads",
    column: 2,
    entries: [
      {
        examples: [[
          '<span class="kw">let</span> sum(a : <span class="ty">Option</span>(<span class="ty">Nat</span>), b : <span class="ty">Option</span>(<span class="ty">Nat</span>)) -&gt; <span class="ty">Option</span>(<span class="ty">Nat</span>) =',
          '    <span class="kw">let</span> x = a!;',
          '    <span class="kw">let</span> y = b!;',
          "    Option/some(x + y);",
        ]],
        note: "postfix `!` is `Monad/bind` — every body is a do-block, and the region's monad is read from its type, never from the action",
      },
      {
        examples: [['<span class="kw">let</span> greeting : <span class="ty">Io</span>({}) = print(<span class="str">"hi"</span>);']],
        note: "a host call builds an `Io` description and performs nothing — a program's tail is one `Io({})`, forced once",
      },
      {
        examples: [[
          '<span class="kw">let</span> fiber : <span class="ty">Async</span>({}) =',
          '    <span class="kw">let</span> _ = print(<span class="str">"hi\\n"</span>)!;',
          "    Async/pure(());",
        ]],
        note: "a cross-monad action lifts through the declared `Lift` witness — `/std/Async` declares `Lift(Io, Async)`; edges never chain",
      },
      {
        examples: [[
          '<span class="kw">satisfy</span> (@S : <span class="ty">Type</span>) =&gt;',
          '        <span class="ty">Monad</span>((A : <span class="ty">Type</span>) =&gt; <span class="ty">State</span>(S, A)) {',
          "    pure(@A, a) = State/pure(a),",
          "    bind(@A, @B, m, f) = State/bind(m, f)",
          "}",
        ]],
        note: "a witness may key on a partially applied family — which is why `State(S, A)` and `Throw(E, A)` put the result parameter last",
      },
    ],
  },
  {
    title: "proofs",
    column: 2,
    entries: [
      {
        examples: [[
          '<span class="kw">let</span> sym(@x : <span class="ty">Nat</span>, @y : <span class="ty">Nat</span>, p : <span class="ty">Eq</span>(x, y)) -&gt; <span class="ty">Eq</span>(y, x) =',
          '    <span class="kw">match</span> p : (s, t, q) =&gt; <span class="ty">Eq</span>(t, s)',
          "    | refl(@z) =&gt; Eq/refl()",
          '    <span class="kw">end</span>;',
        ]],
        note: "match on the proof — all of it erases before runtime",
      },
    ],
  },
  {
    title: "goals",
    column: 1,
    entries: [
      {
        examples: [['<span class="kw">let</span> todo : <span class="ty">Nat</span> = ?;']],
        note: "a written goal — the report gives scope, expected type, and verified candidate fits, then the build exits 2",
      },
    ],
  },
  {
    title: "foreign",
    column: 2,
    entries: [
      {
        examples: [[
          '<span class="kw">foreign</span> random : <span class="ty">Nat</span>;',
          '<span class="kw">pub foreign</span> log : (<span class="ty">Bytes</span>) -&gt; <span class="ty">Nat</span>;',
        ]],
        note: "implemented by the embedder — wire types only: `Nat`, `Int`, `Bool`, `Bytes`, `Handle`, `List(T)`; a call to one yields an `Io`",
      },
    ],
  },
];
