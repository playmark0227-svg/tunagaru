import { notFound } from "next/navigation";
import { Icon } from "@/components/icons";
import { Avatar, Badge, Card, PageHeader } from "@/components/ui";
import { formatYen, formatMd, formatDate } from "@/lib/format";
import { currentMember, projects, memberTasks } from "@/lib/mock-data";
import { PROJECT_STATUS_LABELS, TASK_STATUS_LABELS } from "@/lib/types";
import { WorkerApplyButton } from "./apply-button";

export const metadata = { title: "案件詳細" };

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

export default async function WorkerProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const isRecruiting = project.status === "open";
  const alreadyApplied =
    project.applicantWorkerIds?.includes(currentMember.id) ?? false;
  const myTasks = memberTasks.filter((t) => t.projectId === project.id);

  return (
    <>
      <PageHeader title="案件詳細" backHref="/member" />
      <main className={isRecruiting ? "pb-36" : "pb-24"}>
        {/* カバー */}
        <div
          className={`relative flex h-48 items-center justify-center bg-gradient-to-br ${project.gradient}`}
        >
          <span className="text-7xl">{project.emoji}</span>
          <span className="absolute bottom-3 right-3 rounded-sm border border-ink/10 bg-white/95 px-3 py-1 text-xs font-bold text-brand shadow-sm">
            報酬 {formatYen(project.workerPrice)}
          </span>
        </div>

        <div className="space-y-4 px-4 pt-4">
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <Badge tone="brand">{project.category}</Badge>
              <Badge tone={project.status === "open" ? "green" : "gray"}>
                {PROJECT_STATUS_LABELS[project.status]}
              </Badge>
              <Badge tone="violet">スタッフ募集</Badge>
            </div>
            <h1 className="mt-2 text-lg font-bold leading-snug">
              {project.title}
            </h1>
          </div>

          <Card className="flex items-center gap-2.5 p-4">
            <Avatar name="繋がるクラフト" color="bg-brand" size="sm" />
            <div className="flex-1">
              <p className="text-xs font-bold">繋がるクラフト 本部</p>
              <p className="text-[10px] text-ink/40">
                {formatMd(project.createdAt)} 投稿
              </p>
            </div>
          </Card>

          <Card className="p-4">
            <p className="text-xs font-bold text-ink/55">募集内容</p>
            <p className="mt-2 text-sm leading-relaxed text-ink/80">
              {project.description}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink/8 pt-3">
              <div>
                <p className="text-[10px] text-ink/40">報酬</p>
                <p className="text-base font-bold text-brand">
                  {formatYen(project.workerPrice)}
                </p>
              </div>
              <div>
                <p className="text-[10px] text-ink/40">応募締切</p>
                <p className="text-base font-bold text-ink/80">
                  {formatDate(project.deadline)}
                </p>
              </div>
            </div>
          </Card>

          {/* 自分の担当タスク (アサイン済み案件の場合) */}
          {myTasks.length > 0 && (
            <Card className="p-4">
              <p className="flex items-center gap-1.5 text-xs font-bold text-ink/55">
                <Icon name="clipboard" className="h-4 w-4" />
                この案件のあなたのタスク
              </p>
              <ul className="mt-2 divide-y divide-ink/8">
                {myTasks.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 py-2.5">
                    <span className="min-w-0 flex-1 text-sm">{t.title}</span>
                    <Badge
                      tone={
                        t.status === "done"
                          ? "green"
                          : t.status === "review"
                            ? "violet"
                            : t.status === "in_progress"
                              ? "blue"
                              : "amber"
                      }
                    >
                      {TASK_STATUS_LABELS[t.status]}
                    </Badge>
                  </li>
                ))}
              </ul>
            </Card>
          )}

          {isRecruiting && (
            <Card className="flex gap-3 border-brand/20 bg-brand-soft/50 p-4">
              <span className="text-xl">💡</span>
              <p className="text-xs leading-relaxed text-ink/70">
                応募後、本部との専用チャットグループが作成され、
                やり取り・素材共有・タスク管理がこのアプリ内で完結します。
              </p>
            </Card>
          )}
        </div>
      </main>

      {isRecruiting && <WorkerApplyButton alreadyApplied={alreadyApplied} />}
    </>
  );
}
