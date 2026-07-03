"use client";

/**
 * 受注・発注管理: B2B2Cパイプライン
 * 注文受付 → 本部へ自動発注済 → 発送済 → 完了
 * ステータス更新ボタンでローカルstateが進む演出。
 */
import { useState } from "react";
import { orders } from "@/lib/mock-data";
import {
  ORDER_PIPELINE,
  ORDER_STATUS_LABELS,
  type OrderStatus,
} from "@/lib/types";
import { formatYen } from "@/lib/format";
import { Badge, Card, ProgressSteps, type BadgeTone } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";

const statusTone: Record<OrderStatus, BadgeTone> = {
  received: "amber",
  ordered_to_hq: "blue",
  shipped: "violet",
  completed: "green",
};

const nextAction: Record<
  Exclude<OrderStatus, "completed">,
  { label: string; icon: IconName }
> = {
  received: { label: "発注処理を行う", icon: "package" },
  ordered_to_hq: { label: "発送済みにする", icon: "truck" },
  shipped: { label: "完了にする", icon: "check" },
};

/** "2026-07-02" → "7/2" */
function md(date: string): string {
  const [, m, d] = date.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function OrdersBoard() {
  const [statuses, setStatuses] = useState<Record<string, OrderStatus>>(() =>
    Object.fromEntries(orders.map((o) => [o.id, o.status])),
  );
  const [pendingId, setPendingId] = useState<string | null>(null);

  function advance(orderId: string) {
    if (pendingId) return;
    setPendingId(orderId);
    // 擬似的な処理待ち → 次のステータスへ
    setTimeout(() => {
      setStatuses((prev) => {
        const i = ORDER_PIPELINE.indexOf(prev[orderId]);
        const next = ORDER_PIPELINE[Math.min(i + 1, ORDER_PIPELINE.length - 1)];
        return { ...prev, [orderId]: next };
      });
      setPendingId(null);
    }, 700);
  }

  const counts = ORDER_PIPELINE.map((s) => ({
    status: s,
    count: Object.values(statuses).filter((v) => v === s).length,
  }));

  return (
    <div className="space-y-4">
      {/* サマリー */}
      <div className="grid grid-cols-4 gap-2">
        {counts.map(({ status, count }) => (
          <Card key={status} className="px-2 py-2.5 text-center">
            <p className="text-lg font-bold leading-none text-indigo-600">
              {count}
            </p>
            <p className="mt-1 text-[10px] font-medium leading-tight text-stone-500">
              {ORDER_STATUS_LABELS[status]}
            </p>
          </Card>
        ))}
      </div>

      <p className="text-xs leading-relaxed text-stone-400">
        エンドユーザーの注文はクライアント経由で本部へ自動発注されます。
        入金確認後に「発注処理」→ 出荷後に「発送済み」へ更新してください。
      </p>

      {/* 注文カード */}
      <div className="space-y-3">
        {orders.map((o) => {
          const status = statuses[o.id];
          const stepIndex = ORDER_PIPELINE.indexOf(status);
          const isPending = pendingId === o.id;
          return (
            <Card key={o.id} className="p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold">#{o.id}</span>
                <span className="text-xs text-stone-400">
                  {md(o.orderedAt)} 受付
                </span>
                <span className="ml-auto">
                  <Badge tone={statusTone[status]}>
                    {ORDER_STATUS_LABELS[status]}
                  </Badge>
                </span>
              </div>

              <p className="mt-1.5 text-xs text-stone-500">
                {o.endUserName ? (
                  <>
                    <span className="font-semibold text-stone-700">
                      {o.endUserName} 様
                    </span>
                    <span> ({o.clientName} 経由)</span>
                  </>
                ) : (
                  <span className="font-semibold text-stone-700">
                    {o.clientName} — 教室仕入れ (卸)
                  </span>
                )}
              </p>

              {/* 明細 */}
              <div className="mt-3 space-y-1 rounded-xl bg-stone-50 px-3 py-2.5 text-xs">
                {o.items.map((item) => (
                  <div
                    key={item.productId}
                    className="flex items-center justify-between gap-2"
                  >
                    <span className="min-w-0 truncate text-stone-600">
                      {item.productName} × {item.quantity}
                    </span>
                    <span className="shrink-0 text-stone-500">
                      {formatYen(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between border-t border-stone-200/70 pt-1.5">
                  <span className="font-bold text-stone-700">合計</span>
                  <span className="text-sm font-bold text-stone-800">
                    {formatYen(o.total)}
                  </span>
                </div>
              </div>

              {/* パイプライン */}
              <div className="mt-4">
                <ProgressSteps
                  steps={ORDER_PIPELINE.map((s) => ORDER_STATUS_LABELS[s])}
                  currentIndex={stepIndex}
                />
              </div>

              {/* ステータス更新 */}
              {status !== "completed" ? (
                <button
                  onClick={() => advance(o.id)}
                  disabled={isPending}
                  className={`mt-3 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold text-white transition-colors ${
                    isPending
                      ? "cursor-wait bg-indigo-300"
                      : "bg-indigo-500 hover:bg-indigo-600"
                  }`}
                >
                  {isPending ? (
                    <>
                      <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                      更新しています…
                    </>
                  ) : (
                    <>
                      <Icon
                        name={nextAction[status].icon}
                        className="h-4 w-4"
                      />
                      {nextAction[status].label}
                    </>
                  )}
                </button>
              ) : (
                <p className="mt-3 flex items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700">
                  <Icon name="check" className="h-4 w-4" />
                  お取引完了 — お客様に完了通知を送信済みです
                </p>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
