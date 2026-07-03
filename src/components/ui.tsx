/**
 * 共通UIコンポーネント (サーバーコンポーネント対応・フックなし)
 * 3ロールすべての画面で使う。デザインの一貫性はここで担保する。
 *
 * デザイン言語「コミックストリップ」(スヌーピー風):
 * - .sticker: 太いインク縁取り + ベタ落ち影のコミックのコマ
 * - .comic-circle: インク縁取りの円 (アイコン・アバター)
 * - .zigzag-under: ジグザグ下線 (コミックの定番柄)
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { Icon, type IconName } from "./icons";

/* ---------------------------------------------------------------- */
/* カード (コミックのコマ)                                             */
/* ---------------------------------------------------------------- */
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`sticker overflow-hidden rounded-2xl ${className}`}>
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
    brand: "bg-lilac",
    blue: "bg-skypale",
    green: "bg-mint",
    amber: "bg-butter",
  } as const;
  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-xs font-bold text-stone-500">{label}</p>
          <p className="mt-1 text-2xl font-black tracking-tight">{value}</p>
          {sub && <p className="mt-1 text-xs text-stone-400">{sub}</p>}
        </div>
        {icon && (
          <span
            className={`comic-circle flex h-10 w-10 shrink-0 rotate-3 items-center justify-center text-ink ${tones[tone]}`}
          >
            <Icon name={icon} className="h-5 w-5" />
          </span>
        )}
      </div>
    </Card>
  );
}

/* ---------------------------------------------------------------- */
/* セクション見出し (ジグザグ下線)                                     */
/* ---------------------------------------------------------------- */
export function SectionTitle({
  title,
  action,
}: {
  title: string;
  action?: { href: string; label: string };
}) {
  return (
    <div className="mb-2.5 flex items-end justify-between">
      <h2 className="zigzag-under text-sm font-black tracking-wide text-ink">
        {title}
      </h2>
      {action && (
        <Link
          href={action.href}
          className="flex items-center gap-0.5 pb-1 text-xs font-bold text-ink/60 hover:text-ink"
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
    gray: "bg-white",
    green: "bg-mint",
    amber: "bg-butter",
    red: "bg-peach",
    blue: "bg-skypale",
    violet: "bg-lilac",
    brand: "bg-brand-soft",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border-2 border-ink px-2 py-0.5 text-[11px] font-bold text-ink ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

/* ---------------------------------------------------------------- */
/* アバター (イニシャル表示・コミック円)                                */
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
      className={`comic-circle flex shrink-0 items-center justify-center font-black text-white ${color} ${sizes[size]}`}
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
    <header className="sticky top-0 z-20 border-b-[2.5px] border-ink bg-cream/95 backdrop-blur">
      <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
        {backHref && (
          <Link
            href={backHref}
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-ink/60 hover:bg-brand-soft"
            aria-label="戻る"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </Link>
        )}
        <h1 className="flex-1 truncate text-base font-black tracking-wide text-ink">
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
      className={`flex items-center gap-3 px-4 py-3 transition-colors hover:bg-butter/30 active:bg-butter/50 ${className}`}
    >
      {children}
      <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-ink/30" />
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
      <span className="comic-circle flex h-14 w-14 -rotate-3 items-center justify-center bg-butter text-ink">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="text-sm font-bold text-stone-600">{title}</p>
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
                className={`flex-1 border-t-2 border-dashed ${
                  i === 0
                    ? "border-transparent"
                    : done
                      ? "border-ink"
                      : "border-ink/25"
                }`}
              />
              <span
                className={`comic-circle flex h-7 w-7 shrink-0 items-center justify-center text-[10px] font-black ${
                  done ? "bg-butter text-ink" : "bg-white text-ink/40"
                }`}
              >
                {done ? <Icon name="check" className="h-3.5 w-3.5" /> : i + 1}
              </span>
              <div
                className={`flex-1 border-t-2 border-dashed ${
                  i === steps.length - 1
                    ? "border-transparent"
                    : i < currentIndex
                      ? "border-ink"
                      : "border-ink/25"
                }`}
              />
            </div>
            <span
              className={`text-center text-[10px] leading-tight ${
                done ? "font-black text-ink" : "font-bold text-ink/40"
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
    sm: "h-14 w-14 text-2xl rounded-xl",
    md: "h-20 w-20 text-4xl rounded-2xl",
    lg: "h-40 w-full text-6xl rounded-2xl",
  } as const;
  return (
    <div
      className={`flex shrink-0 items-center justify-center border-[2.5px] border-ink bg-gradient-to-br shadow-[3px_3px_0_#262b47] ${gradient} ${sizes[size]} ${className}`}
    >
      <span className="drop-shadow-sm">{emoji}</span>
    </div>
  );
}
