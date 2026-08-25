export interface CuriosExample {
  label: string;
  code: string;
}

export const EXAMPLES: Record<string, CuriosExample> = {
  hello: {
    label: "hello.crs",
    code:
      "use /std/{print};\n\n" +
      'print("Hello, world!\\n")',
  },
  destructure: {
    label: "midpoint.crs",
    code:
      "use /std/{Fmt, Nat};\n\n" +
      "pub struct Point: pub Type {\n" +
      "    x: Nat,\n" +
      "    y: Nat,\n" +
      "}\n\n" +
      "let midpoint(Point { x = ax, y = ay }: Point, Point { x = bx, y = by }: Point) -> Point =\n" +
      "    Point { x = (ax + bx) / 2, y = (ay + by) / 2 };\n\n" +
      "let bounds(p: Point) -> {Nat, Nat} =\n" +
      "    (p.x, p.y);\n\n" +
      "let m: Point =\n" +
      "    midpoint(Point { x = 0, y = 0 }, Point { x = 4, y = 10 });\n\n" +
      "let (mx, my) = bounds(m);\n" +
      'Fmt/print("midpoint = (%, %)\\n")(mx)(my)',
  },
  spread: {
    label: "spread.crs",
    code:
      "use /std/{Fmt, Nat, List};\n\n" +
      "pub struct Point: pub Type {\n" +
      "    x: Nat,\n" +
      "    y: Nat,\n" +
      "}\n\n" +
      "let p: Point =\n" +
      "    Point { x = 1, y = 2 };\n\n" +
      "let q: Point =\n" +
      "    Point { ..p, y = 9 };\n\n" +
      "let base: List(Nat) =\n" +
      "    [2, 3, 4];\n\n" +
      "let padded: List(Nat) =\n" +
      "    [1, ..base, 5];\n\n" +
      'Fmt/print("q = (%, %), padded has % elems\\n")(q.x)(q.y)(List/len(padded))',
  },
  patterns: {
    label: "combine.crs",
    code:
      "use /std/{Option, Nat, Fmt};\n\n" +
      "let combine(a: Option(Nat), b: Option(Nat)) -> Nat =\n" +
      "    match (a, b)\n" +
      "    | (some(x), some(y)) => x + y\n" +
      "    | (some(x), none()) => x\n" +
      "    | (none(), some(y)) => y\n" +
      "    | (none(), none()) => 0\n" +
      "    end;\n\n" +
      'Fmt/print("combine = %\\n")(combine(Option/some(3), Option/some(4)))',
  },
  "cond match": {
    label: "select.crs",
    code:
      "use /std/{Bool, Fmt, Nat, Option};\n\n" +
      "let select(prefer_fresh: Bool, cached: Option(Nat), fresh: Nat) -> Nat =\n" +
      "    choose\n" +
      "    | prefer_fresh && fresh > 0 => fresh\n" +
      "    | some(n) = cached => n\n" +
      "    | _ => 0\n" +
      "    end;\n\n" +
      'Fmt/print("choice = %\\n")(select(true, Option/some(21), 5))',
  },
  map: {
    label: "scores.crs",
    code:
      "use /std/{Fmt, Nat, Map, Option, print};\n\n" +
      "let m0: Map(Nat) =\n" +
      "    Map/empty();\n\n" +
      "let m1: Map(Nat) =\n" +
      '    Map/insert(m0, "ada", 92);\n\n' +
      "let m2: Map(Nat) =\n" +
      '    Map/insert(m1, "grace", 87);\n\n' +
      "let m3: Map(Nat) =\n" +
      '    Map/insert(m2, "alan", 95);\n\n' +
      'match Map/get(m3, "grace")\n' +
      '| some(score) => Fmt/print("grace scored % out of % entries\\n")(score)(Map/len(m3))\n' +
      '| none() => print("no such entry\\n")\n' +
      "end",
  },
  donotation: {
    label: "sum_all.crs",
    code:
      "use /std/{Nat, Option, Fmt, print};\n\n" +
      "let sum_all(a: Option(Nat), b: Option(Nat), c: Option(Nat)) -> Option(Nat) =\n" +
      "    let x = a!;\n" +
      "    let y = b!;\n" +
      "    let z = c!;\n" +
      "    Option/some(x + y + z);\n\n" +
      "match sum_all(Option/some(3), Option/some(4), Option/some(5))\n" +
      '| some(n) => Fmt/print("sum = %\\n")(n)\n' +
      '| none() => print("missing a reading\\n")\n' +
      "end",
  },
  concepts: {
    label: "point.crs",
    code:
      "use /std/{Nat, Fmt, Add};\n\n" +
      "pub struct Point: pub Type {\n" +
      "    x: Nat,\n" +
      "    y: Nat,\n" +
      "}\n\n" +
      "satisfy Add(Point) {\n" +
      "    add(a, b) = Point { x = a.x + b.x, y = a.y + b.y },\n" +
      "}\n\n" +
      "let p: Point =\n" +
      "    Point { x = 1, y = 2 } + Point { x = 3, y = 4 };\n\n" +
      'Fmt/print("p.x + p.y = %\\n")(p.x + p.y)',
  },
  erased: {
    label: "erased.crs",
    code:
      "use /std/{Nat, Vec, print};\n\n" +
      "pub let head(@T: Type, @n: Nat, xs: Vec(T, n + 1)) -> T =\n" +
      "    match xs\n" +
      "    | cons(@_, x, _) => x\n" +
      "    end;\n\n" +
      'print("typechecks: head, n erased\\n")',
  },
  vec: {
    label: "vec.crs",
    code:
      "use /std/{Nat, print};\n\n" +
      "pub induct Vec(T: Type): (Nat) -> pub Type\n" +
      "| nil(): (0)\n" +
      "| cons(@m: Nat, x: T, xs: Vec(T, m)): (m + 1)\n" +
      "end\n\n" +
      "pub rec append(@T: Type, @n: Nat, @m: Nat, v: Vec(T, n), w: Vec(T, m)) -> Vec(T, n + m) =\n" +
      "    match v\n" +
      "    | nil() => w\n" +
      "    | cons(@j, x, xs) => Vec/cons(x, append(xs, w))\n" +
      "    end;\n\n" +
      'print("typechecks: Vec/append\\n")',
  },
  sym: {
    label: "sym.crs",
    code:
      "use /std/{Eq, print};\n\n" +
      "pub let sym(@A: Type, @x: A, @y: A, p: Eq(x, y)) -> Eq(y, x) =\n" +
      "    match p\n" +
      "    | refl(@z) => Eq/refl()\n" +
      "    end;\n\n" +
      'print("typechecks: sym\\n")',
  },
  goal: {
    label: "goal.crs",
    code:
      "use /std/{print};\n\n" +
      "pub let compose(@A: Type, @B: Type, @C: Type, f: (B) -> C, g: (A) -> B) -> (A) -> C =\n" +
      "    ?;\n\n" +
      'print("unreachable\\n")',
  },
  error: {
    label: "broken.crs",
    code:
      "use /std/{Nat, Vec, print};\n\n" +
      "pub let broken(@n: Nat) -> Vec(Nat, n) =\n" +
      "    Vec/cons(0, Vec/nil());\n\n" +
      'print("unreachable\\n")',
  },
};

export const PREVIEW_KEYS = ["hello", "patterns", "cond match", "concepts", "vec", "error"];

export const HERO_SNIPPET = {
  filename: "lengths.crs",
  lines: [
    '<span class="cm">-- a vector indexed by its own length</span>',
    '<span class="kw">pub induct</span> <span class="ty">Vec</span>(T: <span class="ty">Type</span>): (<span class="ty">Nat</span>) -&gt; <span class="kw">pub</span> <span class="ty">Type</span>',
    "| nil(): (0)",
    "| cons(@m: Nat, x: T, xs: Vec(T, m)): (m + 1)",
    '<span class="kw">end</span>',
    "",
    '<span class="cm">-- head is total: Vec(T, n + 1) is never empty</span>',
    '<span class="kw">pub let</span> head(@T: <span class="ty">Type</span>, @n: <span class="ty">Nat</span>,',
    "             xs: Vec(T, n + 1)) -&gt; T =",
    '    <span class="kw">match</span> xs',
    "    | cons(@_, x, _) =&gt; x",
    '    <span class="kw">end</span>;',
    "",
    '<span class="cm">-- appending adds the lengths, provably</span>',
    '<span class="kw">pub rec</span> append(@T: <span class="ty">Type</span>, @n: <span class="ty">Nat</span>, @m: <span class="ty">Nat</span>,',
    "               v: Vec(T, n), w: Vec(T, m))",
    "    -&gt; Vec(T, n + m) =",
    '    <span class="kw">match</span> v',
    "    | nil() =&gt; w",
    "    | cons(@j, x, xs) =&gt;",
    "        Vec/cons(x, append(xs, w))",
    '    <span class="kw">end</span>;',
  ],
};
