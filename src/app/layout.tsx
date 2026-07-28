import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Zen_Kaku_Gothic_New } from "next/font/google";
import "./globals.css";
import { RegisterServiceWorker } from "@/components/register-sw";

/**
 * フォントは next/font でセルフホストする。
 * ビルド時に取得して自前配信するため、外部への render-blocking な
 * リクエストが無くなり、PWA をオフラインで開いても書体が崩れない。
 */
const zenKaku = Zen_Kaku_Gothic_New({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  display: "swap",
  variable: "--font-zen",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  display: "swap",
  variable: "--font-grotesk",
});

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
    <html
      lang="ja"
      className={`${zenKaku.variable} ${spaceGrotesk.variable}`}
    >
      <body className="antialiased">
        <RegisterServiceWorker />
        {children}
      </body>
    </html>
  );
}
