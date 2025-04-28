import eslint from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import vitest from "@vitest/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import testingLibrary from "eslint-plugin-testing-library";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default tseslint.config(
  globalIgnores(["dist"]),
  eslint.configs.recommended,
  tseslint.configs.strictTypeChecked,
  tseslint.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  eslintPluginUnicorn.configs.recommended,
  perfectionist.configs["recommended-natural"],
  { files: ["**/*.test.{ts,tsx}"], ...vitest.configs.recommended },
  { files: ["**/*.test.{ts,tsx}"], ...testingLibrary.configs["flat/react"] },
  reactRefresh.configs.vite,
  reactHooks.configs["recommended-latest"],
  pluginQuery.configs["flat/recommended"],
  {
    rules: {
      "unicorn/prevent-abbreviations": ["error", { replacements: { env: false, params: false, props: false } }],
    },
  },
);
