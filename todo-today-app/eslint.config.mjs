import tsEslintPlugin from "@typescript-eslint/eslint-plugin"
import tsParser from "@typescript-eslint/parser"

const tsconfigRootDir = new URL(".", import.meta.url).pathname

export default [
  {
    ignores: ["node_modules/**", ".expo/**", "dist/**", "coverage/**"],
  },
  {
    files: ["src/**/*.{ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
        projectService: true,
        tsconfigRootDir,
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
    },
    rules: {
      "func-style": ["error", "expression", { allowArrowFunctions: true }],
      "no-param-reassign": ["error", { props: true }],
      "no-var": "error",
      "prefer-const": "error",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        {
          prefer: "type-imports",
          fixStyle: "separate-type-imports",
        },
      ],
      "@typescript-eslint/consistent-type-exports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
    },
  },
]
