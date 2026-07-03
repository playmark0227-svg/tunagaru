import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/chat";
import { Icon } from "@/components/icons";
import { Avatar, Badge } from "@/components/ui";
import { clientThreads, messagesByThread } from "@/lib/mock-data";

export const metadata = { title: "チャット" };

export function generateStaticParams() {
  return clientThreads.map((t) => ({ id: t.id }));
}

export default async function ClientChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = clientThreads.find((t) => t.id === id);
  if (!thread) notFound();

  const messages = messagesByThread[id] ?? [];

  return (
    // BottomNav (高さ約3.5rem) に入力欄が隠れないよう pb-14 を確保
    <div className="flex h-dvh flex-col pb-14">
      {/* トークヘッダー */}
      <header className="z-20 shrink-0 border-b border-ink/12 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
          <Link
            href="/client/messages"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-sm text-ink/55 hover:bg-ink/5"
            aria-label="チャット一覧へ戻る"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </Link>
          <Avatar name={thread.title} color={thread.avatarColor} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-bold">{thread.title}</p>
              {thread.id === "th1" && <Badge tone="brand">本部</Badge>}
            </div>
            {thread.kind === "group" && thread.memberCount && (
              <p className="text-[10px] text-ink/40">
                メンバー {thread.memberCount}人
              </p>
            )}
          </div>
        </div>
      </header>

      {/* トーク本体 */}
      <div className="min-h-0 flex-1">
        <ChatRoom
          threadId={id}
          initialMessages={messages}
          myName="佐藤 彩香"
        />
      </div>
    </div>
  );
}
