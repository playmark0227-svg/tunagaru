import type { ReactNode } from "react";
import { BottomNav, type NavItem } from "@/components/nav";

/**
 * 作業者(スタッフ/クリエイター)画面の共通レイアウト
 * モバイル専用 (max-w-md) + 下部タブナビゲーション
 */

const navItems: NavItem[] = [
  { href: "/worker", label: "フィード", icon: "sparkles" },
  { href: "/worker/tasks", label: "タスク", icon: "clipboard" },
  { href: "/worker/messages", label: "チャット", icon: "chat" },
  { href: "/worker/mypage", label: "マイページ", icon: "user" },
];

export default function WorkerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-md">
      {children}
      <BottomNav items={navItems} rootHref="/worker" />
    </div>
  );
}
