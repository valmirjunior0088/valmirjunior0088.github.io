export const GITHUB_URL = "https://github.com/valmirjunior0088/curios";
export const ISSUES_URL = `${GITHUB_URL}/issues`;
export const BUILD_URL = `${GITHUB_URL}#build-from-source`;
export const SYNTAX_URL = `${GITHUB_URL}/blob/main/documentation/syntax.md`;

// Both served from this same site by scripts/fetch.sh, so they stay root-relative links rather than absolute ones back to ourselves. The Rust docs are rustdoc's tree, entered at the compiler crate's own page rather than through the root's redirect to it; the /std docs are the pages `curios document` renders, whose landing page is the root module's.
export const RUST_DOCS_URL = "/curios/docs/rust/curios/index.html";
export const STD_DOCS_URL = "/curios/docs/std/index.html";

export const INSTALL_COMMAND =
  "curl -fsSL https://github.com/valmirjunior0088/curios/releases/latest/download/install.sh | sh";

export type PageId = "home" | "playground";

// The header shows one chip and a set of links. The page you are on supplies the chip and drops out of the links, so both pages share a single component and differ by one prop.
export const PAGES: Record<PageId, { chip: string; label: string; href: string }> = {
  home: { chip: "HOME", label: "Home", href: "/curios/" },
  playground: { chip: "PLAYGROUND", label: "Playground", href: "/curios/playground" },
};

// Labels mark inline code with backticks, as every other string in data/ does; see data/markup.ts.
export const EXTERNAL_NAV = [
  { label: "Rust docs", href: RUST_DOCS_URL },
  { label: "`/std` docs", href: STD_DOCS_URL },
  { label: "GitHub", href: GITHUB_URL },
];
