"use client";

/**
 * ナビゲーション (クライアントコンポーネント)
 * - BottomNav: モバイル下部タブ — 細枠 + 水色のアクティブ表示 (上部インジケータ)
 * - SidebarNav: 本部管理画面のPCサイドバー — 左に水色のアクティブバー
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Icon, type IconName } from "./icons";

export interface NavItem {
  href: string;
  label: string;
  icon: IconName;
}

function isActive(pathname: string, href: string, rootHref: string): boolean {
  // 末尾スラッシュ (trailingSlash: true) を正規化して比較
  const path = pathname.replace(/\/$/, "") || "/";
  const target = href.replace(/\/$/, "") || "/";
  if (target === rootHref.replace(/\/$/, "")) {
    return path === target;
  }
  return path === target || path.startsWith(`${target}/`);
}

/** モバイル下部タブバー */
export function BottomNav({
  items,
  rootHref,
}: {
  items: NavItem[];
  rootHref: string;
}) {
  const pathname = usePathname();
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/12 bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {items.map((item) => {
          const active = isActive(pathname, item.href, rootHref);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] transition-colors ${
                active
                  ? "font-bold text-aqua"
                  : "font-medium text-ink/40 hover:text-ink/70"
              }`}
            >
              {/* アクティブの上部インジケータ (左から伸びる) */}
              <span
                className={`absolute inset-x-6 top-0 h-0.5 ${
                  active ? "animate-grow-x bg-aqua" : "bg-transparent"
                }`}
              />
              <Icon name={item.icon} className="h-5 w-5" />
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/** 本部管理画面のサイドバー (md以上で表示) */
export function SidebarNav({
  items,
  rootHref,
}: {
  items: NavItem[];
  rootHref: string;
}) {
  const pathname = usePathname();
  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {items.map((item) => {
        const active = isActive(pathname, item.href, rootHref);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-sm border-l-2 px-3 py-2.5 text-[13px] transition-all ${
              active
                ? "border-aqua bg-aqua-soft/60 font-bold text-ink"
                : "border-transparent font-medium text-ink/50 hover:bg-ink/[0.03] hover:text-ink"
            }`}
          >
            <Icon
              name={item.icon}
              className={`h-5 w-5 ${active ? "text-aqua" : ""}`}
            />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
