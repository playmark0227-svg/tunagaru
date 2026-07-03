import Link from "next/link";
import type { ReactNode } from "react";
import { Icon } from "@/components/icons";

/**
 * 本部画面用ページヘッダー
 * 共通の PageHeader (max-w-md 固定) の本部版。
 * モバイルは max-w-md、PC (md以上) は max-w-4xl に広がる。
 */
export function AdminHeader({
  title,
  backHref,
  action,
}: {
  title: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b-[2.5px] border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4 md:h-14 md:max-w-4xl md:px-8">
        {backHref && (
          <Link
            href={backHref}
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
            aria-label="戻る"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </Link>
        )}
        <h1 className="flex-1 truncate text-base font-black tracking-wide text-brand">
          {title}
        </h1>
        {action}
      </div>
    </header>
  );
}
