"use client";

/**
 * Zoom予約 (Google Calendar 連携のモック)
 * fetchAvailability で本部カレンダーの空き枠を取得し、
 * 枠を選択 → 目的入力 → demoBookSlot で予約完了を再現する。
 */
import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/icons";
import { Card, PageHeader } from "@/components/ui";
import { demoBookSlot, fetchAvailability } from "@/lib/demo";
import type { BookingSlot } from "@/lib/types";

export default function ClientBookingPage() {
  const [slots, setSlots] = useState<BookingSlot[] | null>(null);
  const [selected, setSelected] = useState<BookingSlot | null>(null);
  const [purpose, setPurpose] = useState("");
  const [phase, setPhase] = useState<"select" | "sending" | "done">("select");
  const [zoomUrl, setZoomUrl] = useState("");

  useEffect(() => {
    let mounted = true;
    fetchAvailability().then((data) => {
      if (mounted) setSlots(data);
    });
    return () => {
      mounted = false;
    };
  }, []);

  async function book() {
    if (!selected || !purpose.trim()) return;
    setPhase("sending");
    const res = await demoBookSlot(selected, purpose.trim());
    setZoomUrl(res.zoomUrl);
    setPhase("done");
  }

  function reset() {
    setSelected(null);
    setPurpose("");
    setZoomUrl("");
    setPhase("select");
  }

  /* -------------------- 予約完了画面 -------------------- */
  if (phase === "done" && selected) {
    return (
      <>
        <PageHeader title="Zoom予約" />
        <main className="space-y-4 px-4 pb-24 pt-8">
          <div className="flex flex-col items-center gap-3">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <Icon name="check" className="h-8 w-8" />
            </span>
            <h2 className="text-lg font-bold">予約が完了しました🎉</h2>
            <p className="text-center text-xs leading-relaxed text-stone-500">
              本部の担当者にも同じ予定が共有されました。
            </p>
          </div>

          <Card className="divide-y divide-stone-100">
            <div className="flex items-center justify-between px-4 py-3">
              <span className="text-xs text-stone-500">日時</span>
              <span className="text-sm font-bold">
                {selected.dayLabel} {selected.time}〜 (60分)
              </span>
            </div>
            <div className="flex items-start justify-between gap-3 px-4 py-3">
              <span className="shrink-0 text-xs text-stone-500">ご相談内容</span>
              <span className="text-right text-sm">{purpose}</span>
            </div>
            <div className="px-4 py-3">
              <p className="text-xs text-stone-500">Zoomリンク</p>
              <p className="mt-1 break-all rounded-xl bg-stone-50 px-3 py-2 font-mono text-xs text-brand-dark">
                {zoomUrl}
              </p>
            </div>
          </Card>

          <Card className="flex gap-3 p-4">
            <Icon name="calendar" className="h-5 w-5 shrink-0 text-brand" />
            <p className="text-xs leading-relaxed text-stone-500">
              Googleカレンダーに予定を登録し、Zoomリンクを自動発行しました。
              開始5分前にプッシュ通知でお知らせします。変更・キャンセルは本部チャットからご連絡ください。
            </p>
          </Card>

          <div className="space-y-2 pt-2">
            <Link
              href="/client"
              className="block w-full rounded-full bg-brand py-3.5 text-center text-sm font-bold text-white transition-colors active:bg-brand-dark"
            >
              ホームへ戻る
            </Link>
            <button
              onClick={reset}
              className="w-full rounded-full border border-stone-300 py-3.5 text-sm font-bold text-stone-600"
            >
              別の枠を予約する
            </button>
          </div>
        </main>
      </>
    );
  }

  /* -------------------- 枠選択画面 -------------------- */
  const dayLabels = slots
    ? Array.from(new Set(slots.map((s) => s.dayLabel)))
    : [];

  return (
    <>
      <PageHeader title="Zoom予約" backHref="/client" />
      <main className="space-y-4 px-4 pb-24 pt-4">
        <Card className="flex gap-3 border-brand/20 bg-brand-soft/60 p-4">
          <Icon name="video" className="h-5 w-5 shrink-0 text-brand" />
          <p className="text-xs leading-relaxed text-stone-600">
            本部とのオンライン打ち合わせを予約できます。Googleカレンダーと連携した
            <span className="font-bold">最新の空き枠</span>
            を表示しています (1枠60分)。
          </p>
        </Card>

        {/* ロード中 */}
        {slots === null ? (
          <div className="flex flex-col items-center gap-3 py-16">
            <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-200 border-t-brand" />
            <p className="text-xs text-stone-400">
              Googleカレンダーの空き枠を確認しています…
            </p>
          </div>
        ) : (
          <>
            {/* 日付ごとの空き枠チップ */}
            <section className="space-y-3">
              {dayLabels.map((day) => (
                <Card key={day} className="p-4">
                  <p className="text-xs font-bold text-stone-500">{day}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {slots
                      .filter((s) => s.dayLabel === day)
                      .map((s) => {
                        const isSelected = selected?.id === s.id;
                        return (
                          <button
                            key={s.id}
                            onClick={() => setSelected(s)}
                            disabled={!s.available}
                            className={`min-h-11 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                              !s.available
                                ? "border-stone-200 bg-stone-100 text-stone-300 line-through"
                                : isSelected
                                  ? "border-brand bg-brand text-white shadow-md shadow-brand/30"
                                  : "border-stone-300 bg-white text-stone-700 active:bg-brand-soft"
                            }`}
                          >
                            {s.time}
                          </button>
                        );
                      })}
                  </div>
                </Card>
              ))}
            </section>

            {/* 目的入力 */}
            <Card className="p-4">
              <label
                htmlFor="booking-purpose"
                className="text-xs font-bold text-stone-500"
              >
                ご相談内容 (目的)
              </label>
              <textarea
                id="booking-purpose"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                rows={3}
                placeholder="例: LP構成案のすり合わせをしたいです"
                className="mt-2 w-full resize-none rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm outline-none focus:border-brand focus:bg-white"
              />
              {selected && (
                <p className="mt-2 text-xs text-stone-500">
                  選択中:{" "}
                  <span className="font-bold text-brand-dark">
                    {selected.dayLabel} {selected.time}〜
                  </span>
                </p>
              )}
            </Card>

            <button
              onClick={book}
              disabled={!selected || !purpose.trim() || phase === "sending"}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-bold text-white shadow-lg shadow-brand/30 transition-colors active:bg-brand-dark disabled:opacity-40 disabled:shadow-none"
            >
              {phase === "sending" ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  予約しています…
                </>
              ) : (
                <>
                  <Icon name="calendar" className="h-4.5 w-4.5" />
                  この枠で予約する
                </>
              )}
            </button>
            <p className="text-center text-[11px] text-stone-400">
              予約が確定するとZoomリンクが自動発行されます
            </p>
          </>
        )}
      </main>
    </>
  );
}
