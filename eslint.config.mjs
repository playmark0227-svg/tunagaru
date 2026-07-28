import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({ baseDirectory: import.meta.dirname });

/** Next.js 推奨 + TypeScript ルール (Flat Config) */
const config = [
  {
    // next-env.d.ts は Next.js の自動生成ファイルなので対象外
    ignores: [
      ".next/**",
      "out/**",
      "node_modules/**",
      "public/sw.js",
      "next-env.d.ts",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // 未使用の変数・import を検出 (_ 始まりは意図的な無視として許容)
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
    },
  },
];

export default config;
