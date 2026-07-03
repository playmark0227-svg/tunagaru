"use client";

/**
 * 仕入れ(卸)カタログ
 * 卸価格・参考小売価格・利益率を表示し、数量を選んで本部へ発注するモック。
 * 本実装では demoCheckout の部分が POST /api/orders (請求書払い) になる。
 */
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Badge, Card, PageHeader, ProductThumb } from "@/components/ui";
import { demoCheckout } from "@/lib/demo";
import { formatYen } from "@/lib/format";
import { products } from "@/lib/mock-data";
import type { OrderItem } from "@/lib/types";

export default function ClientShopPage() {
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [phase, setPhase] = useState<"idle" | "sending" | "done">("idle");
  const [result, setResult] = useState<{
    orderId: string;
    total: number;
    items: OrderItem[];
  } | null>(null);

  const totalQty = products.reduce(
    (sum, p) => sum + (quantities[p.id] ?? 0),
    0,
  );
  const totalPrice = products.reduce(
    (sum, p) => sum + (quantities[p.id] ?? 0) * p.wholesalePrice,
    0,
  );

  function changeQty(id: string, delta: number) {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] ?? 0) + delta),
    }));
  }

  async function submitOrder() {
    const items: OrderItem[] = products
      .filter((p) => (quantities[p.id] ?? 0) > 0)
      .map((p) => ({
        productId: p.id,
        productName: p.name,
        quantity: quantities[p.id],
        unitPrice: p.wholesalePrice,
      }));
    if (items.length === 0) return;
    setPhase("sending");
    const res = await demoCheckout(items);
    setResult({ orderId: res.orderId, total: res.total, items });
    setPhase("done");
  }

  function reset() {
    setQuantities({});
    setResult(null);
    setPhase("idle");
  }

  /* -------------------- 発注完了画面 -------------------- */
  if (phase === "done" && result) {
    return (
      <>
        <PageHeader title="仕入れ(卸)" />
        <main className="space-y-4 px-4 pb-24 pt-8">
          <div className="flex flex-col items-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Icon name="check" className="h-8 w-8" />
            </span>
            <h2 className="text-lg font-bold">本部へ発注しました🎉</h2>
            <p className="text-center text-xs leading-relaxed text-stone-500">
              注文番号: {result.orderId}
              <br />
              在庫確保のうえ、3〜5営業日でお届けします。
            </p>
          </div>

          <Card className="p-4">
            <p className="text-xs font-bold text-stone-500">発注内容</p>
            <ul className="mt-2 space-y-1.5">
              {result.items.map((item) => (
                <li
                  key={item.productId}
                  className="flex items-center justify-between gap-2 text-sm"
                >
                  <span className="min-w-0 truncate">
                    {item.productName}
                    <span className="ml-1 text-xs text-stone-400">
                      ×{item.quantity}
                    </span>
                  </span>
                  <span className="shrink-0 text-stone-600">
                    {formatYen(item.unitPrice * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
              <span className="text-sm font-semibold">合計 (卸価格)</span>
              <span className="text-lg font-bold text-brand">
                {formatYen(result.total)}
              </span>
            </div>
          </Card>

          <Card className="flex gap-3 p-4">
            <Icon name="truck" className="h-5 w-5 shrink-0 text-brand" />
            <p className="text-xs leading-relaxed text-stone-500">
              発送状況はプッシュ通知でお知らせします。お支払いは月末締めの請求書払いです。
            </p>
          </Card>

          <div className="space-y-2 pt-2">
            <button
              onClick={reset}
              className="w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white transition-colors active:bg-brand-dark"
            >
              続けて仕入れる
            </button>
            <Link
              href="/client"
              className="block w-full rounded-full border border-stone-300 py-3.5 text-center text-sm font-bold text-stone-600"
            >
              ホームへ戻る
            </Link>
          </div>
        </main>
      </>
    );
  }

  /* -------------------- カタログ画面 -------------------- */
  return (
    <>
      <PageHeader title="仕入れ(卸)" backHref="/client" />
      <main className="space-y-3 px-4 pb-44 pt-4">
        <Card className="flex gap-3 border-brand/20 bg-brand-soft/60 p-4">
          <span className="text-xl">🏷️</span>
          <p className="text-xs leading-relaxed text-stone-600">
            クライアント様は<span className="font-bold">卸価格 (約30%オフ)</span>
            で仕入れできます。参考小売価格との差額がそのまま教室の利益になります。
          </p>
        </Card>

        {products.map((p) => {
          const qty = quantities[p.id] ?? 0;
          const profit = p.price - p.wholesalePrice;
          const profitRate = Math.round((profit / p.price) * 100);
          return (
            <Card key={p.id} className="p-4">
              <div className="flex gap-3">
                <ProductThumb emoji={p.emoji} gradient={p.gradient} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge>{p.category}</Badge>
                    {p.isNew && <Badge tone="brand">NEW</Badge>}
                  </div>
                  <p className="mt-1 text-sm font-bold leading-snug">
                    {p.name}
                  </p>
                  <p className="mt-0.5 text-[10px] text-stone-400">
                    在庫 {p.stock}点
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-end justify-between gap-2">
                <div>
                  <p className="text-[10px] text-stone-400">
                    卸価格 (税込)
                  </p>
                  <p className="text-lg font-bold text-brand">
                    {formatYen(p.wholesalePrice)}
                  </p>
                  <p className="text-[10px] text-stone-400">
                    参考小売価格 {formatYen(p.price)}
                  </p>
                </div>
                <div className="text-right">
                  <Badge tone="green">利益率 {profitRate}%</Badge>
                  <p className="mt-1 text-[10px] text-stone-400">
                    1点あたり +{formatYen(profit)}
                  </p>
                </div>
              </div>

              {/* 数量ステッパー */}
              <div className="mt-3 flex items-center justify-between border-t border-stone-100 pt-3">
                <span className="text-xs text-stone-500">発注数量</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => changeQty(p.id, -1)}
                    disabled={qty === 0}
                    aria-label={`${p.name}を1点減らす`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-300 text-lg font-bold text-stone-500 transition-colors active:bg-stone-100 disabled:opacity-30"
                  >
                    −
                  </button>
                  <span
                    className={`w-8 text-center text-base font-bold ${
                      qty > 0 ? "text-brand-dark" : "text-stone-300"
                    }`}
                  >
                    {qty}
                  </span>
                  <button
                    onClick={() => changeQty(p.id, 1)}
                    aria-label={`${p.name}を1点増やす`}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-brand bg-brand-soft text-lg font-bold text-brand transition-colors active:bg-brand active:text-white"
                  >
                    +
                  </button>
                </div>
              </div>
            </Card>
          );
        })}
      </main>

      {/* 発注バー (BottomNavの上に固定表示) */}
      {totalQty > 0 && (
        <div className="fixed inset-x-0 bottom-[calc(3.5rem+env(safe-area-inset-bottom))] z-20 px-4 pb-2">
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3 shadow-lg">
            <div className="flex-1">
              <p className="text-[11px] text-stone-500">{totalQty}点の商品</p>
              <p className="text-lg font-bold text-brand">
                {formatYen(totalPrice)}
              </p>
            </div>
            <button
              onClick={submitOrder}
              disabled={phase === "sending"}
              className="flex items-center gap-1.5 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white transition-colors active:bg-brand-dark disabled:opacity-60"
            >
              {phase === "sending" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  発注中…
                </>
              ) : (
                <>
                  <Icon name="package" className="h-4 w-4" />
                  本部へ発注する
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
