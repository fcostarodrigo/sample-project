import eslint from "@eslint/js";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginUnicorn from "eslint-plugin-unicorn";
import { globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

export default tseslint.config(
  globalIgnores(["cdk.out"]),
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
  {
    rules: {
      "unicorn/prevent-abbreviations": ["error", { replacements: { params: false } }],
    },
  },
);
