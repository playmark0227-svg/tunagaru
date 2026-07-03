"use client";

/**
 * ナビゲーション (クライアントコンポーネント)
 * - BottomNav: モバイル下部タブ — 上角が丸い「紙のトレイ」風 + ブロブのアクティブ表示
 * - SidebarNav: 本部管理画面のPCサイドバー — ステッカー風のアクティブ表示
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
    <nav className="fixed inset-x-0 bottom-0 z-30 rounded-t-[1.75rem] border-t-2 border-dashed border-brand/20 bg-white/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(40,47,90,0.06)] backdrop-blur">
      <div className="mx-auto flex max-w-md">
        {items.map((item) => {
          const active = isActive(pathname, item.href, rootHref);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] transition-colors ${
                active
                  ? "font-black text-brand"
                  : "font-bold text-stone-400 hover:text-stone-600"
              }`}
            >
              <span
                className={`flex h-7 w-11 items-center justify-center transition-all ${
                  active ? "blob bg-brand-soft" : ""
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
            className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm transition-all ${
              active
                ? "sticker -rotate-1 font-black text-brand"
                : "font-bold text-stone-500 hover:bg-brand-soft/50 hover:text-brand"
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
