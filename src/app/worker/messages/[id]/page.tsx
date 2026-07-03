import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/chat";
import { Icon } from "@/components/icons";
import { Avatar, Badge } from "@/components/ui";
import { currentWorker, messagesByThread, workerThreads } from "@/lib/mock-data";

export const metadata = { title: "チャット" };

export function generateStaticParams() {
  return workerThreads.map((t) => ({ id: t.id }));
}

export default async function WorkerChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = workerThreads.find((t) => t.id === id);
  if (!thread) notFound();

  // 作業者(田村)視点に isMe を補正
  const messages = (messagesByThread[id] ?? []).map((m) => ({
    ...m,
    isMe: m.senderName === currentWorker.name,
  }));

  return (
    // BottomNav (高さ約3.5rem) に入力欄が隠れないよう pb-14 を確保
    <div className="flex h-dvh flex-col pb-14">
      <header className="z-20 shrink-0 border-b-[2.5px] border-ink bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
          <Link
            href="/worker/messages"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
            aria-label="チャット一覧へ戻る"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </Link>
          <Avatar name={thread.title} color={thread.avatarColor} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-bold">{thread.title}</p>
              {thread.category && <Badge tone="violet">{thread.category}</Badge>}
            </div>
            {thread.kind === "group" && thread.memberCount && (
              <p className="text-[10px] text-stone-400">
                メンバー {thread.memberCount}人
              </p>
            )}
          </div>
          {thread.projectId && (
            <Link
              href={`/worker/projects/${thread.projectId}`}
              className="flex h-8 w-8 items-center justify-center rounded-full text-stone-500 hover:bg-stone-100"
              aria-label="案件詳細を見る"
            >
              <Icon name="briefcase" className="h-4.5 w-4.5" />
            </Link>
          )}
        </div>
      </header>

      <div className="min-h-0 flex-1">
        <ChatRoom
          threadId={id}
          initialMessages={messages}
          myName={currentWorker.name}
        />
      </div>
    </div>
  );
}
