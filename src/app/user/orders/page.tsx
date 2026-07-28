import { Card, EmptyState, PageHeader, ProgressSteps } from "@/components/ui";
import { formatYen, formatDate } from "@/lib/format";
import { currentEndUser, orders } from "@/lib/mock-data";
import { ORDER_PIPELINE, ORDER_STATUS_LABELS } from "@/lib/types";

export const metadata = { title: "注文履歴" };

/** パイプラインの短縮ラベル (画面幅に収めるため) */
const SHORT_STEPS = ["注文受付", "発注", "発送", "完了"];

export default function UserOrdersPage() {
  const myOrders = orders.filter((o) => o.endUserId === currentEndUser.id);

  return (
    <>
      <PageHeader title="注文履歴" />
      <main className="space-y-3 px-4 pb-24 pt-4">
        {myOrders.length === 0 ? (
          <EmptyState
            icon="package"
            title="まだ注文がありません"
            description="ストアから商品を購入すると、ここに配送状況が表示されます"
          />
        ) : (
          myOrders.map((order) => {
            const stepIndex = ORDER_PIPELINE.indexOf(order.status);
            return (
              <Card key={order.id} className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-ink/40">
                      注文番号 {order.id}
                    </p>
                    <p className="text-xs text-ink/55">{formatDate(order.orderedAt)}</p>
                  </div>
                  <span className="rounded-sm bg-brand-soft px-2.5 py-1 text-[11px] font-bold text-brand-dark">
                    {ORDER_STATUS_LABELS[order.status]}
                  </span>
                </div>

                {/* 商品 */}
                <ul className="mt-3 space-y-1.5 border-y border-ink/8 py-3">
                  {order.items.map((item) => (
                    <li
                      key={item.productId}
                      className="flex items-center justify-between gap-2 text-sm"
                    >
                      <span className="min-w-0 truncate">
                        {item.productName}
                        <span className="ml-1 text-xs text-ink/40">
                          ×{item.quantity}
                        </span>
                      </span>
                      <span className="shrink-0 text-ink/70">
                        {formatYen(item.unitPrice * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between py-3">
                  <span className="text-xs font-semibold text-ink/55">
                    合計 (税込)
                  </span>
                  <span className="text-base font-bold text-brand">
                    {formatYen(order.total)}
                  </span>
                </div>

                {/* 配送ステータス */}
                <div className="pt-1">
                  <ProgressSteps steps={SHORT_STEPS} currentIndex={stepIndex} />
                </div>
              </Card>
            );
          })
        )}
      </main>
    </>
  );
}
