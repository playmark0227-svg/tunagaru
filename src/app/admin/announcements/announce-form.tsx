"use client";

/** 一斉通知: 配信フォーム (demoSendAnnouncement) + 配信履歴 */
import { useState } from "react";
import { announcements as initialAnnouncements } from "@/lib/mock-data";
import { demoSendAnnouncement } from "@/lib/demo";
import type { Announcement } from "@/lib/types";
import { Badge, Card, SectionTitle } from "@/components/ui";
import { Icon } from "@/components/icons";

const targets = [
  "全クライアント",
  "全エンドユーザー",
  "秋キャンペーン参加教室グループ",
] as const;

export function AnnounceForm() {
  const [target, setTarget] = useState<string>(targets[0]);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [sendPush, setSendPush] = useState(true);
  const [sending, setSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [history, setHistory] = useState<Announcement[]>(initialAnnouncements);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  async function send() {
    if (!canSubmit || sending) return;
    setSending(true);
    setSuccessMessage(null);
    const res = await demoSendAnnouncement({ title, body, target });
    setHistory((prev) => [
      {
        id: `local-${prev.length + 1}`,
        title,
        body,
        target,
        sentAt: "たった今",
        pushed: sendPush,
      },
      ...prev,
    ]);
    setSuccessMessage(
      sendPush
        ? `配信しました!${res.queued}件のプッシュ通知を送信済みです 🎉`
        : "配信しました!アプリ内のお知らせに掲載されます",
    );
    setTitle("");
    setBody("");
    setSending(false);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      {/* 配信フォーム */}
      <section>
        <SectionTitle title="新しいお知らせを配信" />
        <Card className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">
              配信先
            </label>
            <div className="flex flex-wrap gap-2">
              {targets.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTarget(t)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                    target === t
                      ? "bg-indigo-500 text-white"
                      : "border border-stone-200 bg-white text-stone-500 hover:bg-stone-50"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">
              タイトル <span className="text-brand">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例: 新商品入荷のお知らせ"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">
              本文 <span className="text-brand">*</span>
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={5}
              placeholder="お知らせの内容を入力してください"
              className="w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm leading-relaxed outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>

          {/* プッシュトグル */}
          <div className="flex items-center gap-3 rounded-xl bg-stone-50 p-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
              <Icon name="bell" className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold">プッシュ通知も送る</p>
              <p className="text-[11px] text-stone-400">
                スマホに直接お知らせが届きます
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={sendPush}
              onClick={() => setSendPush((v) => !v)}
              className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
                sendPush ? "bg-indigo-500" : "bg-stone-300"
              }`}
            >
              <span
                className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                  sendPush ? "left-[22px]" : "left-0.5"
                }`}
              />
            </button>
          </div>

          <button
            onClick={send}
            disabled={!canSubmit || sending}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors ${
              canSubmit && !sending
                ? "bg-indigo-500 hover:bg-indigo-600"
                : "cursor-not-allowed bg-stone-300"
            }`}
          >
            {sending ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                配信しています…
              </>
            ) : (
              <>
                <Icon name="megaphone" className="h-4.5 w-4.5" />
                この内容で配信する
              </>
            )}
          </button>

          {successMessage && (
            <p className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
              <Icon name="check" className="h-4 w-4 shrink-0" />
              {successMessage}
            </p>
          )}
        </Card>
      </section>

      {/* 配信履歴 */}
      <section>
        <SectionTitle title={`配信履歴 (${history.length})`} />
        <div className="space-y-3">
          {history.map((a) => (
            <Card key={a.id} className="p-4">
              <div className="flex items-center gap-1.5">
                <Badge tone="blue">{a.target}</Badge>
                {a.pushed ? (
                  <Badge tone="green">プッシュ送信済</Badge>
                ) : (
                  <Badge tone="gray">アプリ内のみ</Badge>
                )}
                <span className="ml-auto shrink-0 text-[10px] text-stone-400">
                  {a.sentAt}
                </span>
              </div>
              <p className="mt-2 text-sm font-bold leading-snug">{a.title}</p>
              <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">
                {a.body}
              </p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
