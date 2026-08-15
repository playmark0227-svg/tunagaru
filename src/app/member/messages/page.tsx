import type { Metadata } from "next";
import Link from "next/link";
import { Avatar, Badge, Card, PageHeader, UnreadBadge } from "@/components/ui";
import { Icon } from "@/components/icons";
import { currentMember, memberThreads } from "@/lib/mock-data";
import type { ChatThread, ThreadKind } from "@/lib/types";

export const metadata: Metadata = { title: "チャット" };

/**
 * メンバーのチャット一覧
 *
 * ▼ 2026-08 打ち合わせ
 * 「メッセンジャーとLINEでぐちゃぐちゃ」を解消するのが最大の目的なので、
 * 種類ごとに区切って全部を1画面に並べる。
 * 個別(DM)は単価の相談など人に見せたくない話に使うため、
 * 顧客グループとは明確に分けて表示する。
 */

const SECTIONS: { kind: ThreadKind; title: string; note: string }[] = [
  {
    kind: "customer",
    title: "本部とのやりとり",
    note: "案件の相談はここから。担当スタッフも参加しています",
  },
  {
    kind: "dm",
    title: "個別 (1対1)",
    note: "この会話は相手以外には見えません",
  },
  {
    kind: "staff",
    title: "スタッフ間",
    note: "スタッフのみ。お客様には表示されません",
  },
  {
    kind: "end_user",
    title: "あなたのお客様",
    note: "生徒・お客様とのやりとり",
  },
];

function ThreadRow({ thread }: { thread: ChatThread }) {
  return (
    <Link
      href={`/member/messages/${thread.id}`}
      className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-aqua-soft/40 active:bg-aqua-soft"
    >
      <Avatar name={thread.title} color={thread.avatarColor} size="md" />
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-1.5">
          <span className="min-w-0 truncate text-sm font-bold">
            {thread.title}
          </span>
          {thread.memberCount && (
            <span className="shrink-0 text-[10px] text-ink/40">
              {thread.memberCount}人
            </span>
          )}
          {!thread.visibleToCustomer && (
            <Badge tone="amber">お客様に非表示</Badge>
          )}
        </span>
        <span
          className={`mt-0.5 block truncate text-xs ${
            thread.unreadCount > 0
              ? "font-semibold text-ink/70"
              : "text-ink/40"
          }`}
        >
          {thread.lastMessage}
        </span>
      </span>
      <span className="flex shrink-0 flex-col items-end gap-1">
        <span className="text-[10px] text-ink/40">{thread.lastMessageAt}</span>
        {thread.unreadCount > 0 ? (
          <UnreadBadge count={thread.unreadCount} />
        ) : (
          <span className="h-5" />
        )}
      </span>
    </Link>
  );
}

export default function MemberMessagesPage() {
  const total = memberThreads.reduce((n, t) => n + t.unreadCount, 0);
  const sections = SECTIONS.map((s) => ({
    ...s,
    threads: memberThreads.filter(
      (t) => t.kind === s.kind && (currentMember.isStaff || t.visibleToCustomer),
    ),
  })).filter((s) => s.threads.length > 0);

  return (
    <>
      <PageHeader title={total > 0 ? `チャット (${total})` : "チャット"} />
      <main className="space-y-5 px-4 pb-24 pt-4">
        <p className="text-[11px] leading-relaxed text-ink/50">
          つながるCraftとのやりとりは、すべてここに集約されます。
          <br />
          LINE・メール・電話に散らばらせず、この画面だけを見れば済む状態にします。
        </p>

        {sections.map((s) => (
          <section key={s.kind}>
            <div className="mb-2 flex items-baseline justify-between gap-2">
              <h2 className="zigzag-under text-[13px] font-bold tracking-wide">
                {s.title}
              </h2>
              <span className="text-[10px] text-ink/40">
                {s.threads.length}件
              </span>
            </div>
            <p className="mb-2 text-[10px] leading-relaxed text-ink/40">
              {s.note}
            </p>
            <Card className="divide-y divide-ink/8">
              {s.threads.map((t) => (
                <ThreadRow key={t.id} thread={t} />
              ))}
            </Card>
          </section>
        ))}

        <div className="flex items-center gap-2 border border-ink/12 bg-white px-4 py-3">
          <Icon name="plus" className="h-4 w-4 shrink-0 text-aqua" />
          <p className="text-[11px] leading-relaxed text-ink/55">
            新しい相談は本部とのチャットから。内容に応じて本部が担当スタッフを追加します。
          </p>
        </div>
      </main>
    </>
  );
}
