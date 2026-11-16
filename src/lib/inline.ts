// Prose in the data files marks inline code with backticks, because writing <code> tags by hand inside a sentence makes the sentence unreadable in source and easy to get wrong. This turns them into elements at render time. A browser will break a line after a hyphen, which tears a flag like `--server` in two, so each word inside the span is held together and only the spaces between words are left to break at.
import styles from "./inline.module.css";

export function inlineCode(text: string): string {
  return text.replace(/`([^`]+)`/g, (_, code: string) => `<code class="${styles.code}">${code.replace(/\S+/g, `<span class="${styles.word}">$&</span>`)}</code>`);
}
