// Prose in the data files marks inline code with backticks, because writing <code> tags by hand inside a sentence makes the sentence unreadable in source and easy to get wrong. This turns them into elements at render time.
export function inlineCode(text: string): string {
  return text.replace(/`([^`]+)`/g, '<code class="kw">$1</code>');
}

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
