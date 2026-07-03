import Link from "next/link";
import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import {
  Avatar,
  Badge,
  Card,
  EmptyState,
  PageHeader,
  SectionTitle,
  type BadgeTone,
} from "@/components/ui";
import { formatYen } from "@/lib/format";
import { endUsers, orders } from "@/lib/mock-data";
import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

export const metadata = { title: "生徒詳細" };

export function generateStaticParams() {
  return endUsers.map((u) => ({ id: u.id }));
}

/** "2026-06-28" → "2026/6/28" */
function longDate(value: string): string {
  const [y, m, d] = value.split("-");
  return `${y}/${Number(m)}/${Number(d)}`;
}

const ORDER_TONES: Record<OrderStatus, BadgeTone> = {
  received: "amber",
  ordered_to_hq: "blue",
  shipped: "violet",
  completed: "green",
};

/** 生徒との個別スレッド (存在する場合のみ) */
const THREAD_BY_USER: Record<string, string> = {
  u1: "/client/messages/th4",
  u2: "/client/messages/th5",
};

export default async function ClientStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student = endUsers.find((u) => u.id === id);
  if (!student) notFound();

  const studentOrders = orders.filter((o) => o.endUserId === student.id);
  const messageHref = THREAD_BY_USER[student.id] ?? "/client/messages";

  return (
    <>
      <PageHeader title="生徒詳細" backHref="/client/students" />
      <main className="space-y-4 px-4 pb-24 pt-4">
        {/* プロフィール */}
        <Card className="p-5">
          <div className="flex flex-col items-center gap-2">
            <Avatar name={student.name} color={student.avatarColor} size="lg" />
            <p className="text-lg font-bold">{student.name}</p>
            <p className="text-xs text-ink/40">
              {longDate(student.joinedAt)} 入会
            </p>
          </div>
          <div className="mt-4 grid grid-cols-2 divide-x divide-ink/8 rounded-sm bg-cream py-3 text-center">
            <div>
              <p className="text-[10px] text-ink/40">累計購入額</p>
              <p className="mt-0.5 text-base font-bold text-brand">
                {formatYen(student.totalSpent)}
              </p>
            </div>
            <div>
              <p className="text-[10px] text-ink/40">最終注文日</p>
              <p className="mt-0.5 text-base font-bold">
                {student.lastOrderAt ? longDate(student.lastOrderAt) : "—"}
              </p>
            </div>
          </div>
        </Card>

        {/* チャット導線 */}
        <Link
          href={messageHref}
          className="flex w-full items-center justify-center gap-2 rounded-sm bg-brand py-3.5 text-sm font-bold text-white transition-colors active:bg-brand-dark"
        >
          <Icon name="chat" className="h-4.5 w-4.5" />
          メッセージを送る
        </Link>

        {/* 購入履歴 */}
        <section>
          <SectionTitle title={`購入履歴 (${studentOrders.length}件)`} />
          {studentOrders.length === 0 ? (
            <Card>
              <EmptyState
                icon="package"
                title="まだ注文がありません"
                description="おすすめの商品をメッセージで紹介してみましょう"
              />
            </Card>
          ) : (
            <div className="space-y-2">
              {studentOrders.map((order) => (
                <Card key={order.id} className="p-4">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs text-ink/40">
                      {longDate(order.orderedAt)}・注文 #{order.id}
                    </span>
                    <Badge tone={ORDER_TONES[order.status]}>
                      {ORDER_STATUS_LABELS[order.status]}
                    </Badge>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {order.items.map((item) => (
                      <li
                        key={item.productId}
                        className="flex items-center justify-between gap-2 text-sm"
                      >
                        <span className="min-w-0 truncate">
                          {item.productName}
                          <span className="ml-1 text-xs text-ink/40">
                            ×{item.quantity}
                          </span>
                        </span>
                        <span className="shrink-0 text-ink/70">
                          {formatYen(item.unitPrice * item.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 flex items-center justify-between border-t border-ink/8 pt-2">
                    <span className="text-xs text-ink/55">合計</span>
                    <span className="text-sm font-bold text-brand">
                      {formatYen(order.total)}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
