import clear from "rollup-plugin-clear";
import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "rollup-plugin-typescript2";
import {terser} from "rollup-plugin-terser";

export default [
  // Node
  {
    input: "src/index.ts",
    output: [
      {
        name: "bitpackr",
        file: "dist/index.js",
        format: "cjs",
      },
    ],
    plugins: [
      clear({
        targets: ["dist"]
      }),
      typescript({
        rollupCommonJSResolveHack: true,
        clean: true,
        tsconfig: "./tsconfig.json",
        module: "esnext"
      }),
      resolve(),
      commonjs({
        sourceMap: false,
        include: "node_modules/**"
      }),
    ]
  },
  // Browser
  {
    input: "src/index.ts",
    output: [
      {
        name: "bitpackr",
        file: "dist/index.iife.min.js",
        format: "iife",
      },
    ],
    plugins: [
      clear({
        targets: ["dist"]
      }),
      typescript({
        rollupCommonJSResolveHack: true,
        clean: true,
        tsconfig: "./tsconfig.json",
        module: "esnext"
      }),
      resolve({
        preferBuiltins: false,
        browser: true,
      }),
      commonjs({
        sourceMap: false,
        include: "node_modules/**"
      }),
      terser(),
    ]
  }
];
