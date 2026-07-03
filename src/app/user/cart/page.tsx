"use client";

/**
 * カート・購入 (エンドユーザー)
 * モックのカート状態 → demoCheckout (Stripe想定) → 注文完了。
 * 本実装では POST /api/checkout → Stripe Checkout へ遷移し、
 * webhook で注文作成 + 本部への自動発注が起きる。
 */
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Card, PageHeader, ProductThumb } from "@/components/ui";
import { demoCheckout } from "@/lib/demo";
import { formatYen } from "@/lib/format";
import { currentClient, products } from "@/lib/mock-data";

interface CartLine {
  productId: string;
  quantity: number;
}

const initialCart: CartLine[] = [
  { productId: "pr1", quantity: 1 },
  { productId: "pr3", quantity: 2 },
];

export default function CartPage() {
  const [cart, setCart] = useState<CartLine[]>(initialCart);
  const [phase, setPhase] = useState<"idle" | "paying" | "done">("idle");
  const [orderId, setOrderId] = useState("");

  const lines = cart
    .map((line) => {
      const product = products.find((p) => p.id === line.productId);
      return product ? { ...line, product } : null;
    })
    .filter((l): l is CartLine & { product: (typeof products)[number] } =>
      Boolean(l),
    );

  const total = lines.reduce(
    (sum, l) => sum + l.product.price * l.quantity,
    0,
  );

  function changeQty(productId: string, delta: number) {
    setCart((prev) =>
      prev
        .map((l) =>
          l.productId === productId
            ? { ...l, quantity: Math.max(0, l.quantity + delta) }
            : l,
        )
        .filter((l) => l.quantity > 0),
    );
  }

  function removeLine(productId: string) {
    setCart((prev) => prev.filter((l) => l.productId !== productId));
  }

  async function checkout() {
    setPhase("paying");
    const res = await demoCheckout(
      lines.map((l) => ({
        productId: l.productId,
        productName: l.product.name,
        quantity: l.quantity,
        unitPrice: l.product.price,
      })),
    );
    setOrderId(res.orderId);
    setPhase("done");
  }

  /* -------------------- 注文完了画面 -------------------- */
  if (phase === "done") {
    return (
      <>
        <PageHeader title="ご注文完了" />
        <main className="space-y-4 px-4 pb-24 pt-10">
          <div className="flex flex-col items-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-sm bg-emerald-50 text-emerald-600">
              <Icon name="check" className="h-8 w-8" />
            </span>
            <h2 className="text-lg font-bold">ご注文ありがとうございます🎉</h2>
            <p className="text-center text-xs leading-relaxed text-ink/55">
              注文番号: {orderId}
              <br />
              {currentClient.ownerName}先生の教室を通じて本部から発送されます。
            </p>
          </div>

          <Card className="p-4">
            <p className="text-xs font-bold text-ink/55">お支払い金額</p>
            <p className="mt-1 text-2xl font-bold text-brand">
              {formatYen(total)}
            </p>
            <p className="mt-1 text-[10px] text-ink/40">
              クレジットカード決済 (Stripe) ※プロトタイプのため実際の請求は発生しません
            </p>
          </Card>

          <div className="space-y-2 pt-2">
            <Link
              href="/user/orders"
              className="block w-full rounded-sm bg-brand py-3.5 text-center text-sm font-bold text-white active:bg-brand-dark"
            >
              注文状況を見る
            </Link>
            <Link
              href="/user/shop"
              className="block w-full rounded-sm border border-ink/20 py-3.5 text-center text-sm font-bold text-ink/70"
            >
              買い物を続ける
            </Link>
          </div>
        </main>
      </>
    );
  }

  /* -------------------- 空カート -------------------- */
  if (lines.length === 0) {
    return (
      <>
        <PageHeader title="カート" backHref="/user/shop" />
        <main className="px-4 pb-24 pt-4">
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-sm bg-ink/5 text-ink/40">
              <Icon name="cart" className="h-7 w-7" />
            </span>
            <p className="text-sm font-semibold text-ink/70">
              カートは空です
            </p>
            <Link
              href="/user/shop"
              className="mt-2 rounded-sm bg-brand px-6 py-2.5 text-sm font-bold text-white"
            >
              商品を探す
            </Link>
          </div>
        </main>
      </>
    );
  }

  /* -------------------- カート画面 -------------------- */
  return (
    <>
      <PageHeader title="カート" backHref="/user/shop" />
      <main className="space-y-3 px-4 pb-40 pt-4">
        {lines.map((l) => (
          <Card key={l.productId} className="flex gap-3 p-3">
            <ProductThumb
              emoji={l.product.emoji}
              gradient={l.product.gradient}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-semibold leading-snug">
                {l.product.name}
              </p>
              <p className="mt-0.5 text-sm font-bold text-brand">
                {formatYen(l.product.price)}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeQty(l.productId, -1)}
                    aria-label="1点減らす"
                    className="flex h-7 w-7 items-center justify-center rounded-sm border border-ink/20 text-sm font-bold text-ink/55 active:bg-ink/5"
                  >
                    −
                  </button>
                  <span className="w-6 text-center text-sm font-bold">
                    {l.quantity}
                  </span>
                  <button
                    onClick={() => changeQty(l.productId, 1)}
                    aria-label="1点増やす"
                    className="flex h-7 w-7 items-center justify-center rounded-sm border border-brand bg-brand-soft text-sm font-bold text-brand active:bg-brand active:text-white"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeLine(l.productId)}
                  className="text-xs text-ink/40 underline"
                >
                  削除
                </button>
              </div>
            </div>
          </Card>
        ))}

        <Card className="flex gap-3 p-4">
          <Icon name="truck" className="h-5 w-5 shrink-0 text-brand" />
          <p className="text-xs leading-relaxed text-ink/55">
            ご注文は{currentClient.ownerName}先生の教室を通じて本部から発送されます。
            送料は税込価格に含まれています。
          </p>
        </Card>
      </main>

      {/* 購入バー */}
      <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/12 bg-white p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
        <div className="mx-auto flex max-w-md items-center gap-3">
          <div className="flex-1">
            <p className="text-[11px] text-ink/55">合計 (税込)</p>
            <p className="text-lg font-bold text-brand">{formatYen(total)}</p>
          </div>
          <button
            onClick={checkout}
            disabled={phase === "paying"}
            className="flex items-center gap-1.5 rounded-sm bg-brand px-7 py-3 text-sm font-bold text-white transition-colors active:bg-brand-dark disabled:opacity-60"
          >
            {phase === "paying" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                決済中…
              </>
            ) : (
              <>
                <Icon name="credit-card" className="h-4 w-4" />
                購入する
              </>
            )}
          </button>
        </div>
      </div>
    </>
  );
}
