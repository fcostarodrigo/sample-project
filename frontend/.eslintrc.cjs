const makeEslintConfig = require("share/src/makeEslintConfig.cjs");

const config = makeEslintConfig(__dirname);

module.exports = {
  ...config,
  extends: [
    ...config.extends,
    "plugin:react-hooks/recommended",
    "plugin:react/all",
    "plugin:react/jsx-runtime",
    "plugin:testing-library/react",
    "plugin:@tanstack/eslint-plugin-query/recommended",
    "prettier",
  ],
  ignorePatterns: ["dist"],
  overrides: [
    ...config.overrides,
    {
      env: { browser: true },
      files: ["src", "*.test.ts"],
    },
    {
      env: { node: true },
      files: ["pwa-assets.config.ts"],
      parserOptions: {
        project: "tsconfig.node.json",
        tsconfigRootDir: __dirname,
      },
    },
  ],
  plugins: ["react-refresh"],
  rules: {
    ...config.rules,
    "react/destructuring-assignment": ["error", "never"],
    "react/jsx-filename-extension": ["error", { extensions: [".tsx"] }],
    "react/jsx-max-depth": "off",
    "react/no-multi-comp": "off",
    "react/prefer-read-only-props": "off",
    "react/require-default-props": "off",
    "react/sort-comp": "off",
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
