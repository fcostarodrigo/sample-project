function makeEslintConfig(tsconfigRootDir) {
  return {
    env: {
      es2020: true,
      node: true,
    },
    extends: [
      "eslint:recommended",
      "plugin:@typescript-eslint/strict-type-checked",
      "plugin:@typescript-eslint/stylistic-type-checked",
      "plugin:unicorn/all",
      "plugin:perfectionist/recommended-natural",
      "prettier",
    ],
    overrides: [
      {
        files: ["*.cjs"],
        rules: {
          "@typescript-eslint/no-unsafe-assignment": "off",
          "@typescript-eslint/no-unsafe-call": "off",
          "@typescript-eslint/no-unsafe-member-access": "off",
          "@typescript-eslint/no-var-requires": "off",
          "unicorn/prefer-module": "off",
        },
      },
      {
        env: { node: true },
        files: ["vite.config.ts", "vitest.config.ts", ".eslintrc.cjs"],
        parserOptions: {
          project: "tsconfig.node.json",
          tsconfigRootDir,
        },
      },
      {
        extends: ["plugin:vitest/all"],
        files: ["*.test.ts"],
        rules: {
          "vitest/prefer-expect-assertions": "off",
        },
      },
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
      project: true,
      tsconfigRootDir,
    },
    root: true,
    rules: {
      "unicorn/filename-case": "off",
      "unicorn/no-keyword-prefix": "off",
      "unicorn/no-null": "off",
      "unicorn/prevent-abbreviations": "off",
      "unicorn/require-post-message-target-origin": "off",
    },
  };
}

module.exports = makeEslintConfig;
