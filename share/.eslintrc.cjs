const makeEslintConfig = require("./src/makeEslintConfig.cjs");

const config = makeEslintConfig(__dirname);

module.exports = {
  ...config,
  env: {
    ...config.env,
    node: false,
  },
  overrides: [
    ...config.overrides,
    {
      env: { node: true },
      files: ["vitest.config.ts", ".eslintrc.cjs", "makeEslintConfig.cjs"],
      parserOptions: {
        project: "tsconfig.node.json",
        tsconfigRootDir: __dirname,
      },
    },
  ],
};
