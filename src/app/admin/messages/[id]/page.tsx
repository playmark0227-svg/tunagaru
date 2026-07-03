import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hqThreads, messagesByThread } from "@/lib/mock-data";
import { Avatar } from "@/components/ui";
import { Icon } from "@/components/icons";
import { ChatRoom } from "@/components/chat";

export const metadata: Metadata = { title: "チャット" };

export function generateStaticParams() {
  return hqThreads.map((t) => ({ id: t.id }));
}

const MY_NAME = "繋がるクラフト 本部";

export default async function AdminChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = hqThreads.find((t) => t.id === id);
  if (!thread) notFound();

  // 本部視点に isMe を補正する
  const messages = (messagesByThread[id] ?? []).map((m) => ({
    ...m,
    isMe: m.senderName === MY_NAME,
  }));

  return (
    <div className="mx-auto flex h-dvh max-w-md flex-col pb-14 md:max-w-2xl md:pb-0">
      {/* トークヘッダー */}
      <header className="sticky top-0 z-20 border-b border-ink/12 bg-cream/95 backdrop-blur">
        <div className="flex h-12 items-center gap-2 px-4 md:h-14">
          <Link
            href="/admin/messages"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
            aria-label="チャット一覧へ戻る"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </Link>
          <Avatar name={thread.title} color={thread.avatarColor} size="sm" />
          <div className="min-w-0 flex-1">
            <h1 className="truncate text-sm font-bold leading-tight">
              {thread.title}
            </h1>
            <p className="text-[10px] text-stone-400">
              {thread.kind === "group"
                ? `グループ・${thread.memberCount}名`
                : "クライアント"}
            </p>
          </div>
          <span
            className="flex h-8 w-8 items-center justify-center rounded-full text-stone-400"
            title="Zoom打ち合わせ (本実装で対応)"
          >
            <Icon name="video" className="h-5 w-5" />
          </span>
        </div>
      </header>

      {/* トーク本体 */}
      <div className="min-h-0 flex-1">
        <ChatRoom
          threadId={id}
          initialMessages={messages}
          myName={MY_NAME}
          accentClass="bg-indigo-500"
        />
      </div>
    </div>
  );
}
