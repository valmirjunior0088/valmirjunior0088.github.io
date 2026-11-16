// Holds everything on the site that makes a claim about the compiler to the release package.json pins, using the compiler scripts/fetch.sh downloaded for that release. Run it after `npm run fetch`; the deploy workflow runs it before every build, so a pin that moves past an example breaks the deploy rather than the playground.
//
// What it holds them to:
//   - the fetched compiler is the pinned one — a checkout that moved the pin without fetching again would otherwise check, and serve, the old release;
//   - the examples in src/data/examples are exactly the ones src/data/examples.ts lists, every one is formatted the way `curios format` would write it and lints clean, and each runs or is refused exactly as listed;
//   - the diagnostic on the home page is what the compiler reports for the snippet printed above it, character for character.
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

// The snippet is written to a file under the name its closing line gives, because that name is part of what the page quotes.
const { HERO } = await import("../src/data/home.ts");
const { plainText } = await import("../src/data/markup.ts");
const quoted = plainText(HERO.diagnostic.join("\n"));
const name = /\[error\] ([^\s:]+):/.exec(quoted)?.[1];
if (!name) {
  fail("the home page's diagnostic names no file on its closing line");
} else {
  const dir = mkdtempSync(join(tmpdir(), "curios-check-"));
  try {
    writeFileSync(join(dir, name), `${plainText(HERO.usage.join("\n"))}\n`);
    const lint = curios(["lint", name], { cwd: dir });
    if (lint.output.includes(quoted)) pass("the home page's diagnostic is what the compiler reports");
    else fail("the home page's diagnostic is not what the compiler reports for the snippet above it", lint.output);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}

if (failures.length) {
  console.error(`\n${failures.length} check${failures.length === 1 ? "" : "s"} failed:\n\n${failures.join("\n\n")}`);
  process.exit(1);
}
