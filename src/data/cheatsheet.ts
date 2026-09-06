export interface CheatsheetCard {
  title: string;
  tag: string;
  // Each entry is one example, rendered in its own segment of the code well.
  code: string[][];
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
      ['<span class="kw">--</span> A complete line comment.'],
      ['<span class="kw">let</span> n = 1; <span class="kw">--</span> A trailing comment.'],
    ],
    gloss:
      "`--` and a space open a comment that runs to the end of the line; `--` glued to what follows it is refused rather than read as one. There are no block comments",
  },
  {
    title: "Documentation comments",
    tag: "COMMENTS",
    code: [
      [
        '<span class="kw">-- |</span> Twice the input.',
        '<span class="kw">-- |</span>',
        '<span class="kw">-- |</span> Never overflows, since `Nat` is unbounded.',
        '<span class="kw">pub let</span> double(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Nat</span> =',
        "    n + n;",
      ],
    ],
    gloss:
      "`-- |` is syntax rather than a comment: consecutive lines form one block, attached to the declaration below it — a `let`, `induct`, `struct`, `concept`, `satisfy`, `foreign` or `mod`, or a constructor, field or method inside one. `curios document` renders the blocks as the library's pages",
  },
  {
    title: "Absolute and relative paths",
    tag: "PATHS",
    code: [["Nat"], ["Option/some"], ["/std/List"]],
    gloss:
      "A leading `/` makes the path absolute. Paths are whitespace-free, so `a/b` is the path and `a / b` is the division",
  },
  {
    title: "Bring modules into scope",
    tag: "MODULES",
    code: [
      ['<span class="kw">use</span> /std/{<span class="kw">Nat</span>, <span class="kw">Bool</span>};'],
      ['<span class="kw">pub use</span> Option/*;'],
    ],
    gloss:
      "There is no bare `use path;` form, so an import always comes through a group. Prefixing it with `pub` re-exports what it imports, and a glob takes the exported surface only, never a subtree-private name",
  },
  {
    title: "Load a submodule from disk",
    tag: "MODULES",
    code: [['<span class="kw">pub mod</span> <span class="kw">Nat</span>;']],
    gloss:
      "Loads from the header's stem directory — `mod Nat;` in `main.crs` reads `main/Nat.crs`; only resolves in the native compiler, where a file system backs it",
  },
  {
    title: "Inline module",
    tag: "MODULES",
    code: [
      [
        '<span class="kw">pub mod</span> <span class="kw">Internal</span>',
        '    <span class="kw">pub let</span> value: <span class="kw">Nat</span> = 1;',
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "A module written in place rather than read from a file, closed by `end` — the one module form that needs no file system behind it",
  },
  {
    title: "List literal with spreads",
    tag: "LITERALS",
    code: [["[1, ..rest, 9]"]],
    gloss: "The spread may sit anywhere in it, so a literal is as much a concatenation form as a fixed run of elements",
  },
  {
    title: "Packed literals",
    tag: "LITERALS",
    code: [["b[1, 0, 1]"], ["x[0x48, 0x69, ..suffix]"]],
    gloss:
      "Packed `Bits`, LSB first, and packed `Bytes` — the grain letter glues to the `[`. A constant atom is a numeric literal at the grain's element type, in any radix, and `..` spreads a whole packed value; a literal written entirely from numerals is constant data",
  },
  {
    title: "Terms inside a packed literal",
    tag: "LITERALS",
    code: [["b[flag, ..rest]"], ["x[..acc, byte]"]],
    gloss:
      "An entry is an ordinary term contributing one atom — a `Bool` in a `Bits` literal, a `Byte` in a `Bytes` literal. `b[h, ..t]` conses and `x[..acc, b]` appends, with no named form",
  },
  {
    title: "Characters, strings, and numbers",
    tag: "LITERALS",
    code: [
      ['<span class="kw">\'λ\'</span>'],
      ['<span class="kw">\'\\u{301}\'</span>'],
      ['<span class="kw">"hello\\n"</span>'],
      ["0xFF"],
      ["1.0e9"],
    ],
    gloss:
      "`Char`, `Str`, numbers typed by context. The escapes are `\\n`, `\\t`, `\\r`, `\\\\`, the quote, and `\\u{…}` naming a scalar value by up to six hex digits; a `Char` refuses any other, a `Str` keeps the backslash",
  },
  {
    title: "Block strings",
    tag: "LITERALS",
    code: [
      [
        '<span class="kw">let</span> page: <span class="kw">Str</span> =',
        '    <span class="kw">"""</span>',
        '    <span class="kw">&lt;ul&gt;</span>',
        '        <span class="kw">&lt;li&gt;one&lt;/li&gt;</span>',
        '    <span class="kw">&lt;/ul&gt;</span>',
        '    <span class="kw">"""</span>;',
      ],
    ],
    gloss:
      "Three quotes and a newline open it, a newline and three quotes close it, and the value is the lines between. The leading whitespace they share with the closer comes off each line, so a block reads at the indentation of the code around it. Trailing whitespace goes too",
  },
  {
    title: "Infix operators dispatch through concepts",
    tag: "OPERATORS",
    code: [["a + b"], ["a == b"], ["a &amp;&amp; b"]],
    gloss:
      "Whitespace required on both sides, left-associative — each dispatches through a concept in `/syn` (`Add`, `Equal`, `And`); a path is the opposite and takes none, so `a / b` divides and `a/b` names",
  },
  {
    title: "Division demands its precondition",
    tag: "OPERATORS",
    code: [
      [
        '<span class="kw">match</span> 0 &lt; d',
        "| true =&gt; n / d",
        "| false =&gt; 0",
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "`/` and `%` also demand the precondition their concept's `Ok` field states — on `Nat`, `Nat/Lt(0, b)`. A literal divisor settles it outright and a guard reduces it away inside the arm, so only a bare `n / d` is refused",
  },
  {
    title: "Whole-term forms need parentheses",
    tag: "OPERATORS",
    code: [['1 + (<span class="kw">match</span> flag | true =&gt; 1 | false =&gt; 0 <span class="kw">end</span>)']],
    gloss:
      "`let`, `match`, `choose`, lambdas and function types run to the end of the enclosing term, so an infix operator never takes one bare. Positions that already take a whole term need none: call arguments, list elements, field values, scrutinees and arm bodies",
  },
  {
    title: "Top-level let needs a type",
    tag: "DECLARATIONS",
    code: [
      [
        '<span class="kw">pub let</span> zero: <span class="kw">Nat</span> = 0;',
        "",
        '<span class="kw">pub let</span> bump(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Nat</span> =',
        "    n + 1;",
      ],
    ],
    gloss:
      "An unannotated top-level binding is not an item at all — it is a local `let` opening the entrypoint's final term",
  },
  {
    title: "An entrypoint ends in one final term",
    tag: "DECLARATIONS",
    code: [
      [
        '<span class="kw">pub let</span> greeting: <span class="kw">Str</span> = <span class="kw">"hi\\n"</span>;',
        "",
        "print(greeting)",
      ],
    ],
    gloss:
      "Items, then exactly one final term of type `Io({})`. It yields nothing, so a tail that computes a result discards it explicitly, and a module file is items alone. An item's body is its own sequencing region, while a `!` in the final term sequences with the whole program",
  },
  {
    title: "What pub makes visible",
    tag: "DECLARATIONS",
    code: [
      ['<span class="kw">let</span> helper: <span class="kw">Nat</span> = 1;'],
      ['<span class="kw">pub let</span> value: <span class="kw">Nat</span> = 2;'],
    ],
    gloss:
      "Without `pub` a declaration is visible exactly within its module's subtree \u2014 descendants may name an ancestor's private bindings, ancestors and siblings may not. `pub` adds whatever visibility the module itself has, so inside a private module it means that module's audience",
  },
  {
    title: "A second pub exposes the representation",
    tag: "DECLARATIONS",
    code: [
      [
        '<span class="kw">pub struct</span> <span class="kw">Meters</span>: <span class="kw">pub Type</span> { <span class="kw">Nat</span> }',
      ],
    ],
    gloss:
      "`struct`, `induct` and `concept` carry a second `pub` before the result sort, exposing how they are built under the same rule. A private representation stays transparent across its declaring subtree, so an abstraction may span several files",
  },
  {
    title: "Local let binds the rest of the term",
    tag: "BINDINGS",
    code: [
      [
        '<span class="kw">let</span> x = compute();',
        '<span class="kw">let</span> y: <span class="kw">Nat</span> = 0;',
        "x + y",
      ],
    ],
    gloss:
      "The value is bound throughout the term after the `;`, and the annotation is optional here where a top-level one is required",
  },
  {
    title: "A binding is in scope of its own value",
    tag: "BINDINGS",
    code: [
      ['<span class="kw">let</span> walk(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Nat</span> = walk(n);'],
      ['<span class="kw">let</span> n = n + 1;  <span class="kw">--</span> refused'],
    ],
    gloss:
      "So a local function recurses with nothing said, and `let n = n + 1;` names the binding it is declaring rather than an outer `n`. A binding that mentions itself states its type",
  },
  {
    title: "Function sugar is a lambda",
    tag: "BINDINGS",
    code: [
      [
        '<span class="kw">let</span> increment(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Nat</span> = n + 1;',
      ],
      ['(x: <span class="kw">Nat</span>) =&gt; x + 1'],
    ],
    gloss:
      "The sugar is a lambda with a telescope in front of it. Every parameter of a `let` telescope is annotated and only a `use` parameter goes without; a bare lambda annotates only where context supplies nothing",
  },
  {
    title: "Irrefutable patterns in binders",
    tag: "BINDINGS",
    code: [
      ['<span class="kw">let</span> (a, b) = pair;'],
      ['<span class="kw">let</span> Point { x = px, y = py } = point;'],
      ["(Point { x, y }) =&gt; x + y"],
    ],
    gloss:
      "Destructuring, not a match: a tuple or struct pattern stands wherever a binder does — a local `let`, and a lambda parameter just the same. Anything refutable needs a `match`",
  },
  {
    title: "Names kept unused on purpose",
    tag: "BINDINGS",
    code: [
      ['<span class="kw">let</span> _ = print(<span class="kw">"hi\\n"</span>)!;'],
      ['<span class="kw">let</span> _width: <span class="kw">Nat</span> = 80;'],
    ],
    gloss:
      "`_` alone names nothing; a `_`-prefixed name is one `curios lint` never reports as unused, nor anything inside a `_`-prefixed module. Every other binder, import and private declaration nothing reaches is a lint, and the exit code says so",
  },
  {
    title: "Written goals",
    tag: "GOALS",
    code: [['<span class="kw">let</span> todo: <span class="kw">Nat</span> = ?;']],
    gloss:
      "A written goal — the report gives scope, expected type, and verified candidate fits, then the build exits 2. A goal is never accepted in a successfully compiled program",
  },
  {
    title: "Tuple values",
    tag: "TUPLES",
    code: [["(1, true)"], ["(left = 1, right = true)"], ["(x,)"], ["()"]],
    gloss:
      "Fields may be labeled. A one-field tuple is `(x,)` — the trailing comma is the whole difference between it and the parenthesized term `(x)` — while a labeled single field needs none. `()` is the unit value, and its type is the empty tuple `{}`",
  },
  {
    title: "Projection",
    tag: "TUPLES",
    code: [["pair.0"], ["pair.fst"], ["config.network.port"]],
    gloss:
      "Positional or labeled, and it chains freely. A labeled tuple answers to both, so `z.0` and `z.a` name the same field",
  },
  {
    title: "Declare a struct",
    tag: "STRUCTS",
    code: [
      [
        '<span class="kw">pub struct</span> <span class="kw">Point</span>: <span class="kw">pub Type</span> {',
        '    x: <span class="kw">Nat</span>,',
        '    y: <span class="kw">Nat</span>',
        "}",
      ],
    ],
    gloss:
      "A nominal dependent record: the field list is a telescope, so a later field's type may mention an earlier field's value",
  },
  {
    title: "Construct with labels",
    tag: "STRUCTS",
    code: [['<span class="kw">let</span> p: <span class="kw">Point</span> = Point {', "    x = 1,", "    y = 2", "};"]],
    gloss:
      "Every field named, and checked in declaration order. A parameterized head may supply its type arguments before the block, as `Pair(Nat, Bool) { … }`, and `label(params) = value` sugar assigns a lambda",
  },
  {
    title: "Copy the rest, then override",
    tag: "STRUCTS",
    code: [['<span class="kw">let</span> q: <span class="kw">Point</span> = Point {', "    ..p,", "    y = 9", "};"]],
    gloss:
      "`..p` copies a value of the same structure. It must come first and may occur once, and the labeled overrides after it follow declaration order. Tuples and strings have no update form",
  },
  {
    title: "Match several scrutinees at once",
    tag: "MATCH",
    code: [
      [
        '<span class="kw">match</span> (left, right)',
        "| (some(x), some(y)) =&gt; x + y",
        "| (some(x), none()) =&gt; x",
        "| (none(), _) =&gt; 0",
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "Checked for overlap and completeness. A matrix like this takes no motive, since no core eliminator answers to it",
  },
  {
    title: "Dispatch default arm",
    tag: "MATCH",
    code: [
      [
        '<span class="kw">match</span> option',
        "| some(v) =&gt; consume(v)",
        "| _ =&gt; fallback",
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "Only a bare `_` in final position is a default. A named binder is not a catch-all, and nested wildcard defaults are not accepted",
  },
  {
    title: "Literal dispatch",
    tag: "MATCH",
    code: [
      [
        '<span class="kw">match</span> tag',
        "| 0 =&gt; first",
        "| 1 =&gt; second",
        "| _ =&gt; otherwise",
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "Literal arms with a mandatory `_` default. A dispatch literal is a numeric or a character literal, the latter matching its scalar value, and induction arms cannot be mixed into the same `match`",
  },
  {
    title: "Guarded ladder",
    tag: "CHOOSE",
    code: [
      [
        '<span class="kw">choose</span>',
        "| prefer_fresh &amp;&amp; fresh &gt; 0 =&gt; fresh",
        "| some(n) = cached =&gt; n",
        "| _ =&gt; 0",
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "`choose` consumes no scrutinee — arms are tried top to bottom, `some(n) = cached` is a bind-arm, and the final `_` arm is mandatory",
  },
  {
    title: "Dependent function and tuple types",
    tag: "TYPES",
    code: [
      ['(x: <span class="kw">Nat</span>, y: <span class="kw">Nat</span>) -&gt; <span class="kw">Nat</span>'],
      ['{value: A, proof: <span class="kw">Valid</span>(value)}'],
    ],
    gloss:
      "\u03a0 and \u03a3. Later parts see the names bound before them, so a result type may mention its arguments and a tuple's second component is the receipt for its first",
  },
  {
    title: "Implicit parameters",
    tag: "TELESCOPES",
    code: [['(@A: <span class="kw">Type</span>, x: A) -&gt; A'], ['f(@<span class="kw">Nat</span>, x)']],
    gloss:
      "`@` marks a slot the elaborator infers and erases before runtime. The same `@` supplies one at a call, which is how you pin down what inference cannot reach",
  },
  {
    title: "Witness parameters",
    tag: "TELESCOPES",
    code: [
      [
        '<span class="kw">let</span> join(@A: <span class="kw">Type</span>, <span class="kw">use</span> <span class="kw">Show</span>(A), v: A) -&gt; <span class="kw">Str</span> =',
        "    Show/show(v);",
      ],
    ],
    gloss:
      "`use` marks an anonymous witness slot — no name in the telescope, and filled by resolution rather than by the caller, silently at the call site. A concept's own wrappers ask for one exactly the same way",
  },
  {
    title: "Indexed inductive families",
    tag: "INDUCT",
    code: [
      [
        '<span class="kw">pub induct</span> <span class="kw">Vec</span>(T: <span class="kw">Type</span>): (<span class="kw">Nat</span>) -&gt; <span class="kw">pub Type</span>',
        "| nil(): (0)",
        '| cons(@m: <span class="kw">Nat</span>, x: T, xs: <span class="kw">Vec</span>(T, m)): (m + 1)',
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "An indexed family — the length lives in the type, and each constructor states the indices it produces. The inner `pub` exports construction and elimination",
  },
  {
    title: "Match with a motive",
    tag: "FOLDS",
    code: [
      [
        '<span class="kw">match</span> n: (m) =&gt; P(m)',
        "| 0 =&gt; base",
        "| pred + 1; hyp =&gt; step(pred, hyp)",
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "The motive binds the indices then the scrutinee, and can be left off wherever the elaborator infers it; `; hyp` binds the result for the smaller structure, and `+ 1` needs whitespace on both sides",
  },
  {
    title: "Folding a list",
    tag: "FOLDS",
    code: [
      [
        '<span class="kw">match</span> values',
        "| [] =&gt; 0",
        "| [head, ..tail]; sum =&gt; head + sum",
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "The `; sum` binder holds the fold's result for the tail, so the sum is written without recursion and terminates by the structure. Leave the binder off for a plain case split",
  },
  {
    title: "Packed folds",
    tag: "FOLDS",
    code: [
      [
        '<span class="kw">match</span> bits',
        "| b[] =&gt; base",
        "| b[head, ..tail]; hyp =&gt; step(head, hyp)",
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "A `Bits` head is a `Bool` and a `Bytes` head a `Byte`, and the `;` binder holds the fold's result for the tail",
  },
  {
    title: "The fold binder takes patterns",
    tag: "FOLDS",
    code: [
      [
        '<span class="kw">match</span> n',
        "| 0 =&gt; (0, true)",
        "| pred + 1; (count, live) =&gt; step(count, live)",
        '<span class="kw">end</span>',
      ],
    ],
    gloss:
      "The `;` binder names the fold result, not scrutinee shape — so it takes any irrefutable tuple or struct pattern, exactly like a `let`",
  },
  {
    title: "Mutual recursion",
    tag: "FOLDS",
    code: [
      [
        '<span class="kw">let</span> even(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Bool</span> =',
        '    <span class="kw">match</span> n | 0 =&gt; true | p + 1 =&gt; odd(p) <span class="kw">end</span>',
        '<span class="kw">and</span> odd(n: <span class="kw">Nat</span>) -&gt; <span class="kw">Bool</span> =',
        '    <span class="kw">match</span> n | 0 =&gt; false | p + 1 =&gt; even(p) <span class="kw">end</span>;',
        "even(input)",
      ],
    ],
    gloss: "A `let` is recursive by its body; members need types, `and` joins a mutual group, one `;` ends it",
  },
  {
    title: "Declare a concept",
    tag: "POLYMORPHISM",
    code: [
      [
        '<span class="kw">pub concept</span> <span class="kw">Show</span>(A: <span class="kw">Type</span>): <span class="kw">pub Type</span> {',
        '    show(A) -&gt; <span class="kw">Str</span>',
        "}",
      ],
    ],
    gloss:
      "A typeclass-style interface — the field list is the telescope every witness supplies. `: pub Type` publishes the representation; a bare `: Type` seals it, and only the declaring subtree may then write witnesses or literals for it",
  },
  {
    title: "Satisfy a concept",
    tag: "POLYMORPHISM",
    code: [
      [
        '<span class="kw">satisfy</span> <span class="kw">Show</span>(<span class="kw">Nat</span>) {',
        "    show(n) = Nat/to_str(n)",
        "}",
      ],
    ],
    gloss:
      "One witness may occupy each key program-wide, so which implementation runs is a fact about the program, never about a call site",
  },
  {
    title: "Superclass edges",
    tag: "POLYMORPHISM",
    code: [
      [
        '<span class="kw">pub concept</span> <span class="kw">Ordered</span>(A: <span class="kw">Type</span>): <span class="kw">pub Type</span> {',
        '    <span class="kw">use</span> <span class="kw">Equal</span>(A),',
        '    cmp(A, A) -&gt; <span class="kw">Ordering</span>',
        "}",
      ],
    ],
    gloss:
      "A `use` field is a superclass edge, satisfiable by projection. Omitting one in a concept literal asks resolution to fill the slot",
  },
  {
    title: "Parameterized witnesses",
    tag: "POLYMORPHISM",
    code: [
      [
        '<span class="kw">satisfy</span> (@A: <span class="kw">Type</span>, <span class="kw">use</span> <span class="kw">Show</span>(A)) =&gt; <span class="kw">Show</span>(<span class="kw">List</span>(A)) {',
        "    show(values) =",
        '        List/fold(values, <span class="kw">""</span>, (v, r) =&gt;',
        "            Str/concat(r, Show/show(v)))",
        "}",
      ],
    ],
    gloss:
      "Its premises resolve recursively, and each must be structurally smaller than the head it serves — which is what makes the search terminate",
  },
  {
    title: "A bodyless satisfy derives Spell",
    tag: "POLYMORPHISM",
    code: [
      [
        '<span class="kw">satisfy</span> <span class="kw">Spell</span>(<span class="kw">Point</span>);',
        '<span class="kw">--</span> spells as Point { x = 1, y = 2 }',
      ],
    ],
    gloss:
      "Omitting the body asks the compiler to write one from the declaration of the type in the key, which must be a declared `induct` or `struct`. A derived `Spell` gives the constructor qualified by its type's own name, or a struct as its literal — text that re-parses",
  },
  {
    title: "A bodyless satisfy derives Equal",
    tag: "POLYMORPHISM",
    code: [
      ['<span class="kw">satisfy</span> <span class="kw">Equal</span>(<span class="kw">Point</span>);'],
      [
        '<span class="kw">satisfy</span> (@A: <span class="kw">Type</span>, <span class="kw">use</span> <span class="kw">Equal</span>(A)) =&gt;',
        '        <span class="kw">Equal</span>(<span class="kw">Tree</span>(A));',
      ],
    ],
    gloss:
      "The form takes a telescope like any other witness, and either shape may join an `and` group beside written members. A derived `Equal` is structural — the same constructor with pairwise equal payloads, `!=` its negation. `Spell` and `Equal` are the only concepts that derive",
  },
  {
    title: "Override resolution",
    tag: "POLYMORPHISM",
    code: [
      [
        '<span class="kw">let</span> reverse: <span class="kw">Ordered</span>(<span class="kw">Nat</span>) = Ordered {',
        "    cmp(a, b) = compare_reverse(a, b)",
        "};",
        'sort(<span class="kw">use</span> reverse, values)',
      ],
    ],
    gloss:
      "Pass an ordinary concept value with `use`. Resolution takes local `use` parameters first, then superclass projections, and only then the global table",
  },
  {
    title: "Associated types and laws",
    tag: "POLYMORPHISM",
    code: [
      [
        '<span class="kw">pub concept</span> <span class="kw">Divide</span>(A: <span class="kw">Type</span>): <span class="kw">pub Type</span> {',
        '    <span class="kw">Ok</span>(A) -&gt; <span class="kw">Prop</span>,',
        '    div(a: A, b: A, @ok: <span class="kw">Ok</span>(b)) -&gt; A',
        "}",
      ],
    ],
    gloss:
      "The field list is a dependent telescope — a field returning a sort is an associated type each witness picks, and a field whose type is a proposition about earlier ones is a law `satisfy` cannot register a witness without discharging",
  },
  {
    title: "A % place shows its argument",
    tag: "FORMAT",
    code: [
      ['Fmt/print(<span class="kw">"midpoint = (%, %)\\n"</span>)(mx)(my)'],
      ['Fmt/render(<span class="kw">"x = %"</span>)(point.x)'],
    ],
    gloss:
      "The literal's places fix the call's type: one argument per `%`, each resolving the `Show` witness for its own type, and a missing or surplus one is refused where the call is written. `\\%` is a literal percent. `Fmt/render` answers a `Str`, `Fmt/print` an `Io({})`",
  },
  {
    title: "A # place spells its argument",
    tag: "FORMAT",
    code: [
      [
        'Fmt/render(<span class="kw">"# and #"</span>)(Option/some(3))(<span class="kw">"x"</span>)',
        '<span class="kw">--</span> Option/some(3) and "x"',
      ],
    ],
    gloss:
      "`#` is the place filled by `Spell` rather than `Show`: the value as source that reads back, a literal or a constructor qualified by its type's own name. The two mix in either order, `\\#` is a literal hash, and a declared type derives its witness with `satisfy Spell(T);`",
  },
  {
    title: "Postfix ! is monadic bind",
    tag: "EFFECTS",
    code: [
      [
        '<span class="kw">let</span> sum(a: <span class="kw">Option</span>(<span class="kw">Nat</span>), b: <span class="kw">Option</span>(<span class="kw">Nat</span>)) -&gt; <span class="kw">Option</span>(<span class="kw">Nat</span>) =',
        '    <span class="kw">let</span> x = a!;',
        '    <span class="kw">let</span> y = b!;',
        "    Option/some(x + y);",
      ],
    ],
    gloss:
      "Postfix `!` is `Monad/bind` — every body is a do-block, and the region's monad is read from its type, never from the action",
  },
  {
    title: "Io describes, it does not perform",
    tag: "EFFECTS",
    code: [
      ['<span class="kw">let</span> greeting: <span class="kw">Io</span>({}) = print(<span class="kw">"hi"</span>);'],
    ],
    gloss:
      "A host call builds an `Io` description and performs nothing — a program's tail is one `Io({})`, forced once. Nothing takes an `Io(T)` to a `T`",
  },
  {
    title: "Lifting across monads",
    tag: "EFFECTS",
    code: [
      [
        '<span class="kw">let</span> fiber: <span class="kw">Async</span>({}) =',
        '    <span class="kw">let</span> _ = print(<span class="kw">"hi\\n"</span>)!;',
        "    Async/pure(());",
      ],
    ],
    gloss:
      "A cross-monad action lifts through the declared `Lift` witness — `/std/Async` declares `Lift(Io, Async)`; edges never chain",
  },
  {
    title: "Try regions carry the failure",
    tag: "EFFECTS",
    code: [
      [
        '<span class="kw">let</span> contents: <span class="kw">Try</span>(<span class="kw">Io</span>, Io/Error, <span class="kw">Bytes</span>) =',
        '    <span class="kw">let</span> f = File/open(path, mode)!;',
        '    <span class="kw">let</span> text = File/read_all(path)!;',
        "    Try/pure(text);",
      ],
    ],
    gloss:
      "A host operation that can fail is declared `Try(M, E, A)` over its base monad, and the region sequences a `Try` on that base and a bare `Result` as an early return. `Try/raise` stops it, `Try/rescue` handles the stop, and `Try/run` hands back an `M(Result(E, A))`",
  },
  {
    title: "Witnesses on partially applied families",
    tag: "EFFECTS",
    code: [
      [
        '<span class="kw">satisfy</span> (@S: <span class="kw">Type</span>) =&gt;',
        '        <span class="kw">Monad</span>((A: <span class="kw">Type</span>) =&gt; <span class="kw">State</span>(S, A)) {',
        "    pure(@A, a) = State/pure(a),",
        "    bind(@A, @B, m, f) = State/bind(m, f)",
        "}",
      ],
    ],
    gloss:
      "A witness may key on a partially applied family — which is why `State(S, A)` and `Try(M, E, A)` put the result parameter last",
  },
  {
    title: "Match on a proof",
    tag: "PROOFS",
    code: [
      [
        '<span class="kw">let</span> sym(@x: <span class="kw">Nat</span>, @y: <span class="kw">Nat</span>, p: <span class="kw">Eq</span>(x, y)) -&gt; <span class="kw">Eq</span>(y, x) =',
        '    <span class="kw">match</span> p: (s, t, q) =&gt; <span class="kw">Eq</span>(t, s)',
        "    | refl(@z) =&gt; Eq/refl()",
        '    <span class="kw">end</span>;',
      ],
    ],
    gloss:
      "All of it erases before runtime. The motive binds one name per index and then the scrutinee, so a match on `Eq` takes three",
  },
  {
    title: "Declare a test",
    tag: "TESTS",
    code: [['<span class="kw">test</span> the_answer_holds() =', "    Test/check(21 * 2 == 42);"]],
    gloss:
      "A `test` item is a description of type `/syn/Test`, built from the combinators `/std/Test` exports; the parentheses are required and hold the telescope a `let` signature would. A test is never `pub`, since its name is its report line rather than an export",
  },
  {
    title: "A parameterized test is a property",
    tag: "TESTS",
    code: [
      [
        '<span class="kw">test</span> add_commutes(n: <span class="kw">Nat</span>, m: <span class="kw">Nat</span>) =',
        "    Test/check(n + m == m + n);",
      ],
    ],
    gloss:
      "Parameters make it a claim about every instantiation, and the runner takes the strongest discharge it can: a body the kernel settles under the whole telescope is proved, a small finite domain is exhausted, and anything else is probed over arguments from the `Draw` roster",
  },
  {
    title: "Foreign declarations",
    tag: "FOREIGN",
    code: [
      ['<span class="kw">foreign</span> random: <span class="kw">Nat</span>;'],
      ['<span class="kw">pub foreign</span> log: (<span class="kw">Bytes</span>) -&gt; <span class="kw">Nat</span>;'],
    ],
    gloss:
      "Implemented by the embedder — wire types only: `Nat`, `Int`, `Bool`, `Bytes`, `Handle`, `List(T)`; a call to one yields an `Io`",
  },
];
