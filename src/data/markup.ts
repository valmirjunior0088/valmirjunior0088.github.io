// Plain text out of the data files' markup. Nothing here touches the page, so scripts/check.mjs can read it with Node directly; turning backticks into inline code is src/lib/inline.ts's, which brings its own styles.

const ENTITIES: Record<string, string> = {
  "&lt;": "<",
  "&gt;": ">",
  "&amp;": "&",
  "&quot;": '"',
  "&#39;": "'",
};

// Code in the cheatsheet is stored as highlighted markup, which is exactly what you do not want to search: the tags would make every card match "span" or "class", and an escaped `-&gt;` would never match a typed `->`. This recovers the text a reader actually sees.
export function plainText(html: string): string {
  return html.replace(/<[^>]*>/g, "").replace(/&(?:lt|gt|amp|quot|#39);/g, (entity) => ENTITIES[entity] ?? entity);
}
