export const GITHUB_URL = "https://github.com/valmirjunior0088/curios";
export const ISSUES_URL = `${GITHUB_URL}/issues`;
export const BUILD_URL = `${GITHUB_URL}#build-from-source`;
export const LANGUAGE_URL = `${GITHUB_URL}/blob/main/documentation/language.md`;

// Both served from this same site by scripts/fetch.mjs, so they stay root-relative links rather than absolute ones back to ourselves. The Rust docs are rustdoc's tree, a release asset, entered at the compiler crate's own page rather than through the root's redirect to it; the /std docs are no asset at all — the script runs the release's own compiler, and `curios document --std` renders them off the prelude it embeds, with the root module's page as the landing page.
export const RUST_DOCS_URL = "/curios/docs/rust/curios/index.html";
export const STD_DOCS_URL = "/curios/docs/std/index.html";

export const LICENCE = "APACHE-2.0";

export const INSTALL_COMMAND =
  "curl -fsSL https://github.com/valmirjunior0088/curios/releases/latest/download/install.sh | sh";

export type PageId = "home" | "playground";

// Everything the site says about one of its own pages, in one row. The header shows one chip and a set of links: the page you are on supplies the chip and drops out of the links, so every page shares a single header and differs by one prop. The title is the document's. Each href ends in a slash because each page is a directory's index, and a link without one costs a redirect to the address with it.
export const PAGES: Record<PageId, { chip: string; label: string; title: string; href: string }> = {
  home: { chip: "HOME", label: "Home", title: "Curios", href: "/curios/" },
  playground: { chip: "PLAYGROUND", label: "Playground", title: "Playground · Curios", href: "/curios/playground/" },
};

// Labels mark inline code with backticks, as every other string in data/ does; see src/lib/inline.ts.
export const EXTERNAL_NAV = [
  { label: "Rust docs", href: RUST_DOCS_URL },
  { label: "`/std` docs", href: STD_DOCS_URL },
  { label: "GitHub", href: GITHUB_URL },
];
