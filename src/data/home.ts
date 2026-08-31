import { GITHUB_URL, SYNTAX_URL } from "./site";

// Code shown on the landing page is pre-highlighted markup rather than plain text run through a highlighter at build time: there are exactly three snippets, they never change without someone editing this file, and a highlighter for a language this young would be a large amount of machinery to get four keywords amber. Two classes only — .kw for anything the language reserves, .cm for the comments that open each block.
export const HERO = {
  eyebrow: "DEPENDENTLY TYPED · COMPILES TO WEBASSEMBLY",
  heading: ["Small language.", "Big opinions about your arithmetic."],
  lead: "Types can depend on values, proofs live beside ordinary code, and the compiler is happy to double-check your math homework.",
  // Two files, not one read top to bottom: the first quotes the standard library's own Vec so the length in the type is on the page, the second is the program that imports it. Both are true of the shipped compiler — /std/Vec's cons really does take (x, xs) with the length erased, and the declaration below compiles as written.
  declaration: [
    '<span class="cm">-- This is how Vec is represented in the /std...</span>',
    '<span class="kw">pub induct</span> Vec(T: <span class="kw">Type</span>): (Nat) -> <span class="kw">pub Type</span>',
    "| nil(): (0)",
    "| cons(@m: Nat, x: T, xs: Vec(T, m)): (m + 1)",
    '<span class="kw">end</span>',
  ],
  usage: [
    '<span class="kw">use</span> /std/{Nat, Vec};',
    "",
    '<span class="cm">-- ...and this is what happens when you get the length wrong</span>',
    '<span class="kw">let</span> empty: Vec(Nat, 0) = Vec/nil();',
    '<span class="kw">let</span> single: Vec(Nat, 1) = empty;',
  ],
  // Transcribed from the real compiler against exactly the five lines above, which is why it reads a bare Vec — an imported name, not the /Vec a local declaration would print — and points at line 5. The --> line is the only part the browser build cannot produce, having no filename to name.
  diagnostic: [
    "while elaborating /single:",
    '<span class="kw">type mismatch</span>',
    "  inferred: Vec(Nat, 0)",
    "  expected: Vec(Nat, 1)",
    "",
    "   --> vector.crs:5:27",
    "    5 | let single: Vec(Nat, 1) = empty;",
    '      |                           <span class="kw">^^^^^</span>',
  ],
  note: "Two different types, so the off-by-one never reaches the generated program. There is nothing to test for, because there is nothing to run — and the `@m` that made it work does its thinking at compile time, then goes home.",
};

export interface Feature {
  kicker: string;
  body: string;
}

export const FEATURES: Feature[] = [
  {
    kicker: "DEPENDENT TYPES",
    body: "Dependent function and tuple types, indexed inductive families, and pattern matching that works out exhaustiveness so you do not have to pretend you did.",
  },
  {
    kicker: "UNIVERSES",
    body: "A cumulative hierarchy of `Type`, with levels inferred rather than written by hand — nobody has ever enjoyed writing one down.",
  },
  {
    kicker: "PROP",
    body: "A proof-irrelevant `Prop`, so proofs weigh nothing at runtime. It is the only fair price for a proof.",
  },
  {
    kicker: "ERASURE",
    body: "Erased arguments — anything marked `@` — guide the checking and then vanish from the output without saying goodbye.",
  },
  {
    kicker: "CONCEPTS",
    body: "`concept` and `satisfy` for ad-hoc polymorphism: one witness per key, program-wide, so which implementation runs is never a surprise about the call site.",
  },
  {
    kicker: "STANDARD LIBRARY",
    body: "Collections, formatting, IO, networking, tasks, time, randomness, arbitrary-precision integers, JSON, and TOML. Yes, TOML.",
  },
  {
    kicker: "ONE PIPELINE",
    body: "One lowering pipeline from source to WebAssembly, in a terminal or a browser tab. There is no second pipeline waiting to disagree with the first.",
  },
  {
    kicker: "EDITOR SUPPORT",
    body: "Zed and VS Code extensions highlight `.crs` and launch `curios wonder server`, so the compiler you already have can interrupt you sooner.",
  },
];

export interface Resource {
  title: string;
  body: string;
  href: string;
}

export const RESOURCES: Resource[] = [
  {
    title: "Language reference",
    body: "The complete surface language — what something means and how to spell it.",
    href: SYNTAX_URL,
  },
  {
    title: "Usage",
    body: "Every subcommand, flag, and package concept the command line offers.",
    href: `${GITHUB_URL}/blob/main/documentation/usage.md`,
  },
  {
    title: "Design decisions",
    body: "One file per decision — why Curios is the way it is.",
    href: `${GITHUB_URL}/tree/main/documentation/design`,
  },
  {
    title: "Soundness perimeter",
    body: "Every rule that can admit a term, and how far it has actually been checked.",
    href: `${GITHUB_URL}/blob/main/documentation/soundness.md`,
  },
  {
    title: "Roadmap",
    body: "What exists, what is pending, and the specifications for the pending half.",
    href: `${GITHUB_URL}/blob/main/documentation/roadmap.md`,
  },
  {
    title: "Benchmarks",
    body: "Methodology and results, including what the abstractions cost.",
    href: `${GITHUB_URL}/blob/main/benchmarks/README.md`,
  },
];

export const CLOSING = {
  heading: "If you are still here",
  body: "Curios is early, experimental, and under active development — syntax, standard library, and compiler may all change without notice.",
  licence: "APACHE-2.0",
};
