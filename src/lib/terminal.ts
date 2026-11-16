// The compiler's terminal colour, as markup. A report is painted in four roles and no more (`curios-common/src/style.rs` in the compiler): bold for what a block is about, dim for what frames it, red for what went wrong, yellow for what is said aside. Each becomes a class of terminal.module.css, so the page paints a report the way a terminal does without knowing any colour the terminal uses.
import styles from "./terminal.module.css";

export { styles as terminal };

const ROLES: Record<number, string> = { 1: styles.bold, 2: styles.dim, 31: styles.red, 33: styles.yellow };

export const escape = (text: string) => text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);

const span = (role: string, text: string) => `<span class="${role}">${escape(text)}</span>`;

// What the CLI wrote under `--color always`, as markup: each run of text in the roles its codes set, and every code the compiler never writes ignored rather than guessed at.
export function ansiToHtml(ansi: string): string {
  let roles: string[] = [];
  return ansi
    .split(/(\x1b\[[0-9;]*m)/)
    .map((piece) => {
      const codes = /^\x1b\[([0-9;]*)m$/.exec(piece);
      if (!codes) return roles.length ? span(roles.join(" "), piece) : escape(piece);
      for (const code of codes[1].split(";").map(Number)) {
        if (code === 0) roles = [];
        else if (ROLES[code] && !roles.includes(ROLES[code])) roles.push(ROLES[code]);
      }
      return "";
    })
    .join("");
}
