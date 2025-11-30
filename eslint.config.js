// eslint.config.js — ESLint v9 Flat Config (IMPORT version)

import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import importPlugin from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";

export default [
  js.configs.recommended,

  {
    files: ["**/*.{ts,tsx}"],

    languageOptions: {
      parser: tsParser,
      ecmaVersion: "latest",
      sourceType: "module",
    },

    plugins: {
      "@typescript-eslint": tsPlugin,
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      import: importPlugin,
      prettier,
    },

    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: true,
        node: true,
      },
    },

    rules: {
      // Prettier
      "prettier/prettier": "error",

      // TypeScript
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",

      // React
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/display-name": "off",

      // React Hooks
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",

      // React Fast Refresh
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],

      // IMPORT Rules (same as your old config)
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
            "object",
            "type",
          ],
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
          pathGroups: [
            {
              pattern: "react",
              group: "builtin",
              position: "before",
            },
            {
              pattern: "@/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["react"],
        },
      ],
      "import/no-unresolved": "error",
      "import/no-duplicates": "error",

      // General
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-unused-expressions": "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },
];
