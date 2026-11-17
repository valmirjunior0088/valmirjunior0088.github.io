// Curios, highlighted by the TextMate grammar the pinned release ships for its editors, with the table it ships beside it: `curios-grammars.tar.gz`, which scripts/fetch.mjs unpacks into .artifacts/grammars. One module for both places that highlight: the build, which turns the cheatsheet and the home page's code into static markup, and the playground's editor, which highlights as you type.
import { createHighlighterCoreSync, type HighlighterCore, type LanguageRegistration, type ThemeRegistration } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import styles from "./highlight.module.css";

// classes.json: each of the compiler's classes, by the name the compiler gives it, with the scopes the grammars write for it — and apart from them the scopes of a name the grammars leave unclassed.
type Table = { classes: Record<string, string[]>; unclassed: string[] };

// A checkout that never ran the fetch has neither, and its code stays plain rather than its build failing.
const grammar = Object.values(import.meta.glob<LanguageRegistration>("/.artifacts/grammars/curios.tmLanguage.json", { eager: true, import: "default" }))[0];
const table = Object.values(import.meta.glob<Table>("/.artifacts/grammars/classes.json", { eager: true, import: "default" }))[0];

// A token's scope is mapped to a class by the release's table rather than one kept here, so a scope a release renames moves with the table instead of falling out of the palette unseen. Which colour a class wears is highlight.module.css's, by the class's own name: a class it has no rule for is drawn plain.
//
// The table, as a theme Shiki can match scopes with: each class is a colour that is really an index, read back off the token. A class no grammar writes a scope for is left out, and plain text keeps the theme's own foreground, which indexes nothing.
const classes = table?.classes ?? {};
const names = Object.keys(classes).filter((name) => classes[name].length);
const marker = (index: number) => `#0000${(index + 1).toString(16).padStart(2, "0")}`;
const theme: ThemeRegistration = {
  name: "classes",
  type: "dark",
  fg: "#000000",
  bg: "#000000",
  settings: names.map((name, index) => ({ scope: classes[name], settings: { foreground: marker(index) } })),
};
const classOf = new Map(names.map((name, index) => [marker(index), name]));

let highlighter: HighlighterCore | null = null;

const escape = (text: string) => text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);

// `code` as markup: each token a span carrying its class, plain text bare, every character escaped.
export function highlight(code: string): string {
  if (!grammar || !table) return escape(code);
  highlighter ??= createHighlighterCoreSync({
    themes: [theme],
    langs: [{ ...grammar, name: "curios" }],
    engine: createJavaScriptRegexEngine(),
  });
  return highlighter
    .codeToTokensBase(code, { lang: "curios", theme: "classes" })
    .map((line) =>
      line
        .map(({ content, color }) => {
          const name = color && classOf.get(color.toLowerCase());
          const painted = name && styles[name];
          return painted ? `<span class="${painted}">${escape(content)}</span>` : escape(content);
        })
        .join(""),
    )
    .join("\n");
}
