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
  midpoint: {
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
      "let (mx, my) = bounds(m);\n\n" +
      'Fmt/print("midpoint = (%, %)\\n")(mx)(my)',
  },
  patch: {
    label: "patch.crs",
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
  shapes: {
    label: "shapes.crs",
    code:
      "use /std/{Fmt, List, Nat, Option, Str};\n\n" +
      "let combine(a: Option(Nat), b: Option(Nat)) -> Nat =\n" +
      "    match (a, b)\n" +
      "    | (some(x), some(y)) => x + y\n" +
      "    | (some(x), none()) | (none(), some(x)) => x\n" +
      "    | (none(), none()) => 0\n" +
      "    end;\n\n" +
      "let shape(values: List(Nat)) -> Str =\n" +
      "    match values\n" +
      '    | [] => "empty"\n' +
      '    | [_] => "one"\n' +
      '    | [x, y, .._], x == y => "opens with a pair"\n' +
      '    | _ => "many"\n' +
      "    end;\n\n" +
      'Fmt/print("combine = %, shape = %\\n")(combine(Option/some(3), Option/none()))(shape([4, 4, 2]))',
  },
  cache: {
    label: "cache.crs",
    code:
      "use /std/{Bool, Fmt, Nat, Option};\n\n" +
      "let select(prefer_fresh: Bool, cached: Option(Nat), fresh: Nat) -> Nat =\n" +
      "    match\n" +
      "    | prefer_fresh, fresh > 0 => fresh\n" +
      "    | some(n) = cached, n > 0 => n\n" +
      "    | _ => 0\n" +
      "    end;\n\n" +
      'Fmt/print("choice = %\\n")(select(false, Option/some(21), 5))',
  },
  scores: {
    label: "scores.crs",
    code:
      "use /std/{Fmt, Nat, Str, Map, print};\n\n" +
      "let m0: Map(Str, Nat) =\n" +
      "    Map/empty();\n\n" +
      "let m1: Map(Str, Nat) =\n" +
      '    Map/insert(m0, "ada", 92);\n\n' +
      "let m2: Map(Str, Nat) =\n" +
      '    Map/insert(m1, "grace", 87);\n\n' +
      "let m3: Map(Str, Nat) =\n" +
      '    Map/insert(m2, "alan", 95);\n\n' +
      'match Map/try_get(m3, "grace")\n' +
      '| some(score) => Fmt/print("grace scored % out of % entries\\n")(score)(Map/len(m3))\n' +
      '| none() => print("no such entry\\n")\n' +
      "end",
  },
  readings: {
    label: "readings.crs",
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
  points: {
    label: "points.crs",
    code:
      "use /std/{Fmt, Nat, Spell};\n" +
      "use /std/ops/{Add};\n\n" +
      "pub struct Point: pub Type {\n" +
      "    x: Nat,\n" +
      "    y: Nat,\n" +
      "}\n\n" +
      "satisfy Add(Point) {\n" +
      "    add(a, b) = Point { x = a.x + b.x, y = a.y + b.y },\n" +
      "}\n\n" +
      "satisfy Spell(Point) {\n" +
      "    ..\n" +
      "}\n\n" +
      "let p: Point =\n" +
      "    Point { x = 1, y = 2 } + Point { x = 3, y = 4 };\n\n" +
      'Fmt/print("p = #\\n")(p)',
  },
  nonempty: {
    label: "nonempty.crs",
    code:
      "use /std/{Fmt, Nat, Vec};\n\n" +
      "pub let head(@T: Type, @n: Nat, xs: Vec(T, n + 1)) -> T =\n" +
      "    Vec/first(xs);\n\n" +
      'Fmt/print("head = %\\n")(head(Vec/cons(7, Vec/cons(8, Vec/nil()))))',
  },
  laws: {
    label: "laws.crs",
    code:
      "use /std/{Eq, List, Nat, print};\n\n" +
      "pub let sum(values: List(Nat)) -> Nat =\n" +
      "    match values | [] => 0 | [head, ..tail] => head + sum(tail) end;\n\n" +
      "pub let commutes(a: Nat, b: Nat) -> Eq()(a + b, b + a) =\n" +
      "    Eq/refl();\n\n" +
      "pub let lengths(\n" +
      "    @T: Type,\n" +
      "    xs: List(T),\n" +
      "    ys: List(T),\n" +
      ") -> Eq()(List/len([..xs, ..ys]), List/len(xs) + List/len(ys)) =\n" +
      "    Eq/refl();\n\n" +
      "pub let sums(xs: List(Nat), ys: List(Nat)) -> Eq()(sum([..xs, ..ys]), sum(xs) + sum(ys)) =\n" +
      "    match xs\n" +
      "    | [] => Eq/refl()\n" +
      "    | [head, ..tail] => Eq/cong((s: Nat) => head + s, sums(tail, ys))\n" +
      "    end;\n\n" +
      'print("every proof checked\\n")',
  },
  holes: {
    label: "holes.crs",
    code:
      "use /std/{Nat, print};\n\n" +
      "pub induct Vec(T: Type): (Nat) -> pub Type\n" +
      "| nil(): (0)\n" +
      "| cons(@m: Nat, x: T, xs: Vec(T)(m)): (m + 1)\n" +
      "end\n\n" +
      "pub let append(@T: Type, @n: Nat, @k: Nat, v: Vec(T)(n), w: Vec(T)(k)) -> Vec(T)(n + k) =\n" +
      "    match v | nil() => ? | cons(@m, x, xs) => Vec/cons(x, ?) end;\n\n" +
      'print("unreachable\\n")',
  },
  mistakes: {
    label: "mistakes.crs",
    code:
      "use /std/{Bool, Nat, Vec, print};\n" +
      "use /std/Bool/{False};\n\n" +
      "pub let broken(@n: Nat) -> Vec(Nat, n) =\n" +
      "    Vec/cons(0, Vec/nil());\n\n" +
      "pub let ratio(n: Nat, d: Nat) -> Nat =\n" +
      "    n / d;\n\n" +
      "pub let pick(b: Bool) -> Nat =\n" +
      "    match b | true => 1 end;\n\n" +
      "pub let absurd(n: Nat) -> False =\n" +
      "    absurd(n + 1);\n\n" +
      "pub let total: Natt =\n" +
      "    3;\n\n" +
      'print("unreachable\\n")',
  },
};
