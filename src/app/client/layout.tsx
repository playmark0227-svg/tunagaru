import type { ReactNode } from "react";
import { BottomNav, type NavItem } from "@/components/nav";

/**
 * クライアント(インストラクター)画面の共通レイアウト
 * モバイル専用 (max-w-md) + 下部タブナビゲーション
 */

const navItems: NavItem[] = [
  { href: "/client", label: "ホーム", icon: "home" },
  { href: "/client/projects", label: "案件", icon: "briefcase" },
  { href: "/client/tasks", label: "タスク", icon: "clipboard" },
  { href: "/client/messages", label: "チャット", icon: "chat" },
  { href: "/client/menu", label: "メニュー", icon: "menu" },
];

export default function ClientLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-md">
      {children}
      <BottomNav items={navItems} rootHref="/client" />
    </div>
  );
}
