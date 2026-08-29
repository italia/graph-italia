import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { createRequire } from "node:module";

// Resolve the single shared copy of each package through Node resolution
// instead of a hardcoded ../../node_modules path: with Bun's isolated
// installs the root folder may not contain a hoisted copy at all.
const require = createRequire(import.meta.url);
const pkgDir = (name: string) =>
  path.dirname(require.resolve(`${name}/package.json`));

export default defineConfig({
  plugins: [react()],
  resolve: {
    dedupe: ["react", "react-dom", "react-i18next", "i18next"],
    alias: {
      react: pkgDir("react"),
      "react-dom": pkgDir("react-dom"),
      "react-i18next": pkgDir("react-i18next"),
      i18next: pkgDir("i18next"),
    },
  },
  test: {
    environment: "happy-dom",
    globals: true,
    setupFiles: ["./src/tests/setup.ts"],
    include: ["src/tests/**/*.test.{ts,tsx}"],
    css: false,
  },
});
