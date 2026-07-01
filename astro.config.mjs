import { defineConfig } from "astro/config";

// User site (valmirjunior0088.github.io) — deploys at the domain root, so no
// `base` path is needed. Pages live under /curios/ simply because that's
// where the source files are (src/pages/curios/**).
export default defineConfig({
  site: "https://valmirjunior0088.github.io",
});
