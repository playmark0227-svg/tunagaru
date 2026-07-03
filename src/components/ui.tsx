/**
 * 共通UIコンポーネント (サーバーコンポーネント対応・フックなし)
 * 3ロールすべての画面で使う。デザインの一貫性はここで担保する。
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

/* ---------------------------------------------------------------- */
/* カード                                                            */
/* ---------------------------------------------------------------- */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-2xl border border-stone-200/70 bg-white shadow-sm ${className}`}
    >
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
    brand: "bg-brand-soft text-brand",
    blue: "bg-sky-50 text-sky-600",
    green: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
  } as const;
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-medium text-stone-500">{label}</p>
          <p className="mt-1 text-2xl font-bold tracking-tight">{value}</p>
          {sub && <p className="mt-1 text-xs text-stone-400">{sub}</p>}
        </div>
        {icon && (
          <span
            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${tones[tone]}`}
          >
            <Icon name={icon} className="h-5 w-5" />
          </span>
        )}
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* セクション見出し                                                    */
/* ---------------------------------------------------------------- */
export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <h2 className="text-sm font-bold text-stone-700">{title}</h2>
      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-0.5 text-xs font-medium text-brand"
        >
          {action.label}
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/* バッジ                                                             */
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
    gray: "bg-stone-100 text-stone-600",
    green: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    red: "bg-rose-50 text-rose-700",
    blue: "bg-sky-50 text-sky-700",
    violet: "bg-violet-50 text-violet-700",
    brand: "bg-brand-soft text-brand-dark",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* アバター (イニシャル表示)                                            */
/* ---------------------------------------------------------------- */
export function Avatar({
  name,
  color = "bg-stone-400",
  size = "md",
}: {
  name: string;
  color?: string;
  size?: "sm" | "md" | "lg";
}) {
  const sizes = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-14 w-14 text-lg",
  } as const;
  return (
    <span
      className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${color} ${sizes[size]}`}
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
    <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
        {backHref && (
          <Link
            href={backHref}
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
            aria-label="戻る"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </Link>
        )}
        <h1 className="flex-1 truncate text-base font-bold">{title}</h1>
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
      className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-stone-50 active:bg-stone-100 ${className}`}
    >
      {children}
      <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-stone-300" />
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
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-400">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="text-sm font-semibold text-stone-600">{title}</p>
      {description && <p className="text-xs text-stone-400">{description}</p>}
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
                className={`h-0.5 flex-1 ${i === 0 ? "invisible" : done ? "bg-brand" : "bg-stone-200"}`}
              />
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  done ? "bg-brand text-white" : "bg-stone-200 text-stone-400"
                }`}
              >
                {done ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <div
                className={`h-0.5 flex-1 ${i === steps.length - 1 ? "invisible" : i < currentIndex ? "bg-brand" : "bg-stone-200"}`}
              />
            </div>
            <span
              className={`text-center text-[10px] leading-tight ${done ? "font-semibold text-brand-dark" : "text-stone-400"}`}
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
    sm: "h-14 w-14 text-2xl rounded-xl",
    md: "h-20 w-20 text-4xl rounded-2xl",
    lg: "h-40 w-full text-6xl rounded-2xl",
  } as const;
  return (
    <div
      className={`flex shrink-0 items-center justify-center bg-gradient-to-br ${gradient} ${sizes[size]} ${className}`}
    >
      <span>{emoji}</span>
    </div>
  );
}
