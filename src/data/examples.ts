// The playground's examples, in the order their chips appear; the first is the one a fresh page opens on. Each is a real file, ./examples/<name>.crs, so it reads as the program it is rather than as a string full of escapes, and so the compiler's own tools can reach it: `npm run check` formats, lints and runs every one against the pinned release.
//
// An example that runs needs no more than its name. One that exists to be refused says what it is meant to show — how many errors, how many goals — and the check holds it to exactly that, so a release that stops reporting one of its mistakes is caught rather than quietly leaving the example with less to teach.
//
// Nothing Vite-only in here — no glob, no `?raw` — because scripts/check.mjs reads this file with Node directly. The playground script is the one that globs the files in.
export interface Example {
  name: string;
  errors?: number;
  goals?: number;
}

export const EXAMPLES: Example[] = [
  { name: "hello" },
  { name: "midpoint" },
  { name: "patch" },
  { name: "shapes" },
  { name: "cache" },
  { name: "scores" },
  { name: "readings" },
  { name: "points" },
  { name: "nonempty" },
  { name: "laws" },
  { name: "holes", goals: 2 },
  { name: "mistakes", errors: 5 },
];
