import { babel, getBabelOutputPlugin } from "@rollup/plugin-babel";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import path from "path";
import postcss from "rollup-plugin-postcss";
import { terser } from "rollup-plugin-terser";

import * as meta from "./package.json";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

const globals = {
  react: "React",
  "react-dom": "ReactDOM",
};

const config = {
  input: "src/index.ts",
  external: [/@babel\/runtime/, ...Object.keys(globals)],
  output: [
    {
      file: meta.exports["."],
      format: "es",
      plugins: [
        getBabelOutputPlugin({
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { esmodules: true },
                bugfixes: true,
                loose: true,
                debug: false,
              },
            ],
          ],
        }),
      ],
    },
    {
      file: meta.module,
      format: "es",
      plugins: [
        getBabelOutputPlugin({
          presets: [
            [
              "@babel/preset-env",
              {
                targets: { esmodules: true },
                bugfixes: false,
                loose: true,
                debug: false,
              },
            ],
          ],
        }),
      ],
    },
    {
      file: meta.main,
      format: "cjs",
      globals,
      plugins: [
        getBabelOutputPlugin({
          presets: ["@babel/preset-env"],
        }),
      ],
    },
  ],
  plugins: [
    nodeResolve({ extensions }),
    commonjs(),
    postcss({
      autoModules: true,
      extract: path.resolve("dist/style.css"),
    }),
    babel({
      extensions,
      plugins: ["@babel/plugin-transform-runtime"],
      presets: [
        "@babel/preset-react",
        ["@babel/preset-typescript", { allExtensions: true, isTSX: true }],
      ],
      babelHelpers: "runtime",
    }),
    terser(),
  ],
};

export default config;
