import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const repository = process.env.GITHUB_REPOSITORY;

const repositoryName = repository?.split("/")[1];
const isUserOrOrgPagesRepo = repositoryName?.endsWith(".github.io");
const githubPagesBase =
  repositoryName && !isUserOrOrgPagesRepo ? `/${repositoryName}/` : "/";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? githubPagesBase : "/",
  server: {
    host: true,
  },
})
