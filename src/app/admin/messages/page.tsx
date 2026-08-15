import type { Metadata } from "next";
import Link from "next/link";
import { hqThreads } from "@/lib/mock-data";
import type { ChatThread } from "@/lib/types";
import { Avatar, Badge, Card, SectionTitle, UnreadBadge } from "@/components/ui";
import { AdminHeader } from "../header";
import { THREAD_KIND_LABELS } from "@/lib/types";

export const metadata: Metadata = { title: "チャット" };

function ThreadRow({ t }: { t: ChatThread }) {
  return (
    <Link
      href={`/admin/messages/${t.id}`}
      className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-cream active:bg-ink/5"
    >
      <Avatar name={t.title} color={t.avatarColor} size="md" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="truncate text-sm font-bold">{t.title}</span>
          {t.kind === "customer" && (
            <span className="shrink-0 rounded-sm bg-ink/5 px-1.5 py-0.5 text-[10px] font-semibold text-ink/55">
              {t.memberCount}名
            </span>
          )}
        </span>
        <span className="mt-0.5 flex items-center gap-1.5">
          {t.kind !== "customer" && (
            <Badge tone={t.kind === "dm" ? "amber" : "violet"}>
              {THREAD_KIND_LABELS[t.kind]}
            </Badge>
          )}
          <span
            className={`min-w-0 truncate text-xs ${
              t.unreadCount > 0
                ? "font-semibold text-ink/70"
                : "text-ink/40"
            }`}
          >
            {t.lastMessage}
          </span>
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-ink/40">{t.lastMessageAt}</span>
        {t.unreadCount > 0 ? <UnreadBadge count={t.unreadCount} /> : <span className="h-5" />}
      </span>
    </Link>
  );
}

export default function AdminMessagesPage() {
  const unreadTotal = hqThreads.reduce((sum, t) => sum + t.unreadCount, 0);
  // 案件ごとの専用グループと、クライアント個別スレッドを分離して表示
  const projectGroups = hqThreads.filter(
    (t) => t.kind === "customer" && t.projectIds?.[0],
  );
  const clientThreadList = hqThreads.filter(
    (t) => !(t.kind === "customer" && t.projectIds?.[0]),
  );

  return (
    <>
      <AdminHeader
        title="チャット"
        action={
          unreadTotal > 0 ? (
            <span className="rounded-sm bg-aqua-soft px-2.5 py-1 text-[11px] font-bold text-aqua">
              未読 {unreadTotal}件
            </span>
          ) : undefined
        }
      />

      <main className="mx-auto max-w-md space-y-5 px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        {/* 案件ごとの専用グループ */}
        <section>
          <SectionTitle title="案件グループ" />
          <Card className="divide-y divide-ink/8">
            {projectGroups.map((t) => (
              <ThreadRow key={t.id} t={t} />
            ))}
          </Card>
          <p className="mt-2 px-2 text-[11px] leading-relaxed text-ink/40">
            案件ごと(HP修正/動画制作/…)にグループを分離し、関係者だけでやり取りします🗂️
          </p>
        </section>

        {/* クライアント個別 */}
        <section>
          <SectionTitle title="クライアント" />
          <Card className="divide-y divide-ink/8">
            {clientThreadList.map((t) => (
              <ThreadRow key={t.id} t={t} />
            ))}
          </Card>
        </section>
      </main>
    </>
  );
}
