"use client";

/**
 * 商品カタログ (エンドユーザー向け)
 * カテゴリタブで絞り込み。カートは /user/cart。
 */
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Badge, ProductThumb } from "@/components/ui";
import { formatYen } from "@/lib/format";
import { products } from "@/lib/mock-data";

const categories = ["すべて", "スキンケア", "コスメ", "クラフト材料"] as const;

export default function UserShopPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("すべて");

  const filtered =
    category === "すべて"
      ? products
      : products.filter((p) => p.category === category);

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-ink/12 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
          <h1 className="flex-1 text-base font-bold">ストア</h1>
          <Link
            href="/user/cart"
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
            aria-label="カートを見る"
          >
            <Icon name="cart" className="h-5 w-5" />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-brand px-1 text-[10px] font-bold text-white">
              3
            </span>
          </Link>
        </div>
        {/* カテゴリタブ */}
        <div className="no-scrollbar mx-auto flex max-w-md gap-2 overflow-x-auto px-4 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-sm px-3.5 py-1.5 text-xs font-bold transition-colors ${
                category === cat
                  ? "border border-ink/12 bg-aqua glow-aqua font-black text-ink"
                  : "border border-ink/15 bg-white text-ink/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="px-4 pb-24 pt-4">
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((p) => (
            <Link key={p.id} href={`/user/shop/${p.id}`} className="group">
              <div className="relative">
                <ProductThumb
                  emoji={p.emoji}
                  gradient={p.gradient}
                  size="lg"
                  className="!h-40"
                />
                {p.isNew && (
                  <span className="absolute left-2 top-2">
                    <Badge tone="brand">NEW</Badge>
                  </span>
                )}
              </div>
              <p className="mt-2 line-clamp-2 text-xs font-semibold leading-snug">
                {p.name}
              </p>
              <p className="mt-0.5 text-sm font-bold text-brand">
                {formatYen(p.price)}
              </p>
            </Link>
          ))}
        </div>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-sm text-stone-400">
            該当する商品がありません
          </p>
        )}
      </main>
    </>
  );
}
