import Link from "next/link";
import { Avatar, Badge, Card, PageHeader, SectionTitle } from "@/components/ui";
import { workerThreads } from "@/lib/mock-data";
import type { ChatThread } from "@/lib/types";

export const metadata = { title: "チャット" };

/**
 * チャット一覧 (作業者) — 「案件種別ごとに整理されたチャット画面」
 * 本部との直通スレッドと、案件ごとの専用グループを分離して表示。
 * カテゴリバッジ (動画制作/HP制作/…) で情報が混ざらないようにする。
 */

function ThreadRow({ thread, pinned = false }: { thread: ChatThread; pinned?: boolean }) {
  return (
    <Link
      href={`/worker/messages/${thread.id}`}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream active:bg-ink/5"
    >
      <Avatar name={thread.title} color={thread.avatarColor} />
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <p className="truncate text-sm font-bold">{thread.title}</p>
          {pinned && <Badge tone="brand">本部</Badge>}
        </div>
        <div className="mt-0.5 flex items-center gap-1.5">
          {thread.category && <Badge tone="violet">{thread.category}</Badge>}
          <p className="min-w-0 truncate text-xs text-ink/55">
            {thread.lastMessage}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-ink/40">{thread.lastMessageAt}</span>
        {thread.unreadCount > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-sm bg-brand px-1.5 text-[10px] font-bold text-white">
            {thread.unreadCount}
          </span>
        ) : (
          <span className="h-5" />
        )}
      </div>
    </Link>
  );
}

export default function WorkerMessagesPage() {
  const hqThread = workerThreads.find((t) => t.id === "wth1");
  const projectGroups = workerThreads.filter(
    (t) => t.kind === "group" && t.projectId,
  );

  return (
    <>
      <PageHeader title="チャット" />
      <main className="space-y-4 px-4 pb-24 pt-4">
        {/* 本部直通 (最上部固定) */}
        {hqThread && (
          <Card className="border-brand/30">
            <ThreadRow thread={hqThread} pinned />
          </Card>
        )}

        {/* 案件ごとの専用グループ */}
        <section>
          <SectionTitle title="案件グループ" />
          <Card className="divide-y divide-ink/8">
            {projectGroups.map((t) => (
              <ThreadRow key={t.id} thread={t} />
            ))}
          </Card>
          <p className="mt-2 px-2 text-[11px] leading-relaxed text-ink/40">
            案件ごとに専用グループが作られるので、「HP修正」「動画制作」の話題が混ざりません🗂️
          </p>
        </section>
      </main>
    </>
  );
}
