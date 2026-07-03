"use client";

/**
 * ナビゲーション (クライアントコンポーネント)
 * - BottomNav: モバイル下部タブ — コミックのコマ風 (インクの太線) + イエローのアクティブ表示
 * - SidebarNav: 本部管理画面のPCサイドバー — コミックパネル風のアクティブ表示
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
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t-[2.5px] border-ink bg-white pb-[env(safe-area-inset-bottom)]">
      <div className="mx-auto flex max-w-md">
        {items.map((item) => {
          const active = isActive(pathname, item.href, rootHref);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
                active
                  ? "font-black text-ink"
                  : "font-bold text-ink/35 hover:text-ink/60"
              }`}
            >
              <span
                className={`flex h-7 w-11 items-center justify-center rounded-full transition-all ${
                  active ? "border-2 border-ink bg-butter" : ""
                }`}
              >
                <Icon name={item.icon} className="h-5 w-5" />
              </span>
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
    <nav className="flex flex-col gap-1.5 p-3">
      {items.map((item) => {
        const active = isActive(pathname, item.href, rootHref);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-all ${
              active
                ? "sticker -rotate-1 !bg-butter font-black text-ink"
                : "font-bold text-ink/50 hover:bg-butter/30 hover:text-ink"
            }`}
          >
            <Icon name={item.icon} className="h-5 w-5" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
