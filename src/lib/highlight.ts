// Curios, highlighted by the compiler's own TextMate grammar — the one its VS Code extension uses — as scripts/fetch.sh downloads it from the pinned release's tag. One module for both places that highlight: the build, which turns the cheatsheet and the home page's code into static markup, and the playground's editor, which highlights as you type.
import { createHighlighterCoreSync, type HighlighterCore, type LanguageRegistration, type ThemeRegistration } from "shiki/core";
import { createJavaScriptRegexEngine } from "shiki/engine/javascript";
import styles from "./highlight.module.css";

// A checkout that never ran the fetch has no grammar, and its code stays plain rather than its build failing.
const found = import.meta.glob<LanguageRegistration>("/.artifacts/curios.tmLanguage.json", { eager: true, import: "default" });
const grammar = Object.values(found)[0];

// What each of the grammar's scopes is drawn as: the scopes are TextMate's, as the grammar names them, and the classes are highlight.module.css's, one per colour of the code palette, so a palette changes in CSS without this table knowing. A scope matches by prefix, and the longest match wins — `keyword.operator.goal` is a keyword even though `keyword.operator` is punctuation, and an escape inside a string is an escape.
const CLASSES: Record<string, string[]> = {
  comment: ["comment"],
  keyword: ["keyword.control", "keyword.other", "storage.modifier", "keyword.operator.goal"],
  sort: ["storage.type.sort", "constant.language"],
  type: ["entity.name.type"],
  function: ["entity.name.function"],
  string: ["string"],
  escape: ["constant.character.escape"],
  number: ["constant.numeric"],
  punct: ["keyword.operator", "punctuation"],
};

// The table, as a theme Shiki can match scopes with: each class is a colour that is really an index, read back off the token. Plain text keeps the theme's own foreground, which indexes nothing.
const names = Object.keys(CLASSES);
const marker = (index: number) => `#0000${(index + 1).toString(16).padStart(2, "0")}`;
const theme: ThemeRegistration = {
  name: "classes",
  type: "dark",
  fg: "#000000",
  bg: "#000000",
  settings: names.map((name, index) => ({ scope: CLASSES[name], settings: { foreground: marker(index) } })),
};
const classOf = new Map(names.map((name, index) => [marker(index), name]));

let highlighter: HighlighterCore | null = null;

const escape = (text: string) => text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);

// `code` as markup: each token a span carrying its class, plain text bare, every character escaped.
export function highlight(code: string): string {
  if (!grammar) return escape(code);
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
          return name ? `<span class="${styles[name]}">${escape(content)}</span>` : escape(content);
        })
        .join(""),
    )
    .join("\n");
}
