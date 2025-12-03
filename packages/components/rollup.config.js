import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
// import dts from "rollup-plugin-dts";

// const packageJson = require("./package.json");
import css from "rollup-plugin-import-css";
import packageJson from "./package.json" with { type: "json" };

export default [
  {
    input: "src/index.ts",
    output: [
      {
        file: packageJson.main,
        format: "cjs",
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: "esm",
        sourcemap: true,
      },
    ],
    plugins: [
      css({
        minify: true,
      }),
      peerDepsExternal(), // Excludes peer dependencies from the bundle
      resolve(), // Resolves node modules
      commonjs(), // Converts CommonJS modules to ES6
      typescript({
        tsconfig: "./tsconfig.json",
        exclude: ["**/__tests__/**", "**/*.test.tsx", "**/*.stories.tsx"], // Exclude test files
      }),
    ],
  },
  // {
  //   input: "dist/esm/types/index.d.ts",
  //   output: [{ file: "dist/index.d.ts", format: "esm" }],
  //   plugins: [dts()],
  // },
];
