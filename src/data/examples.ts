export interface CuriosExample {
  tab: string;
  label: string;
  code: string;
}

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
      "    | nil() => w\n" +
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
      "use /std/{Nat, Fmt, Add};\n\n" +
      "pub struct Point : pub Type {\n" +
      "    x : Nat,\n" +
      "    y : Nat,\n" +
      "}\n\n" +
      "satisfy Add(Point) {\n" +
      "    add(a, b) = Point { x = a.x + b.x, y = a.y + b.y }\n" +
      "}\n\n" +
      "let p : Point = Point { x = 1, y = 2 } + Point { x = 3, y = 4 };\n\n" +
      'Fmt/print("p.x + p.y = %d\\n")(p.x + p.y)',
  },
  destructure: {
    tab: "destructuring",
    label: "midpoint.crs",
    code:
      "use /std/{Fmt, Nat};\n\n" +
      "pub struct Point : pub Type { x : Nat, y : Nat }\n\n" +
      "let midpoint(Point { x = ax, y = ay } : Point, Point { x = bx, y = by } : Point) -> Point =\n" +
      "    Point { x = (ax + bx) / 2, y = (ay + by) / 2 };\n\n" +
      "let bounds(p : Point) -> { Nat, Nat } = (p.x, p.y);\n\n" +
      "let m : Point = midpoint(Point { x = 0, y = 0 }, Point { x = 4, y = 10 });\n" +
      "let (mx, my) = bounds(m);\n\n" +
      'Fmt/print("midpoint = (%d, %d)\\n")(mx)(my)',
  },
  spread: {
    tab: "spread syntax",
    label: "spread.crs",
    code:
      "use /std/{Fmt, Nat, Lst};\n\n" +
      "pub struct Point : pub Type { x : Nat, y : Nat }\n\n" +
      "let p : Point = Point { x = 1, y = 2 };\n" +
      "let q : Point = Point { ..p, y = 9 };\n\n" +
      "let base : Lst(Nat) = [2, 3, 4];\n" +
      "let padded : Lst(Nat) = [1, ..base, 5];\n\n" +
      'Fmt/print("q = (%d, %d), padded has %d elems\\n")(q.x)(q.y)(Lst/len(padded))',
  },
  map: {
    tab: "map lookup",
    label: "scores.crs",
    code:
      "use /std/{Fmt, Io, Nat, Map, Option};\n\n" +
      "let m0 : Map(Nat) = Map/empty();\n" +
      'let m1 : Map(Nat) = Map/set(m0, "ada", 92);\n' +
      'let m2 : Map(Nat) = Map/set(m1, "grace", 87);\n' +
      'let m3 : Map(Nat) = Map/set(m2, "alan", 95);\n\n' +
      'match Map/get(m3, "grace")\n' +
      '| some(score) => Fmt/print("grace scored %d out of %d entries\\n")(score)(Map/len(m3))\n' +
      '| none() => Io/print("no such entry\\n")\n' +
      "end",
  },
  patterns: {
    tab: "nested match",
    label: "combine.crs",
    code:
      "use /std/{Option, Nat, Fmt};\n\n" +
      "let combine(a : Option(Nat), b : Option(Nat)) -> Nat =\n" +
      "    match (a, b)\n" +
      "    | (some(x), some(y)) => x + y\n" +
      "    | (some(x), none()) => x\n" +
      "    | (none(), some(y)) => y\n" +
      "    | (none(), none()) => 0\n" +
      "    end;\n\n" +
      'Fmt/print("combine = %d\\n")(combine(Option/some(3), Option/some(4)))',
  },
  condmatch: {
    tab: "cond match",
    label: "choose.crs",
    code:
      "use /std/{Bool, Fmt, Nat, Option};\n\n" +
      "let choose(prefer_fresh : Bool, cached : Option(Nat), fresh : Nat) -> Nat =\n" +
      "    match\n" +
      "    | prefer_fresh && fresh > 0 => fresh\n" +
      "    | some(n) = cached => n\n" +
      "    | _ => 0\n" +
      "    end;\n\n" +
      'Fmt/print("choice = %d\\n")(choose(true, Option/some(21), 5))',
  },
  donotation: {
    tab: "do-notation",
    label: "sum_all.crs",
    code:
      "use /std/{Io, Nat, Option, Fmt};\n\n" +
      "let sum_all(a : Option(Nat), b : Option(Nat), c : Option(Nat)) -> Option(Nat) =\n" +
      "    let x = a!;\n" +
      "    let y = b!;\n" +
      "    let z = c!;\n" +
      "    Option/some(x + y + z);\n\n" +
      "match sum_all(Option/some(3), Option/some(4), Option/some(5))\n" +
      '| some(n) => Fmt/print("sum = %d\\n")(n)\n' +
      '| none() => Io/print("missing a reading\\n")\n' +
      "end",
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
  goal: {
    tab: "written goal",
    label: "goal.crs",
    code:
      "use /std/{Io};\n\n" +
      "pub let compose(@A : Type, @B : Type, @C : Type, f : (B) -> C, g : (A) -> B) -> (A) -> C =\n" +
      "    ?;\n\n" +
      'Io/print("unreachable\\n")',
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

export const PREVIEW_KEYS = ["hello", "vec", "patterns", "condmatch", "concepts", "error"];

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
