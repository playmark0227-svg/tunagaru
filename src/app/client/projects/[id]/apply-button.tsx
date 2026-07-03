"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Badge } from "@/components/ui";
import type { ApplicationStatus } from "@/lib/types";

/**
 * 「この案件に応募する」ボタン (モック)
 * 押すと確認 → 送信中 → 応募完了 をローカルstateで再現する。
 * 本実装では POST /api/applications で Firestore に応募を作成し、
 * 本部へプッシュ通知を送る。
 */
export function ApplyButton({
  isOpen,
  appliedStatus,
}: {
  isOpen: boolean;
  appliedStatus?: ApplicationStatus;
}) {
  const [phase, setPhase] = useState<"idle" | "confirm" | "sending" | "done">(
    "idle",
  );

  function submit() {
    setPhase("sending");
    setTimeout(() => setPhase("done"), 900);
  }

  // すでに採用済み
  if (appliedStatus === "accepted") {
    return (
      <div className="rounded-none border border-emerald-200 bg-emerald-50 p-4 text-center">
        <p className="text-sm font-bold text-emerald-700">
          🎉 この案件に採用されました
        </p>
        <p className="mt-1 text-xs text-emerald-600">
          進捗はタスクページでご確認いただけます。
        </p>
        <Link
          href="/client/tasks"
          className="mt-3 inline-flex items-center gap-1 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white"
        >
          タスクを確認する
          <Icon name="chevron-right" className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  // 応募済み (連絡待ち)
  if (appliedStatus === "applied") {
    return (
      <div className="rounded-none border border-sky-200 bg-sky-50 p-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Badge tone="blue">応募中</Badge>
          <p className="text-sm font-bold text-sky-700">
            この案件は応募済みです
          </p>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-sky-600">
          本部からの連絡をお待ちください。お急ぎの場合はチャットからどうぞ。
        </p>
        <Link
          href="/client/messages/th1"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-sky-300 bg-white px-5 py-2.5 text-sm font-bold text-sky-700"
        >
          <Icon name="chat" className="h-4 w-4" />
          本部チャットを開く
        </Link>
      </div>
    );
  }

  // 募集終了
  if (!isOpen) {
    return (
      <div className="rounded-none border border-stone-200 bg-stone-100 p-4 text-center">
        <p className="text-sm font-bold text-stone-500">
          この案件の募集は終了しました
        </p>
        <p className="mt-1 text-xs text-stone-400">
          新しい案件はプッシュ通知でお知らせします。
        </p>
      </div>
    );
  }

  // 応募完了
  if (phase === "done") {
    return (
      <div className="rounded-none border border-emerald-200 bg-emerald-50 p-5 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Icon name="check" className="h-6 w-6" />
        </span>
        <p className="mt-3 text-sm font-bold text-emerald-700">
          応募が完了しました🎉
        </p>
        <p className="mt-1 text-xs leading-relaxed text-emerald-600">
          本部が内容を確認し、1〜2営業日以内にチャットでご連絡します。
        </p>
        <Link
          href="/client/messages/th1"
          className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-bold text-white"
        >
          <Icon name="chat" className="h-4 w-4" />
          本部チャットを開く
        </Link>
      </div>
    );
  }

  // 確認 / 送信中
  if (phase === "confirm" || phase === "sending") {
    return (
      <div className="rounded-none border border-stone-200 bg-white p-4 text-center shadow-sm">
        <p className="text-sm font-bold">この案件に応募しますか?</p>
        <p className="mt-1 text-xs text-stone-500">
          応募後のキャンセルはチャットからいつでも可能です。
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setPhase("idle")}
            disabled={phase === "sending"}
            className="flex-1 rounded-full border border-stone-300 py-3 text-sm font-bold text-stone-600 disabled:opacity-40"
          >
            やめる
          </button>
          <button
            onClick={submit}
            disabled={phase === "sending"}
            className="flex-1 rounded-full bg-brand py-3 text-sm font-bold text-white active:bg-brand-dark disabled:opacity-60"
          >
            {phase === "sending" ? "送信中…" : "応募する"}
          </button>
        </div>
      </div>
    );
  }

  // 初期状態
  return (
    <button
      onClick={() => setPhase("confirm")}
      className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-colors active:bg-brand-dark"
    >
      <Icon name="sparkles" className="h-4.5 w-4.5" />
      この案件に応募する
    </button>
  );
}
