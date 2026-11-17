// The compiler's terminal colour, as markup. A report is painted in four roles and no more, named as the compiler names them (`Role` in `curios-common/src/style.rs`): bold for what a block is about, dim for what frames it, troubled for what went wrong, aside for what is said aside. Each is a class of terminal.module.css by the same name, so the page paints a report the way a terminal does without knowing any colour the terminal uses — whether the report arrives as what the CLI wrote under `--color always` or as the runs the browser's compiler throws.
import styles from "./terminal.module.css";

export { styles as terminal };

// A run of a report, as the browser's compiler throws a refusal: a text, and the name of the role it is painted in, absent where it is plain.
export type Run = { text: string; role?: string };

// The terminal attribute each role is written as, for reading back what the CLI wrote.
const ROLES: Record<string, string> = { 1: "bold", 2: "dim", 31: "troubled", 33: "aside" };

export const escape = (text: string) => text.replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c] ?? c);

// Runs as markup: each in its role's class, and plain where it has no role or one this page does not paint, rather than guessed at.
export function runsToHtml(runs: Run[]): string {
  return runs
    .map(({ text, role }) => {
      const painted = role && styles[role];
      return painted ? `<span class="${painted}">${escape(text)}</span>` : escape(text);
    })
    .join("");
}

// What the CLI wrote under `--color always`, read back into its runs the way the compiler reads its own (`runs` beside `Role`): each attribute sets the role of the text after it, the reset ends it, and an attribute the compiler never writes leaves that text plain.
export function ansiToRuns(ansi: string): Run[] {
  const runs: Run[] = [];
  let role: string | undefined;
  for (const piece of ansi.split(/\x1b\[([0-9;]*)m/).entries()) {
    const [index, text] = piece;
    if (index % 2) role = ROLES[text];
    else if (text) runs.push(role ? { text, role } : { text });
  }
  return runs;
}

export const ansiToHtml = (ansi: string) => runsToHtml(ansiToRuns(ansi));
