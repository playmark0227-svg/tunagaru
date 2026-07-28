import type { Metadata } from "next";
import Link from "next/link";
import {
  adminStats,
  aiMorningDigest,
  bookingSlots,
  hqThreads,
  orders,
  tasks,
} from "@/lib/mock-data";
import { formatYen, formatMd } from "@/lib/format";
import { Avatar, Card, SectionTitle, UnreadBadge } from "@/components/ui";
import { StatCard } from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdminHeader } from "./header";

export const metadata: Metadata = { title: "本部ダッシュボード" };

export default function AdminDashboardPage() {
  const pendingOrders = orders.filter((o) => o.status === "received");
  const reviewTasks = tasks.filter((t) => t.status === "review");
  const hqTasks = tasks.filter(
    (t) => t.assignee === "本部" && t.status !== "done",
  );
  const needsAction = pendingOrders.length + reviewTasks.length + hqTasks.length;

  // 予約済み(=空きでない)枠を「直近の予約」として表示
  const bookedSlots = bookingSlots.filter((s) => !s.available).slice(0, 3);
  const bookedWith = [
    "アトリエ彩花 (佐藤様)",
    "Nail Salon Luce (高橋様)",
    "Studio Hana Candle (花村様)",
  ];

  return (
    <>
      <AdminHeader
        title="ダッシュボード"
        action={
          <Link
            href="/admin/announcements"
            className="relative flex h-8 w-8 items-center justify-center rounded-sm text-ink/55 hover:bg-ink/5"
            aria-label="お知らせ"
          >
            <Icon name="bell" className="h-5 w-5" />
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand" />
          </Link>
        }
      />

      <main className="mx-auto max-w-md space-y-6 px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        {/* あいさつ */}
        <div>
          <p className="text-lg font-bold">おつかれさまです 👋</p>
          <p className="mt-0.5 text-xs text-ink/55">
            2026年7月3日(金) — 本日のプラットフォーム状況です
          </p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <StatCard
            label="クライアント数"
            value={`${adminStats.totalClients}社`}
            sub={`契約中 ${adminStats.activeClients}社`}
            icon="users"
            tone="blue"
          />
          <StatCard
            label="進行中案件"
            value={`${adminStats.inProgressProjects}件`}
            sub={`募集中 ${adminStats.openProjects}件`}
            icon="briefcase"
            tone="brand"
          />
          <StatCard
            label="今月売上"
            value={formatYen(adminStats.monthlySales)}
            sub={`先月比 ${adminStats.monthlySalesGrowth}`}
            icon="chart"
            tone="green"
          />
          <StatCard
            label="未読メッセージ"
            value={`${adminStats.unreadMessages}件`}
            sub="返信をお願いします"
            icon="chat"
            tone="amber"
          />
        </div>

        {/* クイックアクション */}
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/admin/projects/new"
            className="comic-press flex items-center justify-center gap-2 rounded-sm border border-aqua bg-aqua px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-[#12a0bb]"
          >
            <Icon name="plus" className="h-4.5 w-4.5" />
            案件を作成
          </Link>
          <Link
            href="/admin/announcements"
            className="comic-press flex items-center justify-center gap-2 rounded-sm border border-ink/15 bg-white px-4 py-3 text-sm font-bold text-ink transition-colors hover:border-aqua hover:text-aqua"
          >
            <Icon name="megaphone" className="h-4.5 w-4.5" />
            一斉通知を送る
          </Link>
        </div>

        {/* AIアシスタント: 朝のダイジェスト (Phase 3 プレビュー) */}
        <section>
          <div className="mb-2 flex items-center justify-between">
            <h2 className="flex items-center gap-1.5 text-sm font-bold text-ink/80">
              <span>🤖</span> AIアシスタント — 朝のダイジェスト
            </h2>
            <span className="rounded-full border border-ink/12 bg-aqua-soft px-2 py-0.5 text-[10px] font-bold text-ink">
              Phase 3 プレビュー
            </span>
          </div>
          <Card className="sticker-glow divide-y divide-ink/8">
            {aiMorningDigest.map((item) => (
              <Link
                key={item.id}
                href={item.href ?? "/admin"}
                className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream"
              >
                <span
                  className={`shrink-0 rounded-sm px-2 py-0.5 text-[10px] font-bold ${
                    item.kind === "期限超過"
                      ? "bg-rose-50 text-rose-600"
                      : item.kind === "返信待ち"
                        ? "bg-amber-50 text-amber-600"
                        : item.kind === "タスク候補"
                          ? "bg-violet-50 text-violet-600"
                          : "bg-sky-50 text-sky-600"
                  }`}
                >
                  {item.kind}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm">
                  {item.text}
                </span>
                <Icon
                  name="chevron-right"
                  className="h-4 w-4 shrink-0 text-ink/25"
                />
              </Link>
            ))}
            <p className="px-4 py-2.5 text-[11px] leading-relaxed text-ink/40">
              全チャット・タスクをAIが毎朝チェックし、見落としをレポートします (デモ表示)
            </p>
          </Card>
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 対応が必要なこと */}
          <section>
            <SectionTitle title={`対応が必要なこと (${needsAction})`} />
            <Card className="divide-y divide-ink/8">
              {pendingOrders.map((o) => (
                <Link
                  key={o.id}
                  href="/admin/orders"
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-amber-50 text-amber-600">
                    <Icon name="package" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      新規注文 #{o.id} — 発注処理をお願いします
                    </span>
                    <span className="block text-xs text-ink/40">
                      {o.endUserName ?? o.clientName} 様・{formatYen(o.total)}・
                      {formatMd(o.orderedAt)} 受付
                    </span>
                  </span>
                  <Icon
                    name="chevron-right"
                    className="h-4 w-4 shrink-0 text-ink/25"
                  />
                </Link>
              ))}
              {reviewTasks.map((t) => (
                <Link
                  key={t.id}
                  href={`/admin/projects/${t.projectId}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-aqua-soft text-aqua">
                    <Icon name="clipboard" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      確認待ち: {t.title}
                    </span>
                    <span className="block text-xs text-ink/40">
                      {t.assignee} 様より提出・期限 {formatMd(t.dueDate)}
                    </span>
                  </span>
                  <Icon
                    name="chevron-right"
                    className="h-4 w-4 shrink-0 text-ink/25"
                  />
                </Link>
              ))}
              {hqTasks.map((t) => (
                <Link
                  key={t.id}
                  href={`/admin/projects/${t.projectId}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-sky-50 text-sky-600">
                    <Icon name="pencil" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      本部タスク: {t.title}
                    </span>
                    <span className="block text-xs text-ink/40">
                      期限 {formatMd(t.dueDate)}
                      {t.note ? `・${t.note}` : ""}
                    </span>
                  </span>
                  <Icon
                    name="chevron-right"
                    className="h-4 w-4 shrink-0 text-ink/25"
                  />
                </Link>
              ))}
            </Card>
          </section>

          {/* 最近のチャット */}
          <section>
            <SectionTitle
              title="最近のチャット"
              action={{ href: "/admin/messages", label: "すべて見る" }}
            />
            <Card className="divide-y divide-ink/8">
              {hqThreads.slice(0, 4).map((t) => (
                <Link
                  key={t.id}
                  href={`/admin/messages/${t.id}`}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream"
                >
                  <Avatar name={t.title} color={t.avatarColor} size="sm" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      {t.title}
                    </span>
                    <span className="block truncate text-xs text-ink/40">
                      {t.lastMessage}
                    </span>
                  </span>
                  <span className="flex shrink-0 flex-col items-end gap-1">
                    <span className="text-[10px] text-ink/40">
                      {t.lastMessageAt}
                    </span>
                    <UnreadBadge count={t.unreadCount} />
                  </span>
                </Link>
              ))}
            </Card>
          </section>
        </div>

        {/* 直近の予約 */}
        <section>
          <SectionTitle title="直近のZoom予約" />
          <Card className="divide-y divide-ink/8">
            {bookedSlots.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-violet-50 text-violet-500">
                  <Icon name="video" className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold">
                    {s.dayLabel} {s.time}〜
                  </span>
                  <span className="block truncate text-xs text-ink/40">
                    {bookedWith[i % bookedWith.length]}・Zoom打ち合わせ
                  </span>
                </span>
                <span className="shrink-0 rounded-sm bg-ink/5 px-2 py-0.5 text-[10px] font-semibold text-ink/55">
                  確定済み
                </span>
              </div>
            ))}
          </Card>
        </section>
      </main>
    </>
  );
}
