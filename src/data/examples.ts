export interface CuriosExample {
  tab: string;
  label: string;
  code: string;
}

// Single source of truth for the curios snippets shown in the playground
// (full set) and the homepage preview (a curated subset, see PREVIEW_KEYS).
export const EXAMPLES: Record<string, CuriosExample> = {
  hello: {
    tab: "hello world",
    label: "hello.crs",
    code: 'use /std/{Io};\n\nIo/print("Hello, world!\\n")',
  },
  vec: {
    tab: "vec append",
    label: "vec.crs",
    code:
      "use /std/{Io, Nat};\n\n" +
      "pub induct Vec(T : Type) : (n : Nat) -> Type\n" +
      "| nil() : (0)\n" +
      "| cons(@m : Nat, x : T, xs : Vec(T, m)) : (m + 1)\n" +
      "end\n\n" +
      "pub rec append(@T : Type, @n : Nat, @m : Nat, v : Vec(T, n), w : Vec(T, m)) -> Vec(T, n + m) =\n" +
      "    match v : (v : Vec(T, k)) => Vec(T, k + m)\n" +
      "    | nil()          => w\n" +
      "    | cons(j, x, xs) => Vec/cons(x, append(xs, w))\n" +
      "    end;\n\n" +
      'Io/print("typechecks: Vec/append\\n")',
  },
  sym: {
    tab: "sym proof",
    label: "sym.crs",
    code:
      "use /std/{Io, Eq};\n\n" +
      "pub let sym(@A : Type, @x : A, @y : A, p : Eq(x, y)) -> Eq(y, x) =\n" +
      "    match p : (q : Eq(A, s, t)) => Eq(t, s)\n" +
      "    | refl(z) => Eq/refl()\n" +
      "    end;\n\n" +
      'Io/print("typechecks: sym\\n")',
  },
  concepts: {
    tab: "ad-hoc polymorphism",
    label: "point.crs",
    code:
      "use /std/{Io, Nat, Str, Add};\n\n" +
      "pub record Point : Type {\n" +
      "    x : Nat,\n" +
      "    y : Nat,\n" +
      "}\n\n" +
      "witness : Add(Point) {\n" +
      "    add(a, b) = Point { x = a.x + b.x, y = a.y + b.y }\n" +
      "}\n\n" +
      "let p : Point = Point { x = 1, y = 2 } + Point { x = 3, y = 4 };\n\n" +
      'Io/print(Str/concat("p.x + p.y = ", Str/concat(Nat/to_str(p.x + p.y), "\\n")))',
  },
  erased: {
    tab: "erased arg",
    label: "erased.crs",
    code:
      "use /std/{Io, Nat, Vec};\n\n" +
      "pub let head(@T : Type, @n : Nat, xs : Vec(T, n + 1)) -> T =\n" +
      "    match xs : (xs : Vec(T, k)) => T\n" +
      "    | cons(_, x, _) => x\n" +
      "    end;\n\n" +
      'Io/print("typechecks: head, n erased\\n")',
  },
  error: {
    tab: "type error",
    label: "broken.crs",
    code:
      "use /std/{Io, Nat, Vec};\n\n" +
      "pub let broken(@n : Nat) -> Vec(Nat, n) =\n" +
      "    Vec/cons(0, Vec/nil());\n\n" +
      'Io/print("unreachable\\n")',
  },
};

// Which examples the homepage preview shows (a subset of the full playground).
export const PREVIEW_KEYS = ["hello", "vec", "concepts", "error"];

// The syntax-highlighted excerpt shown in the homepage hero. It's a trimmed,
// hand-highlighted subset of the `vec` example above (just the type
// declaration, not the full append function), so it's kept as its own small
// dataset rather than derived from EXAMPLES.vec.code.
export const HERO_SNIPPET = {
  filename: "vec.crs",
  lines: [
    '<span class="cm">-- a vector indexed by its own length</span>',
    '<span class="kw">pub induct</span> <span class="ty">Vec</span>(T : <span class="ty">Type</span>) : (n : <span class="ty">Nat</span>) -&gt; Type',
    "| nil() : (0)",
    "| cons(@m : Nat, x : T, xs : Vec(T, m)) : (m + 1)",
    '<span class="kw">end</span>',
  ],
};
