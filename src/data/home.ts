import { GITHUB_URL, LANGUAGE_URL } from "./site";

// Code shown on the landing page is plain Curios, highlighted at build time by the compiler's own grammar (src/lib/highlight.ts) and held to `curios format` by `npm run check`.
export const HERO = {
  eyebrow: "DEPENDENTLY TYPED · COMPILES TO WEBASSEMBLY",
  // Four lines, two to a sentence, broken where they are meant to break rather than wherever the box runs out: "your rhetoric." and "your arithmetic." each open a line instead of trailing the one above it, at every width. The two things the opinions are about are set a tier brighter than the rest, marked up here, and the full stop stays outside the mark: it belongs to the sentence, not the word.
  heading: [
    "Mild opinions about",
    "your <em>rhetoric</em>.",
    "Strong feelings about",
    "your <em>arithmetic</em>.",
  ],
  lead: "Types can depend on values, proofs live beside ordinary code, and the compiler is happy to double-check your math homework.",
  // The file the program is, named in the bar over it, and run by the terminal below it under that name — the name is also on the output's first line, which `npm run check` holds to what the compiler prints.
  file: "vector.crs",
  // The program the terminal below it runs. A program rather than a module, so the terminal can show the command a reader would type to see the refusal: `curios run`. The last line is never reached, which is the point.
  program: [
    "use /std/{Nat, Vec, print};",
    "",
    "let empty: Vec(Nat, 0) =",
    "    Vec/nil();",
    "",
    "let single: Vec(Nat, 1) =",
    "    empty;",
    "",
    'print("unreachable\\n")',
  ],
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
    kicker: "DECIDED ALGEBRA",
    body: "A `Vec(T, n + m)` is a `Vec(T, m + n)`, with nothing to prove — conversion decides the carriers' algebra, so your lemma is already a law.",
  },
  {
    kicker: "BOUNDS, NOT CHECKS",
    body: "Division and indexing carry a precondition rather than a runtime trap. A guard discharges it by its own decision, and no proof is ever named.",
  },
  {
    kicker: "NON-BLOCKING IO",
    body: "IO where non-blocking is not a suggestion: a wait suspends only the branch that waits, while the other branches carry on without noticing.",
  },
  {
    kicker: "ERASURE",
    body: "A proof-irrelevant `Prop`, and erased arguments — anything marked `@` — that guide the checking and then vanish without saying goodbye.",
  },
  {
    kicker: "STANDARD LIBRARY",
    body: "Collections, formatting, IO, the filesystem, processes, networking, time, randomness, packed byte strings, JSON, and TOML. Yes, TOML.",
  },
  {
    kicker: "ONE PIPELINE",
    body: "One lowering pipeline from source to WebAssembly, in a terminal or a browser tab. There is no second pipeline waiting to disagree with the first.",
  },
  {
    kicker: "EDITOR SUPPORT",
    body: "Zed and VS Code extensions highlight `.crs` and launch `curios wonder --server`, so the compiler you already have can interrupt you sooner.",
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
    href: LANGUAGE_URL,
  },
  {
    title: "Usage reference",
    body: "Every subcommand, flag, and package concept the command line offers.",
    href: `${GITHUB_URL}/blob/main/documentation/usage.md`,
  },
  {
    title: "Design decisions",
    body: "One file per decision, in a directory per subject — why Curios is the way it is.",
    href: `${GITHUB_URL}/tree/main/documentation/design`,
  },
  {
    title: "Soundness board",
    body: "Every rule that can admit a term, argued in an entry, and a ticket for each proof of falsehood found through one.",
    href: `${GITHUB_URL}/tree/main/documentation/design/soundness`,
  },
  {
    title: "Roadmap",
    body: "Pending work, each area's findings and the specifications that own it.",
    href: `${GITHUB_URL}/tree/main/documentation/roadmap`,
  },
  {
    title: "Benchmarks",
    body: "An orientation bench against Rust, native and compiled to WebAssembly — how a figure is read, and what the readings say.",
    href: `${GITHUB_URL}/blob/main/xbench/README.md`,
  },
];

export const CLOSING = {
  heading: "If you are still here",
  body: "Curios is early, experimental, and under active development — syntax, standard library, and compiler may all change without notice.",
};
