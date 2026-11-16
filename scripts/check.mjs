// Holds everything on the site that makes a claim about the compiler to the release package.json pins, using the compiler scripts/fetch.sh downloaded for that release. Run it after `npm run fetch`; the deploy workflow runs it before every build, so a pin that moves past an example breaks the deploy rather than the playground.
//
// What it holds them to:
//   - the fetched compiler is the pinned one — a checkout that moved the pin without fetching again would otherwise check, and serve, the old release;
//   - the examples in src/data/examples are exactly the ones src/data/examples.ts lists, every one is formatted the way `curios format` would write it and lints clean, and each runs or is refused exactly as listed;
//   - the home page's program is formatted as `curios format` would write it;
//   - the terminal on the home page shows what `curios run` prints for the snippet above it, character for character and colour for colour.
import { registerHooks } from "node:module";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// The data files import one another without extensions, which Vite resolves and Node does not. This hands Node the `.ts` it is looking for — for relative paths only, and only in this process.
registerHooks({
  resolve(specifier, context, next) {
    const bare = /^\.\.?\//.test(specifier) && !/\.[cm]?[jt]s$/.test(specifier);
    return next(bare ? `${specifier}.ts` : specifier, context);
  },
});

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const COMPILER = join(ROOT, ".artifacts/curios");
const EXAMPLES_DIR = join(ROOT, "src/data/examples");

const failures = [];
const pass = (line) => console.log(`✓ ${line}`);
const fail = (line, detail = "") => {
  console.log(`✗ ${line}`);
  failures.push(detail ? `${line}\n${detail.replace(/^(?=.)/gm, "    ")}` : line);
};

function curios(args, options = {}) {
  const result = spawnSync(COMPILER, args, { encoding: "utf8", env: { ...process.env, NO_COLOR: "1" }, ...options });
  return { status: result.status, output: `${result.stdout}${result.stderr}`.trimEnd() };
}

// A report closes on a line of its own — `└─ [error] file:line:column`, `└─ [goal] …` — so counting those lines counts the reports.
const reports = (output, kind) => (output.match(new RegExp(`^└─ \\[${kind}\\]`, "gm")) ?? []).length;
const describe = ({ errors, goals }) =>
  [errors && `${errors} error${errors === 1 ? "" : "s"}`, goals && `${goals} goal${goals === 1 ? "" : "s"}`].filter(Boolean).join(" and ") || "nothing";

if (!existsSync(COMPILER)) {
  console.error("No compiler at .artifacts/curios — run `npm run fetch` first.");
  process.exit(1);
}

// Everything below would be checked against the wrong release if this does not hold, so it stops here rather than reporting a page of confusing failures.
const { releaseArtifacts } = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const pinned = releaseArtifacts.tag.replace(/^release\//, "");
const fetched = curios(["--version"]).output.replace(/^curios /, "");
if (fetched !== pinned) {
  console.error(`The fetched compiler is ${fetched}, but package.json pins ${pinned} — run \`npm run fetch\`.`);
  process.exit(1);
}
pass(`the fetched compiler is the pinned ${pinned}`);

const { EXAMPLES } = await import("../src/data/examples.ts");
const listed = EXAMPLES.map((example) => example.name);
const onDisk = readdirSync(EXAMPLES_DIR)
  .filter((file) => file.endsWith(".crs"))
  .map((file) => file.slice(0, -".crs".length));

for (const name of onDisk.filter((name) => !listed.includes(name))) {
  fail(`${name}.crs is in src/data/examples but src/data/examples.ts does not list it`);
}
for (const name of listed.filter((name) => !onDisk.includes(name))) {
  fail(`src/data/examples.ts lists ${name}, but there is no src/data/examples/${name}.crs`);
}

const files = listed.filter((name) => onDisk.includes(name)).map((name) => join(EXAMPLES_DIR, `${name}.crs`));
const format = curios(["format", "--check", ...files]);
if (format.status === 0) pass(`every example is formatted as \`curios format\` would write it`);
else fail("an example is not formatted as `curios format` would write it — run it on src/data/examples", format.output);

for (const example of EXAMPLES.filter((example) => onDisk.includes(example.name))) {
  const file = `${example.name}.crs`;
  const path = join(EXAMPLES_DIR, file);

  const lint = curios(["lint", path]);
  const lints = Number(/^(\d+) lints?\b/m.exec(lint.output)?.[1] ?? NaN);
  if (lints !== 0) fail(`${file} does not lint clean`, lint.output);

  const want = { errors: example.errors ?? 0, goals: example.goals ?? 0 };
  const run = curios(["run", path]);
  const got = { errors: reports(run.output, "error"), goals: reports(run.output, "goal") };
  const refused = want.errors + want.goals > 0;

  if (!refused && run.status === 0) pass(`${file} runs`);
  else if (!refused) fail(`${file} should run, but it exited ${run.status}`, run.output);
  else if (run.status === 0) fail(`${file} should be refused with ${describe(want)}, but it ran`, run.output);
  else if (got.errors !== want.errors || got.goals !== want.goals)
    fail(`${file} should report ${describe(want)}, but it reports ${describe(got)}`, run.output);
  else pass(`${file} reports ${describe(want)}`);
}

// The home page's terminal shows what `curios run --color always` printed for the snippet above it, captured whole, colours included — src/data/hero-diagnostic.ansi. The file it ran is named on the capture's first line, which is part of what the page quotes, so the snippet is run under that name. Step times are the one thing a second run need not repeat, so a time compares equal to any other. `--update` captures it again, which is what a pin bump that changes a report asks for.
const HERO_CAPTURE = join(ROOT, "src/data/hero-diagnostic.ansi");
const { HERO } = await import("../src/data/home.ts");
const captured = readFileSync(HERO_CAPTURE, "utf8");

// The program on the home page is written as the formatter writes it, like every example.
const snippets = mkdtempSync(join(tmpdir(), "curios-check-"));
try {
  const file = join(snippets, "program.crs");
  writeFileSync(file, `${HERO.program.join("\n")}\n`);
  const formatted = curios(["format", "--check", file]);
  if (formatted.status === 0) pass("the home page's code is formatted as `curios format` would write it");
  else fail("the home page's code is not formatted as `curios format` would write it", formatted.output);
} finally {
  rmSync(snippets, { recursive: true, force: true });
}

const name = captured.replace(/\x1b\[[0-9;]*m/g, "").split("\n")[0].trim();
const dir = mkdtempSync(join(tmpdir(), "curios-check-"));
try {
  writeFileSync(join(dir, name), `${HERO.program.join("\n")}\n`);
  const run = curios(["run", "--color", "always", name], { cwd: dir });
  const steady = (text) => text.replace(/\d+\.\d+s\b/g, "0.0s");
  if (process.argv.includes("--update")) {
    writeFileSync(HERO_CAPTURE, run.output);
    pass("captured the home page's terminal again");
  } else if (steady(run.output) === steady(captured.trimEnd())) {
    pass("the home page's terminal is what the compiler prints");
  } else {
    fail("the home page's terminal is not what the compiler prints for the snippet above it — `node scripts/check.mjs --update` captures it again", run.output);
  }
} finally {
  rmSync(dir, { recursive: true, force: true });
}

if (failures.length) {
  console.error(`\n${failures.length} check${failures.length === 1 ? "" : "s"} failed:\n\n${failures.join("\n\n")}`);
  process.exit(1);
}
