import Link from "next/link";
import { Avatar, Badge, Card, PageHeader, SectionTitle, UnreadBadge } from "@/components/ui";
import { clientThreads } from "@/lib/mock-data";
import type { ChatThread } from "@/lib/types";

export const metadata = { title: "チャット" };

function ThreadRow({
  thread,
  pinned = false,
}: {
  thread: ChatThread;
  pinned?: boolean;
}) {
  return (
    <Link
      href={`/client/messages/${thread.id}`}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream active:bg-ink/5"
    >
      <Avatar name={thread.title} color={thread.avatarColor} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-bold">{thread.title}</p>
          {pinned && <Badge tone="brand">本部</Badge>}
          {thread.kind === "group" && thread.memberCount && (
            <span className="shrink-0 text-[10px] text-ink/40">
              ({thread.memberCount})
            </span>
          )}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          {thread.category && <Badge tone="violet">{thread.category}</Badge>}
          <p className="min-w-0 truncate text-xs text-ink/55">
            {thread.lastMessage}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-ink/40">
          {thread.lastMessageAt}
        </span>
        {thread.unreadCount > 0 ? <UnreadBadge count={thread.unreadCount} /> : <span className="h-5" />}
      </div>
    </Link>
  );
}

export default function ClientMessagesPage() {
  const hqThread = clientThreads.find((t) => t.id === "th1");
  // 案件ごとの専用グループ (カテゴリで種別を明示し、話題が混ざらないようにする)
  const projectGroups = clientThreads.filter(
    (t) => t.kind === "group" && t.projectId,
  );
  const otherThreads = clientThreads.filter(
    (t) => t.id !== "th1" && !(t.kind === "group" && t.projectId),
  );

  return (
    <>
      <PageHeader title="チャット" />
      <main className="space-y-4 px-4 pb-24 pt-4">
        {/* 本部スレッド (最上部固定) */}
        {hqThread && (
          <Card className="border-brand/30">
            <ThreadRow thread={hqThread} pinned />
          </Card>
        )}

        {/* 案件ごとの専用グループ */}
        {projectGroups.length > 0 && (
          <section>
            <SectionTitle title="案件グループ" />
            <Card className="divide-y divide-ink/8">
              {projectGroups.map((t) => (
                <ThreadRow key={t.id} thread={t} />
              ))}
            </Card>
            <p className="mt-2 px-2 text-[11px] leading-relaxed text-ink/40">
              「HP修正」「動画制作」など案件ごとにグループが分かれているので、話題が混ざりません🗂️
            </p>
          </section>
        )}

        {/* 生徒とのトーク */}
        <section>
          <SectionTitle title="生徒とのトーク" />
          <Card className="divide-y divide-ink/8">
            {otherThreads.map((t) => (
              <ThreadRow key={t.id} thread={t} />
            ))}
          </Card>
        </section>

        <p className="px-2 text-center text-[11px] leading-relaxed text-ink/40">
          本部への相談は上の「本部」スレッドからいつでもどうぞ🌿
        </p>
      </main>
    </>
  );
}
