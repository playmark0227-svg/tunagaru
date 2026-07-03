/**
 * GitHub Pages でのプレビュー公開のため、静的エクスポート構成にしている。
 * - basePath はリポジトリ名 (/tunagaru) を CI から環境変数で注入
 * - 本実装 (Firebase Hosting / Vercel) に移行する際は output と basePath を外すだけ
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath,
  trailingSlash: true,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
