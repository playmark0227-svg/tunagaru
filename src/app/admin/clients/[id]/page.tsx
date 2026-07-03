import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  applications,
  clients,
  orders,
  projects,
} from "@/lib/mock-data";
import {
  APPLICATION_STATUS_LABELS,
  CLIENT_STATUS_LABELS,
  ORDER_STATUS_LABELS,
  type ApplicationStatus,
  type ClientStatus,
  type OrderStatus,
} from "@/lib/types";
import { formatYen } from "@/lib/format";
import {
  Avatar,
  Badge,
  Card,
  EmptyState,
  SectionTitle,
  type BadgeTone,
} from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdminHeader } from "../../header";

export const metadata: Metadata = { title: "顧客詳細" };

export function generateStaticParams() {
  return clients.map((c) => ({ id: c.id }));
}

const statusTone: Record<ClientStatus, BadgeTone> = {
  active: "green",
  trial: "amber",
  suspended: "gray",
};

const appTone: Record<ApplicationStatus, BadgeTone> = {
  applied: "blue",
  accepted: "green",
  rejected: "gray",
};

const orderTone: Record<OrderStatus, BadgeTone> = {
  received: "amber",
  ordered_to_hq: "blue",
  shipped: "violet",
  completed: "green",
};

/** クライアント → 本部チャットスレッドの対応 (モック) */
const threadByClient: Record<string, string> = {
  c1: "th1",
  c2: "th2",
  c3: "th7",
  c4: "th3",
};

/** "2026-07-04" → "2026/7/4" */
function ymd(date: string): string {
  const [y, m, d] = date.split("-");
  return `${y}/${Number(m)}/${Number(d)}`;
}

export default async function AdminClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = clients.find((c) => c.id === id);
  if (!client) notFound();

  const clientApplications = applications
    .filter((a) => a.clientId === client.id)
    .map((a) => ({
      ...a,
      project: projects.find((p) => p.id === a.projectId),
    }));
  const clientOrders = orders.filter((o) => o.clientId === client.id);
  const threadId = threadByClient[client.id];

  return (
    <>
      <AdminHeader title={client.name} backHref="/admin/clients" />

      <main className="mx-auto max-w-md space-y-6 px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        {/* プロフィール */}
        <Card className="p-5">
          <div className="flex items-center gap-4">
            <Avatar name={client.name} color={client.avatarColor} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold leading-tight">{client.name}</p>
              <p className="mt-0.5 text-sm text-ink/55">
                {client.ownerName} 様・{client.category}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                <Badge tone={statusTone[client.status]}>
                  {CLIENT_STATUS_LABELS[client.status]}
                </Badge>
                <Badge tone="violet">{client.plan}プラン</Badge>
              </div>
            </div>
          </div>

          {/* チャット導線 */}
          <Link
            href={threadId ? `/admin/messages/${threadId}` : "/admin/messages"}
            className="mt-4 flex items-center justify-center gap-2 rounded-none bg-aqua px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors hover:bg-indigo-600"
          >
            <Icon name="chat" className="h-4.5 w-4.5" />
            チャットで連絡する
          </Link>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* 契約情報 */}
          <section>
            <SectionTitle title="契約情報" />
            <Card className="divide-y divide-ink/8 text-sm">
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-ink/55">契約プラン</span>
                <span className="font-semibold">{client.plan}</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-ink/55">契約状態</span>
                <Badge tone={statusTone[client.status]}>
                  {CLIENT_STATUS_LABELS[client.status]}
                </Badge>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-ink/55">生徒数</span>
                <span className="font-semibold">{client.studentCount}名</span>
              </div>
              <div className="flex items-center justify-between px-4 py-3">
                <span className="text-ink/55">利用開始日</span>
                <span className="font-semibold">{ymd(client.joinedAt)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 px-4 py-3">
                <span className="shrink-0 text-ink/55">保守サイト</span>
                {client.siteUrl ? (
                  <span className="truncate text-xs font-medium text-aqua">
                    {client.siteUrl}
                  </span>
                ) : (
                  <span className="text-xs text-ink/40">なし</span>
                )}
              </div>
            </Card>
          </section>

          {/* 応募中案件 */}
          <section>
            <SectionTitle
              title="応募中の案件"
              action={{ href: "/admin/projects", label: "案件管理へ" }}
            />
            {clientApplications.length === 0 ? (
              <Card>
                <EmptyState
                  icon="briefcase"
                  title="応募中の案件はありません"
                />
              </Card>
            ) : (
              <Card className="divide-y divide-ink/8">
                {clientApplications.map((a) => (
                  <Link
                    key={a.id}
                    href={`/admin/projects/${a.projectId}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream"
                  >
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {a.project?.title ?? "案件"}
                      </span>
                      <span className="block text-xs text-ink/40">
                        {ymd(a.appliedAt)} 応募
                        {a.note ? `・${a.note}` : ""}
                      </span>
                    </span>
                    <Badge tone={appTone[a.status]}>
                      {APPLICATION_STATUS_LABELS[a.status]}
                    </Badge>
                    <Icon
                      name="chevron-right"
                      className="h-4 w-4 shrink-0 text-ink/25"
                    />
                  </Link>
                ))}
              </Card>
            )}
          </section>
        </div>

        {/* 最近の注文 */}
        <section>
          <SectionTitle
            title="最近の注文"
            action={{ href: "/admin/orders", label: "受注・発注へ" }}
          />
          {clientOrders.length === 0 ? (
            <Card>
              <EmptyState icon="package" title="注文はまだありません" />
            </Card>
          ) : (
            <Card className="divide-y divide-ink/8">
              {clientOrders.map((o) => (
                <Link
                  key={o.id}
                  href="/admin/orders"
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-ink/5 text-ink/55">
                    <Icon name="package" className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">
                      #{o.id}{" "}
                      {o.endUserName ? `${o.endUserName} 様` : "教室仕入れ"}
                    </span>
                    <span className="block text-xs text-ink/40">
                      {ymd(o.orderedAt)}・{o.items.length}点・
                      {formatYen(o.total)}
                    </span>
                  </span>
                  <Badge tone={orderTone[o.status]}>
                    {ORDER_STATUS_LABELS[o.status]}
                  </Badge>
                </Link>
              ))}
            </Card>
          )}
        </section>
      </main>
    </>
  );
}
