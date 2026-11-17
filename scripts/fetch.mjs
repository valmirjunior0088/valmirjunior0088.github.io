// Fetches the pinned curios release's wasm playground bundle and its rustdoc API docs into public/curios/js and public/curios/docs/rust, its TextMate grammars and the table of classes they are coloured by into .artifacts/grammars, and renders the standard library's pages into public/curios/docs/std — exactly what the deploy workflow does before `astro build`. Run it once (`npm run fetch`) to get a working playground, highlighting and docs links locally; without it the "Run" button and both docs links fail and code is drawn plain (the site handles all of that gracefully, but the playground won't work).
//
// The /std pages are not a release asset: the compiler renders them itself, `curios document --std <DIR>`, off the prelude it embeds. So the release's compiler for this machine is downloaded into .artifacts/, checked against the release's checksums.txt before anything runs it, and asked for them. A machine the release builds no compiler for gets everything but those pages, and is told so.
//
// package.json's "releaseArtifacts" field is the single source of truth for the pinned release — the deploy workflow (.github/workflows/deploy.yml) runs this same script, so bumping the tag in package.json is the only edit a release needs.
import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { chmodSync, copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const { repo, tag } = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")).releaseArtifacts;
const DEST = join(ROOT, "public/curios");
const ARTIFACTS = join(ROOT, ".artifacts");

// The three platforms a release builds a compiler for, under the names its own install.sh gives them. Anywhere else there is none.
const COMPILERS = {
  "linux x64": "curios-linux-x86_64",
  "linux arm64": "curios-linux-aarch64",
  "darwin arm64": "curios-macos-aarch64",
};
const compiler = COMPILERS[`${process.platform} ${process.arch}`];

const ASSETS = ["curios-js.tar.gz", "curios-docs.tar.gz", "curios-grammars.tar.gz", ...(compiler ? [compiler, "checksums.txt"] : [])];

// An asset by its public download link, which needs no token: a release's assets are as public as its page.
async function download(asset, into) {
  const url = `https://github.com/${repo}/releases/download/${tag}/${asset}`;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`couldn't download ${asset}: ${response.status} ${response.statusText} from ${url}`);
  const path = join(into, asset);
  writeFileSync(path, Buffer.from(await response.arrayBuffer()));
  return path;
}

// Unpacked by the system's tar, which every machine that builds the site has, rather than by a dependency that reimplements it.
function untar(archive, into) {
  mkdirSync(into, { recursive: true });
  const result = spawnSync("tar", ["-xzf", archive, "-C", into], { stdio: "inherit" });
  if (result.status !== 0) throw new Error(`couldn't unpack ${archive} into ${into}`);
}

const digestOf = (path) => createHash("sha256").update(readFileSync(path)).digest("hex");

const temporary = mkdtempSync(join(tmpdir(), "curios-fetch-"));
try {
  console.log(`Fetching curios ${tag} from ${repo}...`);
  const paths = Object.fromEntries(await Promise.all(ASSETS.map(async (asset) => [asset, await download(asset, temporary)])));

  untar(paths["curios-js.tar.gz"], join(DEST, "js"));
  untar(paths["curios-docs.tar.gz"], join(DEST, "docs/rust"));

  // The TextMate grammars the compiler's editors highlight with, and classes.json, the table that gives each of the compiler's classes the scopes the grammars write for it — the release's own, so the site colours Curios with what the release it pins ships (src/lib/highlight.ts). Unpacked fresh, so nothing a release dropped lingers from the last one.
  rmSync(join(ARTIFACTS, "grammars"), { recursive: true, force: true });
  untar(paths["curios-grammars.tar.gz"], join(ARTIFACTS, "grammars"));

  if (!compiler) {
    console.error(`curios ${tag} ships no compiler for ${process.platform} ${process.arch}, so the /std docs were not rendered`);
    console.log(`Done — public/curios now has the wasm playground bundle and the Rust docs, and .artifacts the grammars, for ${tag}.`);
  } else {
    // The digest travels with the binary, so this catches a truncated download or a swapped asset rather than a compromised release — which is what there is to catch before running something just downloaded. A line of checksums.txt is a digest and a name, the name starred where it was read in binary mode.
    const expected = readFileSync(paths["checksums.txt"], "utf8")
      .split("\n")
      .map((line) => line.trim().split(/\s+/))
      .find(([, name]) => name?.replace(/^\*/, "") === compiler)?.[0];
    const actual = digestOf(paths[compiler]);
    if (expected !== actual) throw new Error(`checksum mismatch for ${compiler}: expected ${expected ?? "an entry in checksums.txt"}, got ${actual}`);

    // Copied rather than moved: the temporary directory is usually another filesystem, which a rename cannot cross.
    const binary = join(ARTIFACTS, "curios");
    mkdirSync(ARTIFACTS, { recursive: true });
    copyFileSync(paths[compiler], binary);
    chmodSync(binary, 0o755);

    mkdirSync(join(DEST, "docs/std"), { recursive: true });
    const documented = spawnSync(binary, ["document", "--std", join(DEST, "docs/std")], { stdio: "inherit" });
    if (documented.status !== 0) throw new Error(`curios document --std exited ${documented.status}`);

    console.log(`Done — public/curios now has the wasm playground bundle, the Rust docs and the /std docs, and .artifacts the grammars and the compiler, for ${tag}.`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  rmSync(temporary, { recursive: true, force: true });
}
