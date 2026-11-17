export interface CheatsheetCard {
  title: string;
  tag: string;
  // Each entry is one example, rendered in its own segment of the code well.
  code: string[][];
  gloss: string;
}

// One flat, searchable list, ordered least to most complex. It used to be two hand-balanced columns of titled sections; the rail lays cards out in a grid now, so balancing is the layout's job and grouping is the search box's, which leaves ordering as the only thing this file still has to get right.
// Code lines are plain Curios, written the way `curios format` writes it at the card's width; the build highlights them with the compiler's own grammar (src/lib/highlight.ts).
// Glosses mark inline code with backticks; see src/lib/inline.ts.
export const CHEATSHEET: CheatsheetCard[] = [
  {
    title: "Line comments",
    tag: "COMMENTS",
    code: [
      ["-- A complete line comment."],
      ["let n = 1; -- A trailing comment."],
    ],
    gloss:
      "`--` and a space open a comment that runs to the end of the line; `--` glued to what follows it is refused rather than read as one, except as the `---` that opens a documentation comment. There are no block comments",
  },
  {
    title: "Documentation comments",
    tag: "COMMENTS",
    code: [
      [
        "--- Twice the input.",
        "---",
        "--- Never overflows, since `Nat` is unbounded.",
        "pub let double(n: Nat) -> Nat =",
        "    n + n;",
      ],
    ],
    gloss:
      "`---` and a space open a documentation comment, kept where a line comment is discarded: consecutive lines form one block, attached to the declaration below it, or to a constructor, field or method inside one. `curios document` renders the blocks as pages",
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
      ["use /std/{Nat, Bool};"],
      ["pub use Option/*;"],
    ],
    gloss:
      "There is no bare `use path;` form, so an import always comes through a group. Prefixing it with `pub` re-exports what it imports, and a glob takes the exported surface only, never a subtree-private name",
  },
  {
    title: "Load a submodule from disk",
    tag: "MODULES",
    code: [["pub mod Nat;"]],
    gloss:
      "Loads from the header's stem directory — `mod Nat;` in `main.crs` reads `main/Nat.crs`",
  },
  {
    title: "Inline module",
    tag: "MODULES",
    code: [
      [
        "pub mod Internal",
        "    pub let value: Nat =",
        "        1;",
        "end",
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
    code: [["x['H', 'i']"], ["x[0x48, 0x69, ..suffix]"]],
    gloss:
      "A packed literal builds `Bytes`, the first byte written first, with the `x` glued to the `[` — a bare `[…]` is still a `List`. A constant atom is a numeric literal from `0` to `255` in any radix, or a character whose code point fits a byte, and `..` spreads a whole `Bytes` value",
  },
  {
    title: "Terms inside a packed literal",
    tag: "LITERALS",
    code: [["x[head, ..tail]"], ["x[..acc, byte]"]],
    gloss:
      "An entry is an ordinary term contributing one `Byte`. `x[h, ..t]` conses and `x[..acc, b]` appends, with no named form",
  },
  {
    title: "Characters, strings, and numbers",
    tag: "LITERALS",
    code: [
      ["'λ'"],
      ["'\\u{301}'"],
      ['"hello\\n"'],
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
        "let page: Str =",
        '    """',
        "    <ul>",
        "        <li>one</li>",
        "    </ul>",
        '    """;',
      ],
    ],
    gloss:
      "Three quotes and a newline open it, a newline and three quotes close it, and the value is the lines between, less the indentation they share with the closer and any trailing whitespace — so a block reads at the indentation of the code around it",
  },
  {
    title: "Infix operators dispatch through concepts",
    tag: "OPERATORS",
    code: [["a + b"], ["a == b"], ["a && b"]],
    gloss:
      "Whitespace required on both sides, left-associative — each dispatches through a concept the standard library declares (`/std/ops/Add`, `/std/ops/Eql`, `/std/ops/And`); a path is the opposite and takes none, so `a / b` divides and `a/b` names",
  },
  {
    title: "Division demands its precondition",
    tag: "OPERATORS",
    code: [
      [
        "match 0 < d",
        "| true => n / d",
        "| false => 0",
        "end",
      ],
    ],
    gloss:
      "`/` and `%` demand the precondition their concept's `Ok` field states — on `Nat`, `Nat/NonZero(b)`, which is `Holds(b != 0)`. A literal divisor settles it, and the elaborator proves the rest from a guard like this one or a hypothesis, so only an `n / d` that nothing bounds is refused",
  },
  {
    title: "Whole-term forms need parentheses",
    tag: "OPERATORS",
    code: [
      ["12345 + 54321", "    + (", "        let n = 2;", "        n * n)"],
      ["1 + match flag | true => 1 | false => 0 end"],
    ],
    gloss:
      "`let`, lambdas and function types run to the end of the term, so an operator never takes one bare. `match` is an atom, since `end` closes it, and a position that takes a whole term — an argument, an element, an arm body — needs no parentheses",
  },
  {
    title: "Top-level let needs a type",
    tag: "DECLARATIONS",
    code: [
      [
        "pub let zero: Nat =",
        "    0;",
        "",
        "pub let bump(n: Nat) -> Nat =",
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
        "pub let greeting: Str =",
        '    "hi\\n";',
        "",
        "print(greeting)",
      ],
    ],
    gloss:
      "Items, then exactly one final term, the description the program performs: an `Io({})`, a `Try(Io, E, {})` whose failure is written to standard error and ends the program with status `1`, or `()` where the program has done what it does by its last `!`. A tail that computes another result discards it, and a module file is items alone. An item's body is its own sequencing region; a `!` in the final term sequences with the whole program",
  },
  {
    title: "What pub makes visible",
    tag: "DECLARATIONS",
    code: [
      ["let helper: Nat =", "    1;"],
      ["pub let value: Nat =", "    2;"],
    ],
    gloss:
      "Without `pub` a declaration is visible within its module's subtree \u2014 to descendants, never to ancestors or siblings. `pub` adds whatever visibility the module itself has, so inside a private module it means that module's audience",
  },
  {
    title: "A second pub exposes the representation",
    tag: "DECLARATIONS",
    code: [
      [
        "pub struct Meters: pub Type {",
        "    Nat,",
        "}",
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
        "let x = compute();",
        "let y: Nat = 0;",
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
      [
        "let walk(n: Nat) -> Nat =",
        "    walk(n);",
      ],
      ["let n = n + 1;  -- refused"],
    ],
    gloss:
      "So a local function recurses with nothing said, and `let n = n + 1;` names the binding it is declaring rather than an outer `n`. A binding that mentions itself states its type",
  },
  {
    title: "Function sugar is a lambda",
    tag: "BINDINGS",
    code: [
      [
        "let increment(n: Nat) -> Nat =",
        "    n + 1;",
      ],
      ["(x: Nat) => x + 1"],
    ],
    gloss:
      "The sugar is a lambda with a telescope in front of it. A `let` telescope is a signature: a plain or `@` parameter is always `name: type`, and a `use` one is its concept application; a bare lambda annotates only where context supplies nothing",
  },
  {
    title: "Irrefutable patterns in binders",
    tag: "BINDINGS",
    code: [
      ["let (a, b) = pair;"],
      ["let Point { x = px, y = py } = point;"],
      ["(Point { x, y }) => x + y"],
    ],
    gloss:
      "Destructuring, not a match: a tuple or struct pattern stands wherever a binder does — a local `let`, and a lambda parameter just the same. Anything refutable needs a `match`",
  },
  {
    title: "Names kept unused on purpose",
    tag: "BINDINGS",
    code: [
      ['let _ = print("hi\\n")!;'],
      ["let _width: Nat =", "    80;"],
    ],
    gloss:
      "`_` alone names nothing; a `_`-prefixed name is one `curios lint` never reports as unused, nor anything inside a `_`-prefixed module. Every other binder, import and private declaration nothing reaches is a lint, and the exit code says so",
  },
  {
    title: "Written goals",
    tag: "GOALS",
    code: [["let todo: Nat =", "    ?;"]],
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
        "pub struct Point: pub Type {",
        "    x: Nat,",
        "    y: Nat,",
        "}",
      ],
    ],
    gloss:
      "A nominal dependent record: the field list is a telescope, so a later field's type may mention an earlier field's value",
  },
  {
    title: "Construct with labels",
    tag: "STRUCTS",
    code: [["let p: Point =", "    Point { x = 1, y = 2 };"]],
    gloss:
      "Every field named, and checked in declaration order. A parameterized head may supply its type arguments before the block, as `Pair(Nat, Bool) { … }`, and `label(params) = value` sugar assigns a lambda",
  },
  {
    title: "Copy the rest, then override",
    tag: "STRUCTS",
    code: [["let q: Point =", "    Point { ..p, y = 9 };"]],
    gloss:
      "`..p` copies a value of the same structure. It must come first and may occur once, and the labeled overrides after it follow declaration order. Tuples and strings have no update form",
  },
  {
    title: "Match several scrutinees at once",
    tag: "MATCH",
    code: [
      [
        "match (left, right)",
        "| (some(x), some(y)) => x + y",
        "| (some(x), none()) => x",
        "| (none(), _) => 0",
        "end",
      ],
    ],
    gloss:
      "Checked for overlap and completeness. Each scrutinee of the tuple is matched in a column of its own",
  },
  {
    title: "Dispatch default arm",
    tag: "MATCH",
    code: [
      [
        "match option",
        "| some(v) => consume(v)",
        "| _ => fallback",
        "end",
      ],
    ],
    gloss:
      "A final `_` states no case, so its body is typed where the match stands, however deep the arms before it nest. A final arm binding a name is refused, since the scrutinee is in scope under the name it already has",
  },
  {
    title: "Literal dispatch",
    tag: "MATCH",
    code: [
      [
        "match tag",
        "| 0 => first",
        "| 1 => second",
        "| _ => otherwise",
        "end",
      ],
    ],
    gloss:
      "Literal arms with a mandatory `_` default. A dispatch literal is a numeric or a character literal, the latter matching its scalar value, and a successor arm `p + 1` is not mixed into the same `match`",
  },
  {
    title: "Several patterns, one arm",
    tag: "MATCH",
    code: [
      [
        "match Char/to_nat(c)",
        "| ' ' | '\\t' | '\\n' | '\\r' => true",
        "| _ => false",
        "end",
      ],
    ],
    gloss:
      "Each alternative stands after a bar of its own. All bind the same names, the body is typed once under each alternative's cases, and no two alternatives share a value",
  },
  {
    title: "A match with no head",
    tag: "GUARDS",
    code: [
      [
        "match",
        "| prefer_fresh, fresh > 0 => fresh",
        "| some(n) = cached => n",
        "| _ => 0",
        "end",
      ],
    ],
    gloss:
      "A `match` with no head is guards alone, tried top to bottom: a `Bool` term passes where it is `true`, `pattern = term` where the value matches, and a comma runs the next guard only where the one before passed. The final `_` arm is required",
  },
  {
    title: "Guards after a pattern",
    tag: "GUARDS",
    code: [
      [
        "match cached",
        "| some(n), n > 0 => n",
        "| _ => 1",
        "end",
      ],
    ],
    gloss:
      "An arm writes guards after its patterns, each after a comma, reading the names the patterns bind. Where a guard fails the value goes on to the arms after it, and where an arm's one guard is a condition that fails, the arms after it know it is false",
  },
  {
    title: "Dependent function and tuple types",
    tag: "TYPES",
    code: [
      ["(x: Nat, y: Nat) -> Nat"],
      ["{value: A, proof: Valid(value)}"],
    ],
    gloss:
      "\u03a0 and \u03a3. Later parts see the names bound before them, so a result type may mention its arguments and a tuple's second component is the receipt for its first",
  },
  {
    title: "Implicit parameters",
    tag: "TELESCOPES",
    code: [["(@A: Type, x: A) -> A"], ["f(@Nat, x)"]],
    gloss:
      "`@` marks a slot the elaborator infers and erases before runtime. The same `@` supplies one at a call, which is how you pin down what inference cannot reach",
  },
  {
    title: "Witness parameters",
    tag: "TELESCOPES",
    code: [
      [
        "let join(@A: Type, use Show(A), v: A) -> Str =",
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
        "pub induct Vec(T: Type): (Nat) -> pub Type",
        "| nil(): (0)",
        "| cons(@m: Nat, x: T, xs: Vec(T)(m)): (m + 1)",
        "end",
      ],
    ],
    gloss:
      "An indexed family — the length lives in the type, and each constructor states the indices it produces. It is applied as it is declared, its parameters in one call and its indices in the next. The inner `pub` exports construction and elimination",
  },
  {
    title: "A recursion that descends",
    tag: "RECURSION",
    code: [
      [
        "let factorial(n: Nat) -> Nat =",
        "    match n",
        "    | 0 => 1",
        "    | pred + 1 => n * factorial(pred)",
        "    end;",
      ],
    ],
    gloss:
      "A definition calls itself by its name. A call on what a case took apart descends, so the checker finds the recursion total and a type or a proof may use it; one that does not descend is a program still, kept out of both. `+ 1` needs whitespace on both sides",
  },
  {
    title: "A list pattern is a run",
    tag: "RECURSION",
    code: [
      [
        "let last(values: List(Nat)) -> Option(Nat) =",
        "    match values",
        "    | [] => Option/none()",
        "    | [only] => Option/some(only)",
        "    | [_, ..rest] => last(rest)",
        "    end;",
      ],
    ],
    gloss:
      "A list pattern is the literal that builds the value: `[]`, `[only]` for exactly one element, and `[_, ..rest]` for a list that element begins, each element a pattern of its own. The call on `rest` descends",
  },
  {
    title: "Packed runs",
    tag: "RECURSION",
    code: [
      [
        "let lines(bytes: Bytes) -> Nat =",
        "    match bytes",
        "    | x[] => 0",
        "    | x['\\n', ..tail] => 1 + lines(tail)",
        "    | x[_, ..tail] => lines(tail)",
        "    end;",
      ],
    ],
    gloss:
      "`x[` takes a `Bytes` value apart as `[` takes a list. Its elements are bytes, matched by their literals: a numeral up to `255`, or a character whose code point fits a byte",
  },
  {
    title: "Mutual recursion",
    tag: "RECURSION",
    code: [
      [
        "let even(n: Nat) -> Bool =",
        "    match n | 0 => true | p + 1 => odd(p) end",
        "and odd(n: Nat) -> Bool =",
        "    match n | 0 => false | p + 1 => even(p) end;",
        "",
        "even(input)",
      ],
    ],
    gloss: "A `let` is recursive by its body; members need types, `and` joins a mutual group, one `;` ends it",
  },
  {
    title: "Shifts and rotations keep the width",
    tag: "PACKED",
    code: [
      ["Bytes/shl(b, 3)", "Bytes/shr(b, 1)"],
      ["Bytes/rotl(b, 2)", "Bytes/rotr(b, 1)"],
      ["Bytes/not(b)"],
    ],
    gloss:
      "`not`, `shl`, `shr`, `rotl` and `rotr` each preserve the run’s width and move whole bytes, a shift by bits being `Nat`’s. A shift enters zero bytes and discards what passes the end, while a rotation re-enters it at the other end, its count taken modulo the width so it needs no guard",
  },
  {
    title: "Pointwise operations demand equal length",
    tag: "PACKED",
    code: [
      [
        "match Nat/eql(Bytes/len(a), Bytes/len(b))",
        "| true => Bytes/and(a, b)",
        "| false => x[]",
        "end",
      ],
    ],
    gloss:
      "`and`, `or` and `xor` are pointwise, and each carries an erased proof that the two runs are the same length. A guard discharges it by its own decision, exactly as division’s precondition is discharged — no proof is written at the call",
  },
  {
    title: "Fill a run in one step",
    tag: "PACKED",
    code: [["Bytes/replicate(4, 0xFF)"]],
    gloss:
      "One run of one repeated byte, built by the primitive rather than a spine of conses. `len` reduces a fill to its own count, which is what lets an equal-length bound discharge against one without unfolding it",
  },
  {
    title: "Declare a concept",
    tag: "POLYMORPHISM",
    code: [
      [
        "pub concept Show(A: Type): pub Type {",
        "    show(A) -> Str,",
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
        "satisfy Show(Nat) {",
        "    show(n) = Nat/to_str(n),",
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
        "pub concept Ord(A: Type): pub Type {",
        "    use Eql(A),",
        "    ord(A, A) -> Ordering,",
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
        "satisfy (@A: Type, use Show(A)) => Show(List(A)) {",
        "    show(values) =",
        '        List/fold(values, "", (v, r) =>',
        "            Str/concat(r, Show/show(v))),",
        "}",
      ],
    ],
    gloss:
      "Its premises resolve recursively, and each must be structurally smaller than the head it serves — which is what makes the search terminate",
  },
  {
    title: "A .. body derives Spell",
    tag: "POLYMORPHISM",
    code: [
      [
        "satisfy Spell(Point) {",
        "    ..",
        "}",
        "-- spells as Point { x = 1, y = 2 }",
      ],
    ],
    gloss:
      "A block holding `..` alone asks the compiler to write the body from the type in the key, which must be a declared `induct` or `struct`. A derived `Spell` gives the constructor qualified by its type's own name, or a struct as its literal — text that re-parses",
  },
  {
    title: "A .. body derives Eql",
    tag: "POLYMORPHISM",
    code: [
      ["satisfy Eql(Point) {", "    ..", "}"],
      [
        "satisfy (@A: Type, use Eql(A)) => Eql(Tree(A)) {",
        "    ..",
        "}",
      ],
    ],
    gloss:
      "The form takes a telescope like any other witness. A derived `Eql` is structural — the same constructor with pairwise equal payloads — and a derived `Ord` ranks constructors before payloads. `Spell`, `Eql`, `Ord` and `Hash` are the only concepts that derive",
  },
  {
    title: "Override resolution",
    tag: "POLYMORPHISM",
    code: [
      [
        "let reverse: Ord(Nat) =",
        "    Ord { ord(a, b) = compare_reverse(a, b) };",
        "",
        "sort(@_, use reverse, values)",
      ],
    ],
    gloss:
      "Pass a concept value with `use`, where its parameter stands: hidden arguments go in order from the first, so `@_` holds the implicit's place. Resolution takes local `use` parameters first, then superclass projections, and only then the global table",
  },
  {
    title: "Associated types and laws",
    tag: "POLYMORPHISM",
    code: [
      [
        "pub concept Divide(A: Type): pub Type {",
        "    Ok(A) -> Prop,",
        "    div(a: A, b: A, @ok: Ok(b)) -> A,",
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
      ['Fmt/print("midpoint = (%, %)\\n")(mx)(my)'],
      ['Fmt/render("x = %")(point.x)'],
    ],
    gloss:
      "The literal's places fix the call's type: one argument per `%`, each resolving the `Show` witness for its own type, and a missing or surplus one is refused where the call is written. `\\%` is a literal percent. `Fmt/render` answers a `Str`, `Fmt/print` an `Io({})`",
  },
  {
    title: "A # place spells its argument",
    tag: "FORMAT",
    code: [
      [
        'Fmt/render("# and #")(Option/some(3))("x")',
        '-- Option/some(3) and "x"',
      ],
    ],
    gloss:
      "`#` is the place filled by `Spell` rather than `Show`: the value as source that reads back. The two mix in either order, `\\#` is a literal hash, and a declared type derives its witness with `satisfy Spell(T) { .. }`",
  },
  {
    title: "Postfix ! is monadic bind",
    tag: "EFFECTS",
    code: [
      [
        "let sum(a: Option(Nat), b: Option(Nat)) -> Option(Nat) =",
        "    let x = a!;",
        "    let y = b!;",
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
      [
        "let greeting: Io({}) =",
        '    print("hi");',
      ],
    ],
    gloss:
      "A host call builds an `Io` description and performs nothing — a program's tail is one `Io({})`, forced once. Nothing takes an `Io(T)` to a `T`",
  },
  {
    title: "Lifting across monads",
    tag: "EFFECTS",
    code: [
      [
        "let greeted: Try(Io, Io/Error, {}) =",
        '    let _ = print("hi\\n")!;',
        "    Try/pure(());",
      ],
    ],
    gloss:
      "A cross-monad action lifts through the declared `Monad/Lift` witness — `/std/Try` declares `Monad/Lift(Io, Try(M, E))` wherever `Io` lifts into `M`; edges never chain",
  },
  {
    title: "Try regions carry the failure",
    tag: "EFFECTS",
    code: [
      [
        "let copied: Try(Io, Io/Error, Bytes) =",
        "    let text = File/read_all(path)!;",
        "    let _ = File/write_all(copy, text)!;",
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
        "satisfy (@S: Type) => Monad((A: Type) => State(S, A)) {",
        "    pure(@A, a) = State/pure(a),",
        "    bind(@A, @B, m, f) = State/bind(m, f),",
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
        "let sym(@x: Nat, @y: Nat, p: Eq()(x, y)) -> Eq()(y, x) =",
        "    match p",
        "    | refl(@_) => Eq/refl()",
        "    end;",
      ],
    ],
    gloss:
      "All of it erases before runtime. `Eq`'s one parameter is implicit, so its first call is empty and the second carries the two indices. The arm is typed at its case, where `y` is `x`, so `Eq/refl()` proves the flipped equation",
  },
  {
    title: "Declare a test",
    tag: "TESTS",
    code: [["test the_answer_holds =", "    Test/assert(21 * 2 == 42);"]],
    gloss:
      "A `test` item is a description of type `/std/Test`, built from its combinators. It takes no parameters — a claim about every instantiation is a proposition, so it is a `let` — and is never `pub`, since its name is its report line rather than an export",
  },
  {
    title: "Foreign declarations",
    tag: "FOREIGN",
    code: [
      ["foreign random() -> Nat;"],
      ["pub foreign log(Bytes) -> Nat;"],
      [
        "foreign read(Handle, Nat) -> {",
        "    status: Nat,",
        "    bytes: Bytes};",
      ],
    ],
    gloss:
      "A function with no body, implemented outside the program. Its operands are wire types, spelled bare: `Nat`, `Int`, `Bool`, `Byte`, `Flt`, `Bytes`, `Handle`, `List(T)` and `Option(T)`. A result may also be a braced list of labelled ones. A call to one yields an `Io`, which suspends while its answer comes later, the rest of the program running on",
  },
];
