module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    "airbnb-base", // Style guide do Airbnb
    "plugin:@typescript-eslint/recommended", // Regras recomendadas para TypeScript
    "plugin:prettier/recommended", // Integra Prettier com ESLint
  ],
  parser: "@typescript-eslint/parser", // Usa o parser do TypeScript
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error", // Ativa o Prettier como uma regra do ESLint
    "import/extensions": [
      "error",
      "ignorePackages",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ], // Configura extensões de arquivo para TypeScript
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: "./tsconfig.json",
      },
      node: {
        extensions: [".js", ".jsx", ".ts", ".tsx"], // Adiciona suporte a TypeScript
      },
    },
  },
};
