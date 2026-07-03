/**
 * 共通UIコンポーネント (サーバーコンポーネント対応・フックなし)
 * 3ロールすべての画面で使う。デザインの一貫性はここで担保する。
 *
 * デザイン言語「ブループリント」:
 * - .sticker (パネル): 細いヘアライン枠 + 直角 + 薄影
 * - .comic-circle: 細枠の角丸ごく僅かなアイコンタイル
 * - 水色 (アクア) を線・小面積アクセントに
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

/* ---------------------------------------------------------------- */
/* カード (シャープなパネル)                                           */
/* ---------------------------------------------------------------- */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`sticker overflow-hidden rounded-none ${className}`}>
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 統計カード (ダッシュボードKPI)                                      */
/* ---------------------------------------------------------------- */
export function StatCard({
  label,
  value,
  sub,
  icon,
  tone = "brand",
}: {
  label: string;
  value: string;
  sub?: string;
  icon?: IconName;
  tone?: "brand" | "blue" | "green" | "amber";
}) {
  const tones = {
    brand: "text-aqua",
    blue: "text-sky-600",
    green: "text-emerald-600",
    amber: "text-amber-600",
  } as const;
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] font-medium tracking-wide text-ink/45">
            {label}
          </p>
          <p className="font-display mt-1.5 text-2xl font-bold tracking-tight">
            {value}
          </p>
          {sub && <p className="mt-1 text-[11px] text-ink/40">{sub}</p>}
        </div>
        {icon && (
          <span
            className={`comic-circle flex h-9 w-9 shrink-0 items-center justify-center bg-cream ${tones[tone]}`}
          >
            <Icon name={icon} className="h-4.5 w-4.5" />
          </span>
        )}
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* セクション見出し (水色アンダーバー)                                  */
/* ---------------------------------------------------------------- */
export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-3 flex items-end justify-between">
      <h2 className="zigzag-under text-[13px] font-bold tracking-wide text-ink">
        {title}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-0.5 pb-1 text-[11px] font-medium text-ink/45 hover:text-aqua"
        >
          {action.label}
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* バッジ (角形・細枠)                                                 */
/* ---------------------------------------------------------------- */
export type BadgeTone =
  | "gray"
  | "green"
  | "amber"
  | "red"
  | "blue"
  | "violet"
  | "brand";

export function Badge({
  children,
  tone = "gray",
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  const tones: Record<BadgeTone, string> = {
    gray: "border-ink/15 bg-ink/[0.03] text-ink/70",
    green: "border-emerald-300/60 bg-emerald-50 text-emerald-700",
    amber: "border-amber-300/60 bg-amber-50 text-amber-700",
    red: "border-rose-300/60 bg-rose-50 text-rose-700",
    blue: "border-sky-300/60 bg-sky-50 text-sky-700",
    violet: "border-violet-300/60 bg-violet-50 text-violet-700",
    brand: "border-aqua/50 bg-aqua-soft text-aqua",
  };
  return (
    <span
      className={`inline-flex items-center rounded-sm border px-1.5 py-0.5 text-[10px] font-bold tracking-wide ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* アバター (角形・イニシャル)                                          */
/* ---------------------------------------------------------------- */
export function Avatar({
  name,
  color = "bg-ink/30",
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs rounded-[3px]",
    md: "h-10 w-10 text-sm rounded-[4px]",
    lg: "h-14 w-14 text-lg rounded-[5px]",
  } as const;
  return (
    <span
      className={`flex shrink-0 items-center justify-center font-bold text-white ${color} ${sizes[size]}`}
    >
      {name.charAt(0)}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* ページヘッダー (モバイル画面上部)                                     */
/* ---------------------------------------------------------------- */
export function PageHeader({
  title,
  backHref,
  action,
}: {
  title: string;
  backHref?: string;
  action?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 border-b border-ink/12 bg-cream/90 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
        {backHref && (
          <Link
            href={backHref}
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-sm text-ink/50 hover:bg-ink/5"
            aria-label="戻る"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </Link>
        )}
        <h1 className="flex-1 truncate text-[15px] font-bold tracking-wide text-ink">
          {title}
        </h1>
        {action}
      </div>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/* リスト行 (タップ可能)                                               */
/* ---------------------------------------------------------------- */
export function ListRow({
  href,
  children,
  className = "",
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-aqua-soft/50 active:bg-aqua-soft ${className}`}
    >
      {children}
      <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-ink/25" />
    </Link>
  );
}

/* ---------------------------------------------------------------- */
/* 空状態                                                             */
/* ---------------------------------------------------------------- */
export function EmptyState({
  icon = "sparkles",
  title,
  description,
}: {
  icon?: IconName;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 py-12 text-center">
      <span className="comic-circle flex h-12 w-12 items-center justify-center bg-aqua-soft text-aqua">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="text-sm font-bold text-ink/70">{title}</p>
      {description && <p className="text-xs text-ink/40">{description}</p>}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* 進捗ステップ (注文パイプライン等)                                     */
/* ---------------------------------------------------------------- */
export function ProgressSteps({
  steps,
  currentIndex,
}: {
  steps: string[];
  currentIndex: number;
}) {
  return (
    <ol className="flex items-center">
      {steps.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <li key={step} className="flex flex-1 flex-col items-center gap-1">
            <div className="flex w-full items-center">
              <div
                className={`h-px flex-1 ${
                  i === 0 ? "bg-transparent" : done ? "bg-aqua" : "bg-ink/15"
                }`}
              />
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[3px] border text-[10px] font-bold ${
                  done
                    ? "border-aqua bg-aqua text-white"
                    : "border-ink/20 bg-white text-ink/35"
                }`}
              >
                {done ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <div
                className={`h-px flex-1 ${
                  i === steps.length - 1
                    ? "bg-transparent"
                    : i < currentIndex
                      ? "bg-aqua"
                      : "bg-ink/15"
                }`}
              />
            </div>
            <span
              className={`text-center text-[10px] leading-tight ${
                done ? "font-bold text-ink" : "text-ink/40"
              }`}
            >
              {step}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/* ---------------------------------------------------------------- */
/* 商品サムネイル (絵文字+グラデーションのプレースホルダー)               */
/* ---------------------------------------------------------------- */
export function ProductThumb({
  emoji,
  gradient,
  size = "md",
  className = "",
}: {
  emoji: string;
  gradient: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "h-14 w-14 text-2xl",
    md: "h-20 w-20 text-4xl",
    lg: "h-40 w-full text-6xl",
  } as const;
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-none border border-ink/12 bg-gradient-to-br ${gradient} ${sizes[size]} ${className}`}
    >
      <span>{emoji}</span>
    </div>
  );
}
