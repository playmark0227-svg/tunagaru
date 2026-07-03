"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@/components/icons";

/**
 * 案件への応募ボタン (作業者向け・固定フッター)
 * idle → 確認 → 送信中 → 完了 の4段階をローカルstateで再現。
 * 本実装では projects/{id}/applications への addDoc + 本部へ通知。
 */
export function WorkerApplyButton({ alreadyApplied }: { alreadyApplied: boolean }) {
  const [phase, setPhase] = useState<
    "idle" | "confirm" | "sending" | "done"
  >(alreadyApplied ? "done" : "idle");

  async function submit() {
    setPhase("sending");
    await new Promise((r) => setTimeout(r, 900));
    setPhase("done");
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-ink/12 bg-white p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
      <div className="mx-auto max-w-md">
        {phase === "idle" && (
          <button
            onClick={() => setPhase("confirm")}
            className="w-full rounded-full bg-brand py-3.5 text-sm font-bold text-white transition-colors active:bg-brand-dark"
          >
            この案件に応募する
          </button>
        )}

        {phase === "confirm" && (
          <div className="space-y-2">
            <p className="text-center text-xs text-stone-500">
              応募すると本部に通知が届きます。よろしいですか?
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPhase("idle")}
                className="flex-1 rounded-full border border-stone-300 py-3 text-sm font-bold text-stone-600"
              >
                キャンセル
              </button>
              <button
                onClick={submit}
                className="flex-1 rounded-full bg-brand py-3 text-sm font-bold text-white active:bg-brand-dark"
              >
                応募を確定する
              </button>
            </div>
          </div>
        )}

        {phase === "sending" && (
          <button
            disabled
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-bold text-white opacity-70"
          >
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            送信中…
          </button>
        )}

        {phase === "done" && (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-sm font-bold text-emerald-600">
              <Icon name="check" className="h-4 w-4" />
              {alreadyApplied ? "応募済みの案件です" : "応募が完了しました🎉"}
            </div>
            <p className="text-center text-[11px] text-stone-400">
              採用結果は本部からチャットでご連絡します
            </p>
            <Link
              href="/worker/messages"
              className="block w-full rounded-full border border-brand py-3 text-center text-sm font-bold text-brand"
            >
              チャットを確認する
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
