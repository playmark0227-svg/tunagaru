import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { Avatar, Badge, Card, SectionTitle } from "@/components/ui";
import { formatMd } from "@/lib/format";
import {
  currentMember,
  memberThreads,
  projects,
  tasks,
  timelinePosts,
} from "@/lib/mock-data";
import { PROJECT_STATUS_LABELS, toCustomerView } from "@/lib/types";
import { PROJECT_STATUS_TONES } from "@/lib/tones";

export const metadata: Metadata = { title: "ホーム" };

/**
 * メンバーのホーム = 全体配信タイムライン
 *
 * ▼ 2026-08 打ち合わせ
 * 「札幌でセミナーします、参加者募集」のような発信を、個別チャットに
 * 貼って回るのではなくアプリを開いた最初の画面に流したい、という要望。
 * あわせて「自分の案件が今どうなっているか」も一目で分かるようにする。
 */
export default function MemberHomePage() {
  // 自分が発注元になっている案件の進捗
  const myProjects = projects
    .filter((p) => p.customerId === currentMember.id || p.assignedMemberId === currentMember.id)
    .map(toCustomerView)
    .slice(0, 3);

  const myTasks = tasks
    .filter((t) => t.status !== "done" && t.clientId === currentMember.id)
    .slice(0, 3);

  const unread = memberThreads.reduce((n, t) => n + t.unreadCount, 0);

  const visiblePosts = timelinePosts.filter(
    (p) => !p.staffOnly || currentMember.isStaff,
  );

  return (
    <>
      {/* ヘッダー */}
      <header className="sticky top-0 z-20 border-b border-ink/12 bg-cream/95 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
          <Avatar
            name={currentMember.name}
            color={currentMember.avatarColor}
            size="sm"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold leading-tight">
              {currentMember.name}
            </p>
            <p className="truncate text-[10px] leading-tight text-ink/45">
              {currentMember.ownerName} 様
              {currentMember.isStaff && " ・スタッフ"}
            </p>
          </div>
          <Link
            href="/member/messages"
            className="relative flex h-8 w-8 items-center justify-center rounded-sm text-ink/55 hover:bg-ink/5"
            aria-label="チャット"
          >
            <Icon name="chat" className="h-5 w-5" />
            {unread > 0 && (
              <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-sm bg-aqua px-1 text-[9px] font-bold text-white">
                {unread}
              </span>
            )}
          </Link>
        </div>
      </header>

      <main className="space-y-6 px-4 pb-24 pt-4">
        {/* 進行中の案件 — 「今どうなってる?」を本部に聞かなくても分かるように */}
        {myProjects.length > 0 && (
          <section>
            <SectionTitle
              title="あなたの案件の進捗"
              action={{ href: "/member/tasks", label: "タスク一覧" }}
            />
            <Card className="divide-y divide-ink/8">
              {myProjects.map((p) => (
                <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm border border-ink/12 bg-cream text-lg">
                    {p.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {p.title}
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5">
                      <Badge tone={PROJECT_STATUS_TONES[p.status]}>
                        {PROJECT_STATUS_LABELS[p.status]}
                      </Badge>
                      <span className="text-[10px] text-ink/45">
                        納期 {formatMd(p.deadline)}
                      </span>
                    </span>
                  </span>
                </div>
              ))}
            </Card>
          </section>
        )}

        {/* やること */}
        {myTasks.length > 0 && (
          <section>
            <SectionTitle title="お願いしていること" />
            <Card className="divide-y divide-ink/8">
              {myTasks.map((t) => (
                <div key={t.id} className="flex items-center gap-3 px-4 py-3">
                  <Badge tone="amber">{t.kind}</Badge>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold">
                    {t.title}
                  </span>
                  <span className="shrink-0 text-[10px] text-ink/45">
                    {formatMd(t.dueDate)}
                  </span>
                </div>
              ))}
            </Card>
          </section>
        )}

        {/* 全体配信タイムライン */}
        <section>
          <SectionTitle title="つながるCraftからのお知らせ" />
          <div className="stagger space-y-3">
            {visiblePosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div
                  className={`flex h-24 items-center justify-center border-b border-ink/10 bg-gradient-to-br text-4xl ${post.gradient}`}
                >
                  {post.emoji}
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge
                      tone={
                        post.kind === "イベント"
                          ? "brand"
                          : post.kind === "募集"
                            ? "violet"
                            : post.kind === "実績"
                              ? "green"
                              : "gray"
                      }
                    >
                      {post.kind}
                    </Badge>
                    <span className="text-[10px] text-ink/40">
                      {formatMd(post.postedAt)} ・ {post.author}
                    </span>
                  </div>
                  <p className="mt-2 text-sm font-bold leading-snug">
                    {post.title}
                  </p>
                  <p className="mt-1.5 text-xs leading-relaxed text-ink/60">
                    {post.body}
                  </p>
                  <div className="mt-3 flex items-center justify-between border-t border-ink/8 pt-3">
                    <span className="flex items-center gap-1 text-[11px] text-ink/45">
                      <Icon name="heart" className="h-3.5 w-3.5" />
                      {post.reactions}人が反応
                    </span>
                    {post.ctaLabel && (
                      <span className="comic-press rounded-sm border border-aqua bg-aqua px-3 py-1.5 text-[11px] font-bold text-white">
                        {post.ctaLabel}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </section>

        <p className="pt-1 text-center text-[11px] leading-relaxed text-ink/40">
          個別のご相談はチャットからどうぞ。
          <br />
          新しいお知らせはプッシュ通知でお届けします 🔔
        </p>
      </main>
    </>
  );
}
