"use client";

/**
 * チャット画面 (クライアントコンポーネント)
 * プロトタイプではローカルstateにメッセージを追加するだけ。
 * 本実装では Firestore の messages コレクションを onSnapshot で購読し、
 * 送信時に addDoc + 相手へFCMプッシュ通知を送る。
 *
 * 「タスク化」ボタン: LINE/メッセンジャー運用で起きる転記忘れを防ぐため、
 * 受信メッセージをワンタップでタスクに変換できる (source: "chat")。
 * 本実装では tasks コレクションへの addDoc + 担当者への通知になる。
 */
import { useRef, useState } from "react";
import type { ChatMessage } from "@/lib/types";
import { Icon } from "./icons";

export function ChatRoom({
  threadId,
  initialMessages,
  myName,
  accentClass = "bg-brand",
}: {
  threadId: string;
  initialMessages: ChatMessage[];
  myName: string;
  accentClass?: string;
}) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [draft, setDraft] = useState("");
  const [taskified, setTaskified] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function send() {
    const body = draft.trim();
    if (!body) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `local-${prev.length + 1}`,
        threadId,
        senderName: myName,
        isMe: true,
        body,
        sentAt: "たった今",
      },
    ]);
    setDraft("");
    // 本実装: addDoc(collection(db, "threads", threadId, "messages"), ...)
    requestAnimationFrame(() =>
      bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
    );
  }

  function taskify(messageId: string) {
    setTaskified((prev) => ({ ...prev, [messageId]: true }));
    setToast("タスクに追加しました ✓(デモ)");
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
    // 本実装: addDoc(collection(db, "tasks"), { source: "chat", ... })
  }

  return (
    <div className="relative flex h-full flex-col">
      {/* タスク化トースト */}
      {toast && (
        <div className="pointer-events-none absolute inset-x-0 top-3 z-30 flex justify-center">
          <span className="rounded-full bg-stone-800/90 px-4 py-2 text-xs font-semibold text-white shadow-lg">
            {toast}
          </span>
        </div>
      )}

      <div className="flex-1 space-y-1 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => {
          const prev = messages[i - 1];
          const showName = !m.isMe && (!prev || prev.senderName !== m.senderName);
          return (
            <div key={m.id}>
              {m.dateLabel && (
                <div className="my-3 flex justify-center">
                  <span className="rounded-full bg-stone-200/70 px-3 py-0.5 text-[10px] font-medium text-stone-500">
                    {m.dateLabel}
                  </span>
                </div>
              )}
              <div
                className={`flex items-end gap-2 ${m.isMe ? "justify-end" : "justify-start"}`}
              >
                {m.isMe && (
                  <span className="mb-1 text-[10px] text-stone-400">
                    {m.sentAt}
                  </span>
                )}
                <div className={`max-w-[75%] ${m.isMe ? "order-2" : ""}`}>
                  {showName && (
                    <p className="mb-0.5 ml-1 text-[10px] text-stone-400">
                      {m.senderName}
                    </p>
                  )}
                  <div
                    className={`whitespace-pre-wrap px-3.5 py-2 text-sm leading-relaxed ${
                      m.isMe
                        ? `${accentClass} rounded-[1.3rem_1.3rem_0.35rem_1.3rem] text-white shadow-[2px_2px_0_rgba(40,47,90,0.15)]`
                        : "rounded-[1.3rem_1.3rem_1.3rem_0.35rem] border-2 border-brand/10 bg-white text-stone-800 shadow-[2px_2px_0_rgba(40,47,90,0.05)]"
                    }`}
                  >
                    {m.body}
                  </div>
                  {taskified[m.id] && (
                    <p className="mt-0.5 ml-1 flex items-center gap-0.5 text-[10px] font-semibold text-emerald-600">
                      <Icon name="check" className="h-3 w-3" />
                      タスク化済み
                    </p>
                  )}
                </div>
                {!m.isMe && (
                  <div className="mb-1 flex flex-col items-center gap-1">
                    <button
                      onClick={() => taskify(m.id)}
                      disabled={taskified[m.id]}
                      aria-label="このメッセージをタスク化"
                      title="タスク化"
                      className={`flex h-6 w-6 items-center justify-center rounded-full transition-colors ${
                        taskified[m.id]
                          ? "text-emerald-500"
                          : "text-stone-300 hover:bg-brand-soft hover:text-brand"
                      }`}
                    >
                      <Icon name="clipboard" className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-[10px] text-stone-400">
                      {m.sentAt}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 border-t-2 border-dashed border-brand/15 bg-white p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
        <div className="mx-auto flex max-w-md items-end gap-2">
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                send();
              }
            }}
            rows={1}
            placeholder="メッセージを入力"
            className="max-h-24 flex-1 resize-none rounded-3xl border-2 border-brand/15 bg-cream/60 px-4 py-2.5 text-sm outline-none focus:border-brand/40 focus:bg-white"
          />
          <button
            onClick={send}
            disabled={!draft.trim()}
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-white transition-opacity ${accentClass} ${
              draft.trim() ? "" : "opacity-40"
            }`}
            aria-label="送信"
          >
            <Icon name="send" className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
