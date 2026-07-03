import Link from "next/link";
import type { ReactNode } from "react";
import { BottomNav, SidebarNav, type NavItem } from "@/components/nav";
import { Icon } from "@/components/icons";

/**
 * マスター管理者(本部)画面の共通レイアウト
 * - PC (md以上): 左固定サイドバー
 * - モバイル: 下部タブバー
 */

const sidebarItems: NavItem[] = [
  { href: "/admin", label: "ダッシュボード", icon: "chart" },
  { href: "/admin/clients", label: "顧客一覧", icon: "users" },
  { href: "/admin/projects", label: "案件管理", icon: "briefcase" },
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
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-60 flex-col border-r border-stone-200/70 bg-white md:flex">
        <div className="flex items-center gap-2.5 px-5 pb-4 pt-6">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-500 shadow-sm">
            <svg viewBox="0 0 512 512" className="h-5 w-5" aria-hidden="true">
              <g
                fill="none"
                stroke="#ffffff"
                strokeWidth="40"
                strokeLinecap="round"
              >
                <circle cx="196" cy="256" r="110" />
                <circle cx="316" cy="256" r="110" />
              </g>
            </svg>
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold leading-tight">
              つながるクラフト
            </span>
            <span className="block text-[11px] font-semibold text-indigo-500">
              本部管理
            </span>
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <SidebarNav items={sidebarItems} rootHref="/admin" />
        </div>

        <div className="border-t border-stone-200/70 p-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-700"
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
