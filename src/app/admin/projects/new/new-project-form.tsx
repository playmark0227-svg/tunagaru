"use client";

/** 案件作成フォーム: 入力 →「発行する」→ 成功画面 (プッシュ通知送信済み表示) */
import Link from "next/link";
import { useState } from "react";
import { demoSendAnnouncement } from "@/lib/demo";
import type { ProjectCategory } from "@/lib/types";
import { Card } from "@/components/ui";
import { Icon } from "@/components/icons";

const categories: ProjectCategory[] = [
  "HP制作",
  "動画制作",
  "キャンペーン",
  "SNS運用",
  "EC構築",
  "デザイン",
];

type Phase = "editing" | "sending" | "done";

export function NewProjectForm() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ProjectCategory>("HP制作");
  const [budget, setBudget] = useState("55000");
  const [deadline, setDeadline] = useState("2026-07-31");
  const [description, setDescription] = useState("");
  const [sendPush, setSendPush] = useState(true);
  const [phase, setPhase] = useState<Phase>("editing");
  const [queued, setQueued] = useState(0);

  const canSubmit = title.trim().length > 0 && description.trim().length > 0;

  async function publish() {
    if (!canSubmit || phase === "sending") return;
    setPhase("sending");
    const res = await demoSendAnnouncement({
      title: `【新着案件】${title}`,
      body: description,
      target: "全クライアント",
    });
    setQueued(res.queued);
    setPhase("done");
  }

  function reset() {
    setTitle("");
    setDescription("");
    setBudget("55000");
    setDeadline("2026-07-31");
    setSendPush(true);
    setPhase("editing");
  }

  /* ---------------- 成功画面 ---------------- */
  if (phase === "done") {
    return (
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <span className="flex h-16 w-16 items-center justify-center rounded-sm bg-emerald-50 text-emerald-500">
          <Icon name="check" className="h-8 w-8" />
        </span>
        <div>
          <p className="text-lg font-bold">案件を発行しました 🎉</p>
          <p className="mt-1 text-sm text-ink/55">
            「{title}」が募集中の案件として公開されました。
          </p>
        </div>
        {sendPush && (
          <div className="flex w-full items-center gap-3 rounded-none bg-aqua-soft p-3 text-left">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-aqua text-white">
              <Icon name="bell" className="h-5 w-5" />
            </span>
            <p className="text-xs leading-relaxed text-indigo-700">
              <span className="font-bold">プッシュ通知を送信済み</span>
              <br />
              全クライアント {queued}件 に新着案件のお知らせを配信しました
            </p>
          </div>
        )}
        <div className="flex w-full flex-col gap-2 pt-2">
          <Link
            href="/admin/projects"
            className="rounded-none bg-aqua px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-indigo-600"
          >
            案件管理へ戻る
          </Link>
          <button
            onClick={reset}
            className="rounded-none border border-ink/12 bg-white px-4 py-3 text-sm font-bold text-ink/70 transition-colors hover:bg-cream"
          >
            続けて作成する
          </button>
        </div>
      </Card>
    );
  }

  /* ---------------- 入力フォーム ---------------- */
  return (
    <div className="space-y-4">
      <Card className="space-y-4 p-5">
        <div>
          <label className="mb-1 block text-xs font-bold text-ink/70">
            案件タイトル <span className="text-brand">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="例: 秋の体験レッスンLPキャンペーン"
            className="w-full rounded-sm border border-ink/12 bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
          />
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-ink/70">
            カテゴリ
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-sm px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                  category === c
                    ? "bg-aqua text-white"
                    : "border border-ink/12 bg-white text-ink/55 hover:bg-cream"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs font-bold text-ink/70">
              報酬・費用 (円)
            </label>
            <input
              type="number"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              min={0}
              step={1000}
              className="w-full rounded-sm border border-ink/12 bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-bold text-ink/70">
              応募締切
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full rounded-sm border border-ink/12 bg-cream px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-bold text-ink/70">
            案件の説明 <span className="text-brand">*</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="対象・内容・納品物・条件などを記入してください"
            className="w-full resize-none rounded-sm border border-ink/12 bg-cream px-3.5 py-2.5 text-sm leading-relaxed outline-none focus:border-indigo-400 focus:bg-white"
          />
        </div>
      </Card>

      {/* プッシュ通知トグル */}
      <Card className="flex items-center gap-3 p-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-aqua-soft text-aqua">
          <Icon name="bell" className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold">公開時にプッシュ通知を送る</p>
          <p className="text-xs text-ink/40">
            全クライアントに新着案件をお知らせします
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={sendPush}
          onClick={() => setSendPush((v) => !v)}
          className={`relative h-7 w-12 shrink-0 rounded-sm transition-colors ${
            sendPush ? "bg-aqua" : "bg-ink/20"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-[2px] bg-white shadow transition-all ${
              sendPush ? "left-[22px]" : "left-0.5"
            }`}
          />
        </button>
      </Card>

      <button
        onClick={publish}
        disabled={!canSubmit || phase === "sending"}
        className={`flex w-full items-center justify-center gap-2 rounded-none px-4 py-3.5 text-sm font-bold text-white shadow-sm transition-colors ${
          canSubmit && phase !== "sending"
            ? "bg-aqua hover:bg-indigo-600"
            : "cursor-not-allowed bg-ink/20"
        }`}
      >
        {phase === "sending" ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            発行しています…
          </>
        ) : (
          <>
            <Icon name="megaphone" className="h-4.5 w-4.5" />
            この内容で発行する
          </>
        )}
      </button>
      <p className="text-center text-[11px] text-ink/40">
        ※ プロトタイプのため実際のデータは保存されません
      </p>
    </div>
  );
}
