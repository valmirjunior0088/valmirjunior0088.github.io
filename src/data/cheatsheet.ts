export interface CheatsheetCard {
  title: string;
  tag: string;
  code: string[];
  gloss: string;
}

// One flat, searchable list, ordered least to most complex. It used to be two hand-balanced columns of titled sections; the rail lays cards out in a grid now, so balancing is the layout's job and grouping is the search box's, which leaves ordering as the only thing this file still has to get right.
// Code lines are pre-highlighted markup with exactly one class: .kw, for anything the language reserves. The old four-class scheme collapsed into that on purpose — a block that speaks in one accent reads as one texture rather than a rainbow.
// Glosses mark inline code with backticks; see data/markup.ts.
export const CHEATSHEET: CheatsheetCard[] = [
  {
    title: "Line comments",
    tag: "COMMENTS",
    code: [
      '<span class="kw">--</span> A complete line comment.',
      '<span class="kw">let</span> n = 1; <span class="kw">--</span> A trailing comment.',
    ],
    gloss:
      "`--` and a space open a comment that runs to the end of the line; `--` glued to what follows it is refused rather than read as one. There are no block comments",
  },
  {
    title: "Documentation comments",
    tag: "COMMENTS",
    code: [
      '<span class="kw">-- |</span> Twice the input.',
      '<span class="kw">-- |</span>',
      '<span class="kw">-- |</span> Never overflows, since `Nat` is unbounded.',
      '<span class="kw">pub let</span> double(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Nat</span> =',
      "    n + n;",
    ],
    gloss:
      "`-- |` is syntax rather than a comment: consecutive lines form one block, attached to the declaration below it — a `let`, `induct`, `struct`, `concept`, `satisfy`, `foreign` or `mod`, or a constructor, field or method inside one. `curios document` renders the blocks as the library's pages",
  },
  {
    title: "Absolute and relative paths",
    tag: "PATHS",
    code: ["Nat", "Option/some", "/std/List"],
    gloss:
      "A leading `/` makes the path absolute. Paths are whitespace-free, so `a/b` is the path and `a / b` is the division",
  },
  {
    title: "Bring modules into scope",
    tag: "MODULES",
    code: ['<span class="kw">use</span> /std/{<span class="kw">Nat</span>, <span class="kw">Bool</span>};'],
    gloss: "There is no bare `use path;` form — imports always come through a group",
  },
  {
    title: "Re-export a module's contents",
    tag: "MODULES",
    code: ['<span class="kw">pub use</span> Option/*;'],
    gloss: "Prefixing with `pub` re-exports what it imports; a glob imports the exported surface only",
  },
  {
    title: "Load a submodule from disk",
    tag: "MODULES",
    code: ['<span class="kw">pub mod</span> <span class="kw">Nat</span>;'],
    gloss:
      "Loads from the header's stem directory — `mod Nat;` in `main.crs` reads `main/Nat.crs`; only resolves in the native compiler, where a file system backs it",
  },
  {
    title: "Inline module",
    tag: "MODULES",
    code: [
      '<span class="kw">pub mod</span> <span class="kw">Internal</span>',
      '    <span class="kw">pub let</span> value: <span class="kw">Nat</span> = 1;',
      '<span class="kw">end</span>',
    ],
    gloss: "An inline module, closed by `end`",
  },
  {
    title: "List literal with spreads",
    tag: "LITERALS",
    code: ["[1, ..rest, 9]"],
    gloss: "A list literal; the spread may sit anywhere in it",
  },
  {
    title: "Packed Bits literal",
    tag: "LITERALS",
    code: ["b[1, 0, 1]"],
    gloss: "Packed `Bits`, LSB first — the grain letter glues to the `[`",
  },
  {
    title: "Packed Bytes literal",
    tag: "LITERALS",
    code: ["x[0x48, 0x69, ..suffix]"],
    gloss:
      "Packed `Bytes` — a constant atom is a numeric literal at the grain's element type, in any radix, and `..` spreads a whole packed value. Adjacent constant atoms lower to one packed constant, so a literal written entirely from numerals is constant data with nothing needed to mark it as such",
  },
  {
    title: "Terms inside a packed literal",
    tag: "LITERALS",
    code: ["b[flag, ..rest]", "x[..acc, byte]"],
    gloss:
      "An entry is an ordinary term contributing one atom — a `Bool` in a `Bits` literal, a `Byte` in a `Bytes` literal. `b[h, ..t]` conses and `x[..acc, b]` appends, with no named form",
  },
  {
    title: "Characters, strings, and numbers",
    tag: "LITERALS",
    code: [
      '<span class="kw">\'λ\'</span>',
      '<span class="kw">\'\\u{301}\'</span>',
      '<span class="kw">"hello\\n"</span>',
      "0xFF",
      "1.0e9",
    ],
    gloss:
      "`Char`, `Str`, numbers typed by context. The escapes are `\\n`, `\\t`, `\\r`, `\\\\`, the quote, and `\\u{…}` naming a scalar value by up to six hex digits; a `Char` refuses any other, a `Str` keeps the backslash",
  },
  {
    title: "Infix operators dispatch through concepts",
    tag: "OPERATORS",
    code: ["a + b", "a == b", "a &amp;&amp; b"],
    gloss:
      "Whitespace required on both sides, left-associative — each dispatches through a concept in `/syn` (`Add`, `Equal`, `And`); a path is the opposite and takes none, so `a / b` divides and `a/b` names",
  },
  {
    title: "Division demands its precondition",
    tag: "OPERATORS",
    code: [
      '<span class="kw">match</span> 0 &lt; d',
      "| true =&gt; n / d",
      "| false =&gt; 0",
      '<span class="kw">end</span>',
    ],
    gloss:
      "`/` and `%` also demand the precondition their concept's `Ok` field states — on `Nat`, `Nat/Lt(0, b)`. A literal divisor settles it outright and a guard reduces it away inside the arm, so only a bare `n / d` is refused",
  },
  {
    title: "Top-level let needs a type",
    tag: "DECLARATIONS",
    code: [
      '<span class="kw">pub let</span> zero: <span class="kw">Nat</span> = 0;',
      "",
      '<span class="kw">pub let</span> bump(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Nat</span> =',
      "    n + 1;",
    ],
    gloss:
      "An unannotated top-level binding is not an item at all — it is a local `let` opening the entrypoint's final term",
  },
  {
    title: "Function sugar",
    tag: "BINDINGS",
    code: ['<span class="kw">let</span> increment(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Nat</span> = n + 1;'],
    gloss: "Function sugar — a lambda with a telescope",
  },
  {
    title: "Destructuring in a binder",
    tag: "BINDINGS",
    code: ['<span class="kw">let</span> (a, b) = pair;'],
    gloss: "Destructuring, not a match",
  },
  {
    title: "Struct patterns in a binder",
    tag: "BINDINGS",
    code: ['<span class="kw">let</span> Point { x = px, y = py } = point;'],
    gloss: "Any irrefutable pattern works in a binder",
  },
  {
    title: "Names kept unused on purpose",
    tag: "BINDINGS",
    code: [
      '<span class="kw">let</span> _ = print(<span class="kw">"hi\\n"</span>)!;',
      '<span class="kw">let</span> _width: <span class="kw">Nat</span> = 80;',
    ],
    gloss:
      "`_` alone names nothing; a `_`-prefixed name is one `curios lint` never reports as unused, nor anything inside a `_`-prefixed module. Every other binder, import and private declaration nothing reaches is a lint, and the exit code says so",
  },
  {
    title: "Lambdas",
    tag: "BINDINGS",
    code: ['(x: <span class="kw">Nat</span>) =&gt; x + 1'],
    gloss: "A lambda — annotate only when context doesn't supply the type",
  },
  {
    title: "Patterns in lambda parameters",
    tag: "BINDINGS",
    code: ["(Point { x, y }) =&gt; x + y"],
    gloss: "Lambda parameters take irrefutable patterns too",
  },
  {
    title: "Written goals",
    tag: "GOALS",
    code: ['<span class="kw">let</span> todo: <span class="kw">Nat</span> = ?;'],
    gloss:
      "A written goal — the report gives scope, expected type, and verified candidate fits, then the build exits 2. A goal is never accepted in a successfully compiled program",
  },
  {
    title: "Tuple values",
    tag: "TUPLES",
    code: ["(1, true)", "(left = 1, right = true)"],
    gloss: "Tuple values — fields may be labeled",
  },
  {
    title: "Projection",
    tag: "TUPLES",
    code: ["pair.0", "pair.fst", "config.network.port"],
    gloss: "Projection, positional or labeled — chains freely",
  },
  {
    title: "Unit",
    tag: "TUPLES",
    code: ["()"],
    gloss: "The unit value; its type is the empty tuple `{}`",
  },
  {
    title: "Declare a struct",
    tag: "STRUCTS",
    code: [
      '<span class="kw">pub struct</span> <span class="kw">Point</span>: <span class="kw">pub Type</span> {',
      '    x: <span class="kw">Nat</span>,',
      '    y: <span class="kw">Nat</span>',
      "}",
    ],
    gloss: "A nominal dependent record",
  },
  {
    title: "Construct with labels",
    tag: "STRUCTS",
    code: ['<span class="kw">let</span> p: <span class="kw">Point</span> = Point {', "    x = 1,", "    y = 2", "};"],
    gloss: "Construct with labels",
  },
  {
    title: "Copy the rest, then override",
    tag: "STRUCTS",
    code: ['<span class="kw">let</span> q: <span class="kw">Point</span> = Point {', "    ..p,", "    y = 9", "};"],
    gloss: "`..p` copies the rest, overrides follow",
  },
  {
    title: "Project with a dot",
    tag: "STRUCTS",
    code: ["p.x + q.y"],
    gloss: "Project with a dot",
  },
  {
    title: "Match several scrutinees at once",
    tag: "MATCH",
    code: [
      '<span class="kw">match</span> (left, right)',
      "| (some(x), some(y)) =&gt; x + y",
      "| (some(x), none()) =&gt; x",
      "| (none(), _) =&gt; 0",
      '<span class="kw">end</span>',
    ],
    gloss: "Several scrutinees — checked for overlap and completeness",
  },
  {
    title: "Dispatch default arm",
    tag: "MATCH",
    code: [
      '<span class="kw">match</span> option',
      "| some(v) =&gt; consume(v)",
      "| _ =&gt; fallback",
      '<span class="kw">end</span>',
    ],
    gloss:
      "Only a bare `_` in final position is a default. A named binder is not a catch-all, and nested wildcard defaults are not accepted",
  },
  {
    title: "Literal dispatch",
    tag: "MATCH",
    code: [
      '<span class="kw">match</span> tag',
      "| 0 =&gt; first",
      "| 1 =&gt; second",
      "| _ =&gt; otherwise",
      '<span class="kw">end</span>',
    ],
    gloss: "Literal dispatch — the `_` default is mandatory",
  },
  {
    title: "Packed folds",
    tag: "MATCH",
    code: [
      '<span class="kw">match</span> bits',
      "| b[] =&gt; base",
      "| b[head, ..tail]; hyp =&gt; step(head, hyp)",
      '<span class="kw">end</span>',
    ],
    gloss: "Packed folds — a `Bits` head is `Bool`, a `Bytes` head is `Byte`",
  },
  {
    title: "Guarded ladder",
    tag: "CHOOSE",
    code: [
      '<span class="kw">choose</span>',
      "| prefer_fresh &amp;&amp; fresh &gt; 0 =&gt; fresh",
      "| some(n) = cached =&gt; n",
      "| _ =&gt; 0",
      '<span class="kw">end</span>',
    ],
    gloss:
      "`choose` consumes no scrutinee — arms are tried top to bottom, `some(n) = cached` is a bind-arm, and the final `_` arm is mandatory",
  },
  {
    title: "Dependent function types",
    tag: "TYPES",
    code: ['(x: <span class="kw">Nat</span>, y: <span class="kw">Nat</span>) -&gt; <span class="kw">Nat</span>'],
    gloss: "Π — later parts see earlier names",
  },
  {
    title: "Implicit parameters",
    tag: "TELESCOPES",
    code: ['(@A: <span class="kw">Type</span>, x: A) -&gt; A'],
    gloss: "`@` marks an implicit slot the elaborator infers, erased at runtime",
  },
  {
    title: "Witness parameters",
    tag: "TELESCOPES",
    code: [
      '(@A: <span class="kw">Type</span>, <span class="kw">use</span> <span class="kw">Show</span>(A), v: A) -&gt; <span class="kw">Str</span>',
    ],
    gloss: "`use` marks an anonymous witness slot resolution fills in",
  },
  {
    title: "Dependent tuple types",
    tag: "TYPES",
    code: ['{value: A, proof: <span class="kw">Valid</span>(value)}'],
    gloss: "Σ — data plus its receipt",
  },
  {
    title: "Supply an implicit at the call",
    tag: "TELESCOPES",
    code: ['f(@<span class="kw">Nat</span>, x)'],
    gloss: "Supply an implicit at the call — omitted ones are inferred",
  },
  {
    title: "Indexed inductive families",
    tag: "INDUCT",
    code: [
      '<span class="kw">pub induct</span> <span class="kw">Vec</span>(T: <span class="kw">Type</span>): (<span class="kw">Nat</span>) -&gt; <span class="kw">pub Type</span>',
      "| nil(): (0)",
      '| cons(@m: <span class="kw">Nat</span>, x: T, xs: <span class="kw">Vec</span>(T, m)): (m + 1)',
      '<span class="kw">end</span>',
    ],
    gloss:
      "An indexed family — the length lives in the type, and each constructor states the indices it produces. The inner `pub` exports construction and elimination",
  },
  {
    title: "Match with a motive",
    tag: "FOLDS",
    code: [
      '<span class="kw">match</span> n: (m) =&gt; P(m)',
      "| 0 =&gt; base",
      "| pred + 1; hyp =&gt; step(pred, hyp)",
      '<span class="kw">end</span>',
    ],
    gloss:
      "The motive binds the indices then the scrutinee, and can be left off wherever the elaborator infers it; `; hyp` binds the result for the smaller structure, and `+ 1` needs whitespace on both sides",
  },
  {
    title: "Folding a list",
    tag: "FOLDS",
    code: [
      '<span class="kw">match</span> values',
      "| [] =&gt; 0",
      "| [head, ..tail]; sum =&gt; head + sum",
      '<span class="kw">end</span>',
    ],
    gloss: "A fold, for free",
  },
  {
    title: "The fold binder takes patterns",
    tag: "FOLDS",
    code: [
      '<span class="kw">match</span> n',
      "| 0 =&gt; (0, true)",
      "| pred + 1; (count, live) =&gt; step(count, live)",
      '<span class="kw">end</span>',
    ],
    gloss:
      "The `;` binder names the fold result, not scrutinee shape — so it takes any irrefutable tuple or struct pattern, exactly like a `let`",
  },
  {
    title: "Mutual recursion",
    tag: "FOLDS",
    code: [
      '<span class="kw">let</span> even(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Bool</span> =',
      '    <span class="kw">match</span> n',
      "    | 0 =&gt; true",
      "    | p + 1 =&gt; odd(p)",
      '    <span class="kw">end</span>',
      '<span class="kw">and</span> odd(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Bool</span> =',
      '    <span class="kw">match</span> n',
      "    | 0 =&gt; false",
      "    | p + 1 =&gt; even(p)",
      '    <span class="kw">end</span>;',
      "even(input)",
    ],
    gloss: "A `let` is recursive by its body; members need types, `and` joins a mutual group, one `;` ends it",
  },
  {
    title: "Declare a concept",
    tag: "POLYMORPHISM",
    code: [
      '<span class="kw">pub concept</span> <span class="kw">Show</span>(A: <span class="kw">Type</span>): <span class="kw">pub Type</span> {',
      '    show(A) -&gt; <span class="kw">Str</span>',
      "}",
    ],
    gloss: "A typeclass-style interface",
  },
  {
    title: "Satisfy a concept",
    tag: "POLYMORPHISM",
    code: [
      '<span class="kw">satisfy</span> <span class="kw">Show</span>(<span class="kw">Nat</span>) {',
      "    show(n) = Nat/to_str(n)",
      "}",
    ],
    gloss:
      "One witness may occupy each key program-wide, so which implementation runs is a fact about the program, never about a call site",
  },
  {
    title: "Ask for a witness",
    tag: "POLYMORPHISM",
    code: [
      '<span class="kw">let</span> join(@A: <span class="kw">Type</span>, <span class="kw">use</span> <span class="kw">Show</span>(A), v: A) -&gt; <span class="kw">Str</span> =',
      "    Show/show(v);",
    ],
    gloss: "Resolved silently at the call site",
  },
  {
    title: "Superclass edges",
    tag: "POLYMORPHISM",
    code: [
      '<span class="kw">pub concept</span> <span class="kw">Ordered</span>(A: <span class="kw">Type</span>): <span class="kw">pub Type</span> {',
      '    <span class="kw">use</span> <span class="kw">Equal</span>(A),',
      '    cmp(A, A) -&gt; <span class="kw">Ordering</span>',
      "}",
    ],
    gloss: "A `use` field is a superclass edge — satisfiable by projection",
  },
  {
    title: "Parameterized witnesses",
    tag: "POLYMORPHISM",
    code: [
      '<span class="kw">satisfy</span> (@A: <span class="kw">Type</span>, <span class="kw">use</span> <span class="kw">Show</span>(A)) =&gt; <span class="kw">Show</span>(<span class="kw">List</span>(A)) {',
      "    show(values) =",
      '        List/fold(values, <span class="kw">""</span>, (v, r) =&gt;',
      "            Str/concat(r, Show/show(v)))",
      "}",
    ],
    gloss: "A parameterized witness — its premises resolve recursively",
  },
  {
    title: "Override resolution",
    tag: "POLYMORPHISM",
    code: [
      '<span class="kw">let</span> reverse: <span class="kw">Ordered</span>(<span class="kw">Nat</span>) = Ordered {',
      "    cmp(a, b) = compare_reverse(a, b)",
      "};",
      'sort(<span class="kw">use</span> reverse, values)',
    ],
    gloss: "Override resolution — pass an ordinary concept value with `use`",
  },
  {
    title: "Associated types and laws",
    tag: "POLYMORPHISM",
    code: [
      '<span class="kw">pub concept</span> <span class="kw">Divide</span>(A: <span class="kw">Type</span>): <span class="kw">pub Type</span> {',
      '    <span class="kw">Ok</span>(A) -&gt; <span class="kw">Prop</span>,',
      '    div(a: A, b: A, @ok: <span class="kw">Ok</span>(b)) -&gt; A',
      "}",
    ],
    gloss:
      "The field list is a dependent telescope — a field returning a sort is an associated type each witness picks, and a field whose type is a proposition about earlier ones is a law `satisfy` cannot register a witness without discharging",
  },
  {
    title: "Postfix ! is monadic bind",
    tag: "EFFECTS",
    code: [
      '<span class="kw">let</span> sum(a: <span class="kw">Option</span>(<span class="kw">Nat</span>), b: <span class="kw">Option</span>(<span class="kw">Nat</span>)) -&gt; <span class="kw">Option</span>(<span class="kw">Nat</span>) =',
      '    <span class="kw">let</span> x = a!;',
      '    <span class="kw">let</span> y = b!;',
      "    Option/some(x + y);",
    ],
    gloss:
      "Postfix `!` is `Monad/bind` — every body is a do-block, and the region's monad is read from its type, never from the action",
  },
  {
    title: "Io describes, it does not perform",
    tag: "EFFECTS",
    code: ['<span class="kw">let</span> greeting: <span class="kw">Io</span>({}) = print(<span class="kw">"hi"</span>);'],
    gloss:
      "A host call builds an `Io` description and performs nothing — a program's tail is one `Io({})`, forced once. Nothing takes an `Io(T)` to a `T`",
  },
  {
    title: "Lifting across monads",
    tag: "EFFECTS",
    code: [
      '<span class="kw">let</span> fiber: <span class="kw">Async</span>({}) =',
      '    <span class="kw">let</span> _ = print(<span class="kw">"hi\\n"</span>)!;',
      "    Async/pure(());",
    ],
    gloss:
      "A cross-monad action lifts through the declared `Lift` witness — `/std/Async` declares `Lift(Io, Async)`; edges never chain",
  },
  {
    title: "Witnesses on partially applied families",
    tag: "EFFECTS",
    code: [
      '<span class="kw">satisfy</span> (@S: <span class="kw">Type</span>) =&gt;',
      '        <span class="kw">Monad</span>((A: <span class="kw">Type</span>) =&gt; <span class="kw">State</span>(S, A)) {',
      "    pure(@A, a) = State/pure(a),",
      "    bind(@A, @B, m, f) = State/bind(m, f)",
      "}",
    ],
    gloss:
      "A witness may key on a partially applied family — which is why `State(S, A)` and `Try(M, E, A)` put the result parameter last",
  },
  {
    title: "Match on a proof",
    tag: "PROOFS",
    code: [
      '<span class="kw">let</span> sym(@x: <span class="kw">Nat</span>, @y: <span class="kw">Nat</span>, p: <span class="kw">Eq</span>(x, y)) -&gt; <span class="kw">Eq</span>(y, x) =',
      '    <span class="kw">match</span> p: (s, t, q) =&gt; <span class="kw">Eq</span>(t, s)',
      "    | refl(@z) =&gt; Eq/refl()",
      '    <span class="kw">end</span>;',
    ],
    gloss: "Match on the proof — all of it erases before runtime",
  },
  {
    title: "Declare a test",
    tag: "TESTS",
    code: [
      '<span class="kw">test</span> the_answer_holds() =',
      "    Test/check(21 * 2 == 42);",
    ],
    gloss:
      "A `test` item is a description of type `/syn/Test`, built from the combinators `/std/Test` exports; the parentheses are required and hold the telescope a `let` signature would. `test` is contextual — a keyword only where an item may start — and a test is never `pub`, because its name is its report line rather than an export",
  },
  {
    title: "A parameterized test is a property",
    tag: "TESTS",
    code: [
      '<span class="kw">test</span> add_commutes(n: <span class="kw">Nat</span>, m: <span class="kw">Nat</span>) =',
      "    Test/check(n + m == m + n);",
    ],
    gloss:
      "Parameters make it a claim about every instantiation, and the runner takes the strongest discharge it can: a body the kernel settles under the whole telescope reports `proved`, and any other is exhausted over the whole domain when the parameters' types are small and finite, or probed over drawn arguments otherwise. What can be drawn is the roster of `/std/Test/Draw` witnesses, and a program writes `Draw` for its own types",
  },
  {
    title: "Foreign declarations",
    tag: "FOREIGN",
    code: [
      '<span class="kw">foreign</span> random: <span class="kw">Nat</span>;',
      '<span class="kw">pub foreign</span> log: (<span class="kw">Bytes</span>) -&gt; <span class="kw">Nat</span>;',
    ],
    gloss:
      "Implemented by the embedder — wire types only: `Nat`, `Int`, `Bool`, `Bytes`, `Handle`, `List(T)`; a call to one yields an `Io`",
  },
];
