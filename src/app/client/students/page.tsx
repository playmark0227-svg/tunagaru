import Link from "next/link";
import { Icon } from "@/components/icons";
import {
  Avatar,
  Card,
  ListRow,
  PageHeader,
  SectionTitle,
  StatCard,
} from "@/components/ui";
import { formatYen } from "@/lib/format";
import { currentClient, endUsers } from "@/lib/mock-data";

export const metadata = { title: "生徒管理" };

/** "2026-06-28" → "6/28" */
function shortDate(value: string): string {
  const [, m, d] = value.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export default function ClientStudentsPage() {
  const totalSpent = endUsers.reduce((sum, u) => sum + u.totalSpent, 0);

  return (
    <>
      <PageHeader title="生徒管理" backHref="/client/menu" />
      <main className="space-y-4 px-4 pb-24 pt-4">
        {/* 一斉メッセージ導線 */}
        <Link
          href="/client/messages/th8"
          className="flex items-center gap-3 rounded-2xl bg-brand p-4 text-white shadow-lg shadow-brand/30 transition-colors active:bg-brand-dark"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/20">
            <Icon name="megaphone" className="h-5 w-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-bold">
              生徒のみなさまへ一斉メッセージ
            </span>
            <span className="mt-0.5 block text-[11px] text-white/80">
              グループ(33人)にお知らせを送信できます
            </span>
          </span>
          <Icon name="chevron-right" className="h-5 w-5 shrink-0 text-white/70" />
        </Link>

        {/* サマリー */}
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            label="アプリ利用中の生徒"
            value={`${endUsers.length}名`}
            sub={`全生徒 ${currentClient.studentCount}名`}
            icon="users"
          />
          <StatCard
            label="累計購入額 (合計)"
            value={formatYen(totalSpent)}
            sub="物販の売上に貢献中"
            icon="cart"
            tone="green"
          />
        </div>

        {/* 生徒一覧 */}
        <section>
          <SectionTitle title="生徒一覧" />
          <Card className="divide-y divide-stone-100">
            {endUsers.map((u) => (
              <ListRow key={u.id} href={`/client/students/${u.id}`}>
                <Avatar name={u.name} color={u.avatarColor} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{u.name}</p>
                  <p className="mt-0.5 text-xs text-stone-500">
                    最終注文{" "}
                    {u.lastOrderAt ? shortDate(u.lastOrderAt) : "まだなし"}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-sm font-bold">{formatYen(u.totalSpent)}</p>
                  <p className="text-[10px] text-stone-400">累計購入額</p>
                </div>
              </ListRow>
            ))}
          </Card>
        </section>
      </main>
    </>
  );
}
