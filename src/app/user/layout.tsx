import type { ReactNode } from "react";
import { BottomNav, type NavItem } from "@/components/nav";

/**
 * エンドユーザー(生徒・一般顧客)画面の共通レイアウト
 * モバイル専用 (max-w-md) + 下部タブナビゲーション
 */

const navItems: NavItem[] = [
  { href: "/user", label: "ホーム", icon: "home" },
  { href: "/user/shop", label: "ストア", icon: "store" },
  { href: "/user/orders", label: "注文", icon: "package" },
  { href: "/user/messages", label: "メッセージ", icon: "chat" },
  { href: "/user/mypage", label: "マイページ", icon: "user" },
];

export default function UserLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh max-w-md">
      {children}
      <BottomNav items={navItems} rootHref="/user" />
    </div>
  );
}
