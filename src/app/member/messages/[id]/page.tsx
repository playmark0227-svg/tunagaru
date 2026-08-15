import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/chat";
import { Icon } from "@/components/icons";
import { Avatar, Badge } from "@/components/ui";
import { currentMember, memberThreads, messagesByThread } from "@/lib/mock-data";
import { THREAD_KIND_LABELS } from "@/lib/types";

export const metadata = { title: "チャット" };

export function generateStaticParams() {
  return memberThreads.map((t) => ({ id: t.id }));
}

export default async function MemberChatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const thread = memberThreads.find((t) => t.id === id);
  if (!thread) notFound();

  const messages = (messagesByThread[id] ?? []).map((m) => ({
    ...m,
    isMe: m.senderName === currentMember.ownerName,
  }));

  return (
    // BottomNav (高さ約3.5rem) に入力欄が隠れないよう pb-14 を確保
    <div className="flex h-dvh flex-col pb-14">
      <header className="z-20 shrink-0 border-b border-ink/12 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
          <Link
            href="/member/messages"
            className="-ml-1 flex h-8 w-8 items-center justify-center rounded-sm text-ink/55 hover:bg-ink/5"
            aria-label="チャット一覧へ戻る"
          >
            <Icon name="arrow-left" className="h-5 w-5" />
          </Link>
          <Avatar name={thread.title} color={thread.avatarColor} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="truncate text-sm font-bold">{thread.title}</p>
              {thread.kind !== "customer" && (
                <Badge tone={thread.kind === "dm" ? "amber" : "violet"}>
                  {THREAD_KIND_LABELS[thread.kind]}
                </Badge>
              )}
            </div>
            {thread.memberCount ? (
              <p className="text-[10px] text-ink/40">
                メンバー {thread.memberCount}人
              </p>
            ) : (
              !thread.visibleToCustomer && (
                <p className="text-[10px] text-amber-600">
                  この会話はお客様には表示されません
                </p>
              )
            )}
          </div>
          {thread.projectIds?.[0] && (
            <Link
              href={`/member/projects/${thread.projectIds[0]}`}
              className="flex h-8 w-8 items-center justify-center rounded-sm text-ink/55 hover:bg-ink/5"
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
          myName={currentMember.ownerName}
        />
      </div>
    </div>
  );
}
