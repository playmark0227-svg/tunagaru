import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav, SidebarNav, type NavItem } from "@/components/nav";
import { Icon } from "@/components/icons";

// 静的エクスポート + サブパス配信のため <img> には basePath を手動付与
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * マスター管理者(本部)画面の共通レイアウト
 * - PC (md以上): 左固定サイドバー
 * - モバイル: 下部タブバー
 */

const sidebarItems: NavItem[] = [
  { href: "/admin", label: "ダッシュボード", icon: "chart" },
  { href: "/admin/clients", label: "顧客一覧", icon: "users" },
  { href: "/admin/projects", label: "案件管理", icon: "briefcase" },
  { href: "/admin/staff", label: "担当一覧", icon: "user" },
  { href: "/admin/messages", label: "チャット", icon: "chat" },
  { href: "/admin/orders", label: "受注・発注", icon: "package" },
  { href: "/admin/payments", label: "報酬・支払", icon: "credit-card" },
  { href: "/admin/announcements", label: "一斉通知", icon: "megaphone" },
  { href: "/admin/settings/visual", label: "ビジュアル管理", icon: "pencil" },
];

const bottomItems: NavItem[] = [
  { href: "/admin", label: "ホーム", icon: "home" },
  { href: "/admin/clients", label: "顧客", icon: "users" },
  { href: "/admin/projects", label: "案件", icon: "briefcase" },
  { href: "/admin/messages", label: "チャット", icon: "chat" },
  { href: "/admin/menu", label: "メニュー", icon: "menu" },
];

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh">
      {/* PC: 左固定サイドバー */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-ink/12 bg-white backdrop-blur md:flex">
        <div className="px-5 pb-3 pt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/logo.png`}
            alt="つながるCraft"
            className="h-8 w-auto"
          />
          <span className="mt-2 inline-block rounded-sm border border-aqua/50 bg-aqua-soft px-2 py-0.5 text-[10px] font-bold tracking-[0.15em] text-aqua">
            本部管理
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarNav items={sidebarItems} rootHref="/admin" />
        </div>

        <div className="border-t border-ink/12 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-bold text-ink/55 transition-colors hover:bg-brand-soft/50 hover:text-brand"
          >
            <Icon name="logout" className="h-5 w-5" />
            エントランスへ戻る
          </Link>
        </div>
      </aside>

      {/* コンテンツ */}
      <div className="md:pl-60">{children}</div>

      {/* モバイル: 下部タブ */}
      <div className="md:hidden">
        <BottomNav items={bottomItems} rootHref="/admin" />
      </div>
    </div>
  );
}
