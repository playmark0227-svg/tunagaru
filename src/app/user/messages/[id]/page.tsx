import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/chat";
import { Icon } from "@/components/icons";
import { Avatar } from "@/components/ui";
import { endUserThreads, messagesByThread } from "@/lib/mock-data";

export const metadata = { title: "メッセージ" };

export function generateStaticParams() {
  return endUserThreads.map((t) => ({ id: t.id }));
}

export default async function UserChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = endUserThreads.find((t) => t.id === id);
  if (!thread) notFound();

  // 山田花子(currentEndUser)視点に isMe を補正
  const messages = (messagesByThread[id] ?? []).map((m) => ({
    ...m,
    isMe: m.senderName === "山田 花子",
  }));

  return (
    // BottomNav (高さ約3.5rem) に入力欄が隠れないよう pb-14 を確保
    <div className="flex h-dvh flex-col pb-14">
      <header className="z-20 shrink-0 border-b-2 border-dashed border-brand/15 bg-cream/90 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
          <Link
            href="/user/messages"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
            aria-label="メッセージ一覧へ戻る"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </Link>
          <Avatar name={thread.title} color={thread.avatarColor} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">{thread.title}</p>
            {thread.kind === "group" && thread.memberCount && (
              <p className="text-[10px] text-stone-400">
                メンバー {thread.memberCount}人
              </p>
            )}
          </div>
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <ChatRoom threadId={id} initialMessages={messages} myName="山田 花子" />
      </div>
    </div>
  );
}
