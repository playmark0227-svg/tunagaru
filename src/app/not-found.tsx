import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";

/**
 * 404 ページ
 * 静的エクスポート時に 404.html として出力され、GitHub Pages が
 * 存在しないパスへのアクセスで自動的にこのページを返す。
 */

export const metadata: Metadata = { title: "ページが見つかりません" };

const shortcuts: { href: string; label: string; who: string }[] = [
  { href: "/admin", label: "本部管理", who: "マスター管理者" },
  { href: "/member", label: "メンバー", who: "顧客 兼 スタッフ" },
  { href: "/user", label: "ホーム", who: "エンドユーザー" },
];

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-6 py-12">
      <div className="hud-corners border border-ink/12 bg-white/70 px-6 py-10 text-center">
        <p className="font-display text-6xl font-bold tracking-tight text-aqua">
          404
        </p>
        <div className="mx-auto mt-4 h-px w-16 bg-aqua" />
        <h1 className="mt-4 text-base font-bold tracking-wide">
          ページが見つかりません
        </h1>
        <p className="mt-2 text-[13px] leading-relaxed text-ink/55">
          URLが変更されたか、削除された可能性があります。
          <br />
          下のリンクからお戻りください。
        </p>

        <Link
          href="/"
          className="comic-press mt-6 inline-flex items-center justify-center gap-2 rounded-sm border border-aqua bg-aqua px-5 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#12a0bb]"
        >
          <Icon name="arrow-left" className="h-4 w-4" />
          エントランスへ戻る
        </Link>
      </div>

      {/* 各ロールのホームへのショートカット */}
      <div className="mt-8">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-ink/40">
          <span className="h-px w-4 bg-ink/25" />
          SHORTCUTS
        </p>
        <div className="stagger grid grid-cols-2 gap-2.5">
          {shortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className="sticker comic-press rounded-none p-3 transition-colors hover:border-aqua"
            >
              <span className="block text-[10px] font-medium tracking-wide text-ink/40">
                {s.who}
              </span>
              <span className="mt-0.5 flex items-center justify-between gap-1 text-[13px] font-bold">
                {s.label}
                <Icon
                  name="chevron-right"
                  className="h-4 w-4 shrink-0 text-ink/25"
                />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
