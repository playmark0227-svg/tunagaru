import type { ReactNode } from "react";
import { BottomNav, type NavItem } from "@/components/nav";
import { currentMember } from "@/lib/mock-data";

/**
 * メンバー(顧客 兼 スタッフ)画面の共通レイアウト
 *
 * ▼ 2026-08 打ち合わせでの方針転換
 * 顧客と作業者は同一人物なので入口を分けない。
 * 「案件」タブはスタッフを兼ねている人にだけ出す。
 * (案件ページは単価が並ぶため、顧客のみの人に見せるとマージンが露見する)
 */

const baseNav: NavItem[] = [
  { href: "/member", label: "ホーム", icon: "home" },
  { href: "/member/messages", label: "チャット", icon: "chat" },
  { href: "/member/tasks", label: "タスク", icon: "clipboard" },
];

const staffNav: NavItem = {
  href: "/member/projects",
  label: "案件",
  icon: "briefcase",
};

const mypageNav: NavItem = {
  href: "/member/mypage",
  label: "マイページ",
  icon: "user",
};

export default function MemberLayout({ children }: { children: ReactNode }) {
  const navItems: NavItem[] = currentMember.isStaff
    ? [...baseNav, staffNav, mypageNav]
    : [...baseNav, mypageNav];

  return (
    <div className="mx-auto min-h-dvh max-w-md">
      {children}
      <BottomNav items={navItems} rootHref="/member" />
    </div>
  );
}
