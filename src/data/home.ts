import { GITHUB_URL, SYNTAX_URL } from "./site";

// Code shown on the landing page is pre-highlighted markup rather than plain text run through a highlighter at build time: there are exactly three snippets, they never change without someone editing this file, and a highlighter for a language this young would be a large amount of machinery to get four keywords amber. Two classes only — .kw for anything the language reserves, .cm for the comments that open each block.
export const HERO = {
  eyebrow: "DEPENDENTLY TYPED · COMPILES TO WEBASSEMBLY",
  // Four lines, two to a sentence, broken where they are meant to break rather than wherever the box runs out: "your rhetoric." and "your arithmetic." each open a line instead of trailing the one above it, at every width. The two things the opinions are about are set a tier brighter than the rest, marked up here as the code below is, and the full stop stays outside the mark: it belongs to the sentence, not the word.
  heading: [
    "Mild opinions about",
    "your <em>rhetoric</em>.",
    "Strong feelings about",
    "your <em>arithmetic</em>.",
  ],
  lead: "Types can depend on values, proofs live beside ordinary code, and the compiler is happy to double-check your math homework.",
  // Two files, not one read top to bottom: the first quotes the standard library's own Vec so the length in the type is on the page, the second is the program that imports it. Both are true of the shipped compiler — /std/Vec really is a list beside a proof that counts it, and the declarations below compile as written.
  declaration: [
    '<span class="cm">-- This is how Vec is represented in the /std...</span>',
    '<span class="kw">pub let</span> Counted(@T: <span class="kw">Type</span>, l: List(T), n: Nat) -> <span class="kw">Prop</span> =',
    "    Eq()(List/len(l), n);",
    "",
    '<span class="kw">pub struct</span> Vec(T: <span class="kw">Type</span>, n: Nat): <span class="kw">pub Type</span> {',
    "    list: List(T),",
    "    counted: Counted(list, n),",
    "}",
  ],
  usage: [
    '<span class="kw">use</span> /std/{Nat, Vec};',
    "",
    '<span class="cm">-- ...and this is what happens when you get the length wrong</span>',
    '<span class="kw">let</span> empty: Vec(Nat, 0) = Vec/nil();',
    '<span class="kw">let</span> single: Vec(Nat, 1) = empty;',
  ],
  // Transcribed from the real compiler against exactly the five lines above, which is why it reads a bare Vec — an imported name, not the /Vec a local declaration would print — names /vector/single, since items with no final term are checked as a module mounted at the file's stem, and points at line 5. The --> line and that stem are the parts the browser build cannot produce, having no filename to name.
  diagnostic: [
    "while elaborating /vector/single:",
    '<span class="kw">type mismatch</span>',
    "  inferred: Vec(Nat, 0)",
    "  expected: Vec(Nat, 1)",
    "",
    "   --> vector.crs:5:27",
    "    5 | let single: Vec(Nat, 1) = empty;",
    '      |                           <span class="kw">^^^^^</span>',
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
    kicker: "ERASURE",
    body: "A proof-irrelevant `Prop`, and erased arguments — anything marked `@` — that guide the checking and then vanish without saying goodbye.",
  },
  {
    kicker: "WEBASSEMBLY INTEROP",
    body: "A `foreign` declaration is answered by a WebAssembly module the manifest pins by hash. `curios compile` folds it in, so the executable travels alone.",
  },
  {
    kicker: "STANDARD LIBRARY",
    body: "Collections, formatting, IO, the filesystem, processes, networking, tasks, time, randomness, packed bit and byte strings, JSON, and TOML. Yes, TOML.",
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
    body: "What exists, what is pending, and the specifications for the pending half.",
    href: `${GITHUB_URL}/blob/main/documentation/roadmap.md`,
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
  licence: "APACHE-2.0",
};
