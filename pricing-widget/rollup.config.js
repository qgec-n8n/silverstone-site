import path from "path";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import babel from "@rollup/plugin-babel";
import replace from "@rollup/plugin-replace";

const projectRoot = path.resolve(process.cwd(), "..");

export default {
  input: path.join(projectRoot, "pricing-widget/src/embed.jsx"),
  output: {
    file: path.join(projectRoot, "assets/js/pricing-widget.js"),
    format: "iife",
    name: "SilverstonePricingWidget",
  },
  plugins: [
    replace({
      preventAssignment: true,
      "process.env.NODE_ENV": JSON.stringify("production"),
    }),
    resolve({ extensions: [".js", ".jsx"] }),
    commonjs(),
    json(),
    babel({
      babelHelpers: "bundled",
      extensions: [".js", ".jsx"],
      presets: [
        ["@babel/preset-env", { targets: ">0.25%, not dead" }],
        ["@babel/preset-react", { runtime: "automatic" }],
      ],
    }),
  ],
};
