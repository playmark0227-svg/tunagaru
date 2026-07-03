"use client";

/**
 * 外部EC (BASE等) 売上通知パネル
 * BASE の webhook を受信し、在庫管理・発送タスクにつなげる想定 (Phase 3)。
 * プロトタイプでは「発送タスクを作成」をローカルstateで再現する。
 */
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui";
import { formatYen } from "@/lib/format";
import { ecNotifications } from "@/lib/mock-data";

export function EcNotificationsPanel() {
  const [created, setCreated] = useState<Record<string, boolean>>(
    Object.fromEntries(ecNotifications.map((n) => [n.id, n.taskCreated])),
  );

  return (
    <section>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="flex items-center gap-1.5 text-sm font-bold text-ink/80">
          <span>🛍️</span> 外部EC連携 (BASE)
        </h2>
        <span className="rounded-full border border-ink/12 bg-aqua-soft px-2 py-0.5 text-[10px] font-bold text-ink">
          Phase 3 プレビュー
        </span>
      </div>
      <Card className="sticker-glow divide-y divide-ink/8">
        {ecNotifications.map((n) => (
          <div key={n.id} className="flex items-center gap-3 px-4 py-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-emerald-50 text-base font-bold text-emerald-600">
              B
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">
                {n.productName} ×{n.quantity}
              </p>
              <p className="text-[11px] text-ink/40">
                {n.source}で売上 {formatYen(n.amount)}・{n.receivedAt}
              </p>
            </div>
            {created[n.id] ? (
              <span className="flex shrink-0 items-center gap-1 text-[11px] font-bold text-emerald-600">
                <Icon name="check" className="h-3.5 w-3.5" />
                タスク作成済み
              </span>
            ) : (
              <button
                onClick={() =>
                  setCreated((prev) => ({ ...prev, [n.id]: true }))
                }
                className="shrink-0 rounded-sm bg-emerald-600 px-3 py-1.5 text-[11px] font-bold text-white transition-colors active:bg-emerald-700"
              >
                発送タスクを作成
              </button>
            )}
          </div>
        ))}
        <p className="px-4 py-2.5 text-[11px] leading-relaxed text-ink/40">
          外部通販サイトの売上通知をアプリに集約し、在庫管理・発送タスクへ自動連携します (デモ表示)
        </p>
      </Card>
    </section>
  );
}
