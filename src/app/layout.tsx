import type { Metadata, Viewport } from "next";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/register-sw";

// GitHub Pages (サブパス配信) 対応: metadata の URL には basePath が
// 自動付与されないため、明示的に付ける
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const metadata: Metadata = {
  title: {
    default: "つながるCraft",
    template: "%s | つながるCraft",
  },
  description:
    "顧客管理・メッセージ・案件管理・物販をひとつに。繋がるクラフトのデジタル総合相談窓口プラットフォーム",
  manifest: `${basePath}/manifest.json`,
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "つながるCraft",
  },
  icons: {
    icon: `${basePath}/icon.svg`,
    apple: `${basePath}/icon.svg`,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#282f5a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ja">
      <body className="antialiased">
        {/* 手書きマーカー風フォント (コミック調)。React 19 が <head> へ自動ホイストする */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Yusei+Magic&family=Zen+Maru+Gothic:wght@700;900&display=swap"
        />
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
