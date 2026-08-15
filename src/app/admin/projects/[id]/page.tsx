import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { applications, clients, projects, tasks } from "@/lib/mock-data";
import { PROJECT_STATUS_LABELS, TASK_STATUS_LABELS,
  projectMargin,
  projectMarginRate,
} from "@/lib/types";
import { formatYen, formatDate } from "@/lib/format";
import { Badge, Card, EmptyState, SectionTitle } from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdminHeader } from "../../header";
import { Applicants, type ApplicantInfo } from "./applicants";
import { PROJECT_STATUS_TONES, TASK_STATUS_TONES } from "@/lib/tones";

export const metadata: Metadata = { title: "案件詳細" };

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

/** "2026-07-20" → "2026/7/20" */
export default async function AdminProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  // 応募クライアント (応募レコードがない applicantIds は「応募中」として扱う)
  const applicants: ApplicantInfo[] = project.applicantIds.flatMap((cid) => {
    const client = clients.find((c) => c.id === cid);
    if (!client) return [];
    const app = applications.find(
      (a) => a.projectId === project.id && a.clientId === cid,
    );
    return [
      {
        clientId: client.id,
        name: client.name,
        ownerName: client.ownerName,
        category: client.category,
        avatarColor: client.avatarColor,
        status: app?.status ?? "applied",
        appliedAt: app?.appliedAt ?? project.createdAt,
        note: app?.note,
      },
    ];
  });

  const relatedTasks = tasks.filter((t) => t.projectId === project.id);

  return (
    <>
      <AdminHeader title="案件詳細" backHref="/admin/projects" />

      <main className="mx-auto max-w-md space-y-6 px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        {/* 案件情報 */}
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={PROJECT_STATUS_TONES[project.status]}>
              {PROJECT_STATUS_LABELS[project.status]}
            </Badge>
            <Badge tone="violet">{project.category}</Badge>
          </div>
          <h2 className="mt-2 text-lg font-bold leading-snug">
            {project.title}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-ink/70">
            {project.description}
          </p>
          {/* 本部だけが両方の金額とマージンを見られる。
              作業者側 (/member/projects) には workerPrice しか渡していない。 */}
          <div className="mt-4 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-sm border border-ink/10 bg-white px-2 py-2.5">
              <p className="text-[10px] font-medium text-ink/40">顧客への提示額</p>
              <p className="mt-0.5 text-sm font-bold">
                {formatYen(project.clientPrice)}
              </p>
            </div>
            <div className="rounded-sm border border-ink/10 bg-white px-2 py-2.5">
              <p className="text-[10px] font-medium text-ink/40">作業者への支払</p>
              <p className="mt-0.5 text-sm font-bold text-ink/70">
                {formatYen(project.workerPrice)}
              </p>
            </div>
            <div className="rounded-sm border border-aqua/40 bg-aqua-soft px-2 py-2.5">
              <p className="text-[10px] font-medium text-aqua">本部マージン</p>
              <p className="mt-0.5 text-sm font-bold text-aqua">
                {formatYen(projectMargin(project))}
              </p>
              <p className="text-[9px] text-ink/45">
                {projectMarginRate(project)}%
              </p>
            </div>
          </div>
          <p className="mt-1.5 text-[10px] leading-relaxed text-ink/40">
            ※ マージンは本部のみ表示。作業者の画面には支払額しか表示されません。
          </p>
          <div className="mt-3 grid grid-cols-2 gap-2 text-center">
            <div className="rounded-sm bg-cream px-2 py-2.5">
              <p className="text-[10px] font-medium text-ink/40">応募締切</p>
              <p className="mt-0.5 text-sm font-bold">{formatDate(project.deadline)}</p>
            </div>
            <div className="rounded-sm bg-cream px-2 py-2.5">
              <p className="text-[10px] font-medium text-ink/40">公開日</p>
              <p className="mt-0.5 text-sm font-bold">{formatDate(project.createdAt)}</p>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 [&>*]:min-w-0">
          {/* 応募クライアント */}
          <section>
            <SectionTitle title={`応募クライアント (${applicants.length})`} />
            {applicants.length === 0 ? (
              <Card>
                <EmptyState
                  icon="users"
                  title="まだ応募はありません"
                  description="一斉通知で案件をお知らせすると応募が集まりやすくなります"
                />
              </Card>
            ) : (
              <Applicants initial={applicants} />
            )}
          </section>

          {/* 関連タスク */}
          <section>
            <SectionTitle title={`関連タスクの進捗 (${relatedTasks.length})`} />
            {relatedTasks.length === 0 ? (
              <Card>
                <EmptyState
                  icon="clipboard"
                  title="タスクはまだありません"
                  description="採用が決まるとタスクが作成されます"
                />
              </Card>
            ) : (
              <Card className="divide-y divide-ink/8">
                {relatedTasks.map((t) => (
                  <div key={t.id} className="flex items-start gap-3 px-4 py-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-aqua-soft text-aqua">
                      <Icon
                        name={
                          t.kind === "Zoom予約"
                            ? "video"
                            : t.kind === "修正依頼"
                              ? "pencil"
                              : t.kind === "素材提出"
                                ? "package"
                                : "clipboard"
                        }
                        className="h-4 w-4"
                      />
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold leading-snug">
                        {t.title}
                      </p>
                      <p className="mt-0.5 text-xs text-ink/40">
                        {t.kind}・担当: {t.assignee}・期限 {formatDate(t.dueDate)}
                      </p>
                      {t.note && (
                        <p className="mt-1 rounded-sm bg-cream px-2.5 py-1.5 text-xs leading-relaxed text-ink/55">
                          {t.note}
                        </p>
                      )}
                    </div>
                    <Badge tone={TASK_STATUS_TONES[t.status]}>
                      {TASK_STATUS_LABELS[t.status]}
                    </Badge>
                  </div>
                ))}
              </Card>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
