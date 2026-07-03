import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import { Badge, Card, SectionTitle, type BadgeTone } from "@/components/ui";
import { formatYen } from "@/lib/format";
import {
  announcements,
  applications,
  currentClient,
  projects,
  tasks,
} from "@/lib/mock-data";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  type Task,
} from "@/lib/types";

export const metadata = { title: "ホーム" };

/** "2026-07-01 10:00" / "2026-07-04" → "7/1" */
function shortDate(value: string): string {
  const [, m, d] = value.split(" ")[0].split("-");
  return `${Number(m)}/${Number(d)}`;
}

const quickActions: {
  href: string;
  icon: IconName;
  label: string;
  sub: string;
}[] = [
  { href: "/client/booking", icon: "video", label: "Zoom予約", sub: "空き枠から選ぶ" },
  { href: "/client/messages/th1", icon: "chat", label: "本部に相談", sub: "チャットで気軽に" },
  { href: "/client/shop", icon: "store", label: "仕入れ", sub: "卸価格カタログ" },
];

const KIND_TONES: Record<Task["kind"], BadgeTone> = {
  修正依頼: "red",
  Zoom予約: "blue",
  素材提出: "violet",
  確認: "amber",
  発送: "green",
  その他: "gray",
};

const APP_TONES: Record<ApplicationStatus, BadgeTone> = {
  applied: "blue",
  accepted: "green",
  rejected: "gray",
};

export default function ClientHomePage() {
  const upcomingTasks = tasks
    .filter((t) => t.clientId === currentClient.id && t.status !== "done")
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 3);

  const myApplications = applications
    .filter((a) => a.clientId === currentClient.id)
    .map((a) => ({
      app: a,
      project: projects.find((p) => p.id === a.projectId),
    }));

  return (
    <main className="pb-24">
      {/* あいさつ */}
      <header className="px-5 pb-2 pt-8">
        <p className="text-xs font-medium text-stone-400">
          {currentClient.name}|{currentClient.category}
        </p>
        <h1 className="mt-1 text-xl font-bold tracking-tight">
          こんにちは、佐藤さん🌸
        </h1>
      </header>

      <div className="space-y-6 px-4 pt-3">
        {/* クイックアクション */}
        <div className="grid grid-cols-3 gap-2">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="flex flex-col items-center gap-1.5 rounded-none border border-stone-200/70 bg-white p-3 shadow-sm transition-colors active:bg-stone-50"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-none bg-brand-soft text-brand">
                <Icon name={action.icon} className="h-5 w-5" />
              </span>
              <span className="text-xs font-bold">{action.label}</span>
              <span className="text-[10px] text-stone-400">{action.sub}</span>
            </Link>
          ))}
        </div>

        {/* 本部からのお知らせ */}
        <section>
          <SectionTitle title="本部からのお知らせ" />
          <div className="space-y-2">
            {announcements.slice(0, 2).map((a) => (
              <Card key={a.id} className="flex gap-3 p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-sm bg-brand-soft text-lg">
                  📢
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold leading-snug">{a.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">
                    {a.body}
                  </p>
                  <p className="mt-1.5 text-[10px] text-stone-400">
                    {shortDate(a.sentAt)} 配信
                  </p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* 期限が近いタスク */}
        <section>
          <SectionTitle
            title="期限が近いタスク"
            action={{ href: "/client/tasks", label: "すべて見る" }}
          />
          <Card className="divide-y divide-stone-100">
            {upcomingTasks.map((t) => (
              <Link
                key={t.id}
                href="/client/tasks"
                className="flex items-center gap-3 px-4 py-3 transition-colors active:bg-stone-50"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <Badge tone={KIND_TONES[t.kind]}>{t.kind}</Badge>
                  </div>
                  <p className="mt-1 truncate text-sm font-semibold">
                    {t.title}
                  </p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-bold text-brand-dark">
                    {shortDate(t.dueDate)}
                  </p>
                  <p className="text-[10px] text-stone-400">期限</p>
                </div>
                <Icon
                  name="chevron-right"
                  className="h-4 w-4 shrink-0 text-stone-300"
                />
              </Link>
            ))}
          </Card>
        </section>

        {/* 応募中案件のステータス */}
        <section>
          <SectionTitle
            title="応募中の案件"
            action={{ href: "/client/projects", label: "案件一覧へ" }}
          />
          <div className="space-y-2">
            {myApplications.map(({ app, project }) =>
              project ? (
                <Card key={app.id}>
                  <Link
                    href={`/client/projects/${project.id}`}
                    className="block p-4 transition-colors active:bg-stone-50"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <Badge tone={APP_TONES[app.status]}>
                        {APPLICATION_STATUS_LABELS[app.status]}
                      </Badge>
                      <span className="text-[10px] text-stone-400">
                        {shortDate(app.appliedAt)} 応募
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-bold leading-snug">
                      {project.title}
                    </p>
                    <p className="mt-1 text-xs text-stone-500">
                      報酬{" "}
                      <span className="font-bold text-brand">
                        {formatYen(project.budget)}
                      </span>
                      {" ・ "}
                      {project.category}
                    </p>
                  </Link>
                </Card>
              ) : null,
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
