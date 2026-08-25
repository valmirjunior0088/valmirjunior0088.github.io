export const GITHUB_URL = "https://github.com/valmirjunior0088/curios";
export const ISSUES_URL = `${GITHUB_URL}/issues`;
export const BUILD_URL = `${GITHUB_URL}#build-from-source`;
export const SYNTAX_URL = `${GITHUB_URL}/blob/main/documentation/syntax.md`;

// Served from this same site by scripts/fetch.sh, so it stays a root-relative link rather than an absolute one back to ourselves.
export const DOCS_URL = "/curios/docs/curios/index.html";

export const INSTALL_COMMAND =
  "curl -fsSL https://github.com/valmirjunior0088/curios/releases/latest/download/install.sh | sh";

export type PageId = "home" | "playground";

// The header shows one chip and a set of links. The page you are on supplies the chip and drops out of the links, so both pages share a single component and differ by one prop.
export const PAGES: Record<PageId, { chip: string; label: string; href: string }> = {
  home: { chip: "HOME", label: "Home", href: "/curios/" },
  playground: { chip: "PLAYGROUND", label: "Playground", href: "/curios/playground" },
};

export const EXTERNAL_NAV = [
  { label: "Documentation", href: DOCS_URL },
  { label: "GitHub", href: GITHUB_URL },
];
