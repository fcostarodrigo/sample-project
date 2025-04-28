import eslint from "@eslint/js";
import vitest from "@vitest/eslint-plugin";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import tseslint from "typescript-eslint";

export default tseslint.config(
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
  { files: ["src/**/*.test.ts"], ...vitest.configs.recommended },
  {
    rules: {
      "unicorn/prevent-abbreviations": ["error", { replacements: { params: false } }],
    },
  },
);
