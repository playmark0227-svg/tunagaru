"use client";

/**
 * チャット画面 (クライアントコンポーネント)
 * プロトタイプではローカルstateにメッセージを追加するだけ。
 * 本実装では Firestore の messages コレクションを onSnapshot で購読し、
 * 送信時に addDoc + 相手へFCMプッシュ通知を送る。
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
  const bottomRef = useRef<HTMLDivElement>(null);

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

  return (
    <div className="flex h-full flex-col">
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
                    className={`whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                      m.isMe
                        ? `${accentClass} rounded-br-md text-white`
                        : "rounded-bl-md border border-stone-200/70 bg-white text-stone-800"
                    }`}
                  >
                    {m.body}
                  </div>
                </div>
                {!m.isMe && (
                  <span className="mb-1 text-[10px] text-stone-400">
                    {m.sentAt}
                  </span>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <div className="sticky bottom-0 border-t border-stone-200 bg-white p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)]">
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
            className="max-h-24 flex-1 resize-none rounded-2xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm outline-none focus:border-brand focus:bg-white"
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
