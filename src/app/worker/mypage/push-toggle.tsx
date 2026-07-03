"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui";

/** プッシュ通知トグル (デモ) — 新着案件・タスク・チャットの通知 */
export function WorkerPushToggle() {
  const [on, setOn] = useState(true);
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Icon name="bell" className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold">プッシュ通知</p>
          <p className="text-[11px] text-stone-500">
            新着案件・タスク期限・チャットの通知を受け取る
          </p>
        </div>
        <button
          onClick={() => setOn((v) => !v)}
          role="switch"
          aria-checked={on}
          aria-label="プッシュ通知の切り替え"
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            on ? "bg-brand" : "bg-stone-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              on ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </Card>
  );
}
