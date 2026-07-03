import type { Metadata } from "next";
import Link from "next/link";
import { hqThreads } from "@/lib/mock-data";
import type { ChatThread } from "@/lib/types";
import { Avatar, Badge, Card, SectionTitle } from "@/components/ui";
import { AdminHeader } from "../header";

export const metadata: Metadata = { title: "チャット" };

function ThreadRow({ t }: { t: ChatThread }) {
  return (
    <Link
      href={`/admin/messages/${t.id}`}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-stone-50 active:bg-stone-100"
    >
      <Avatar name={t.title} color={t.avatarColor} size="md" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-bold">{t.title}</span>
          {t.kind === "group" && (
            <span className="shrink-0 rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500">
              {t.memberCount}名
            </span>
          )}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5">
          {t.category && <Badge tone="violet">{t.category}</Badge>}
          <span
            className={`min-w-0 truncate text-xs ${
              t.unreadCount > 0
                ? "font-semibold text-stone-600"
                : "text-stone-400"
            }`}
          >
            {t.lastMessage}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-stone-400">{t.lastMessageAt}</span>
        {t.unreadCount > 0 ? (
          <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white">
            {t.unreadCount}
          </span>
        ) : (
          <span className="h-5" />
        )}
      </span>
    </Link>
  );
}

export default function AdminMessagesPage() {
  const unreadTotal = hqThreads.reduce((sum, t) => sum + t.unreadCount, 0);
  // 案件ごとの専用グループと、クライアント個別スレッドを分離して表示
  const projectGroups = hqThreads.filter(
    (t) => t.kind === "group" && t.projectId,
  );
  const clientThreadList = hqThreads.filter(
    (t) => !(t.kind === "group" && t.projectId),
  );

  return (
    <>
      <AdminHeader
        title="チャット"
        action={
          unreadTotal > 0 ? (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600">
              未読 {unreadTotal}件
            </span>
          ) : undefined
        }
      />

      <main className="mx-auto max-w-md space-y-5 px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        {/* 案件ごとの専用グループ */}
        <section>
          <SectionTitle title="案件グループ" />
          <Card className="divide-y divide-stone-100">
            {projectGroups.map((t) => (
              <ThreadRow key={t.id} t={t} />
            ))}
          </Card>
          <p className="mt-2 px-2 text-[11px] leading-relaxed text-stone-400">
            案件ごと(HP修正/動画制作/…)にグループを分離し、関係者だけでやり取りします🗂️
          </p>
        </section>

        {/* クライアント個別 */}
        <section>
          <SectionTitle title="クライアント" />
          <Card className="divide-y divide-stone-100">
            {clientThreadList.map((t) => (
              <ThreadRow key={t.id} t={t} />
            ))}
          </Card>
        </section>
      </main>
    </>
  );
}
