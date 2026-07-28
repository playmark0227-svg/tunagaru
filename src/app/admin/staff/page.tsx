import type { Metadata } from "next";
import Link from "next/link";
import { formatMd } from "@/lib/format";
import { projects, workers, workerTasks } from "@/lib/mock-data";
import {
  Avatar,
  Badge,
  Card,
  EmptyState,
  SectionTitle,
  StatCard,
  type BadgeTone,
} from "@/components/ui";
import { Icon } from "@/components/icons";
import {
  PROJECT_STATUS_LABELS,
  TASK_STATUS_LABELS,
  type ProjectStatus,
  type TaskStatus,
} from "@/lib/types";
import { AdminHeader } from "../header";

export const metadata: Metadata = { title: "担当一覧" };

const TASK_STATUS_TONES: Record<TaskStatus, BadgeTone> = {
  todo: "gray",
  in_progress: "blue",
  review: "amber",
  done: "green",
};

const PROJECT_STATUS_TONES: Record<ProjectStatus, BadgeTone> = {
  open: "brand",
  in_progress: "blue",
  done: "green",
};

export default function AdminStaffPage() {
  // 完了を除く稼働中タスク
  const activeTasks = workerTasks.filter((t) => t.status !== "done");

  // 作業者向け募集案件 (案件 × 担当マッピング用)
  const workerProjects = projects.filter((p) => p.forWorkers);

  // 応募受付中の作業者数 (延べ)
  const totalApplicants = workerProjects.reduce(
    (sum, p) => sum + (p.applicantWorkerIds?.length ?? 0),
    0,
  );

  return (
    <>
      <AdminHeader title="担当一覧" />

      <main className="mx-auto max-w-md space-y-6 px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        {/* 概要 */}
        <div>
          <p className="text-lg font-bold">担当一覧 🧑‍🎨</p>
          <p className="mt-0.5 text-xs leading-relaxed text-ink/55">
            誰が・どの案件を・どこまで進めているか。作業者(クリエイター)の稼働状況を一覧で把握できます。
          </p>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard
            label="作業者"
            value={`${workers.length}名`}
            icon="users"
            tone="brand"
          />
          <StatCard
            label="稼働中タスク"
            value={`${activeTasks.length}件`}
            sub="完了を除く"
            icon="clipboard"
            tone="blue"
          />
          <StatCard
            label="募集応募"
            value={`${totalApplicants}名`}
            sub={`${workerProjects.length}件の募集`}
            icon="sparkles"
            tone="amber"
          />
        </div>

        {/* 作業者ごとの担当状況 */}
        <section>
          <SectionTitle title="作業者ごとの担当状況" />
          <div className="stagger space-y-3">
            {workers.map((w) => {
              const myTasks = activeTasks.filter((t) => t.workerId === w.id);
              // 担当中の案件 (タスクが紐づく案件を重複排除)
              const assignedProjectIds = Array.from(
                new Set(
                  workerTasks
                    .filter((t) => t.workerId === w.id && t.projectId)
                    .map((t) => t.projectId as string),
                ),
              );
              const assignedProjects = assignedProjectIds
                .map((id) => projects.find((p) => p.id === id))
                .filter((p): p is (typeof projects)[number] => Boolean(p));
              // 募集に応募中の案件
              const appliedProjects = workerProjects.filter((p) =>
                p.applicantWorkerIds?.includes(w.id),
              );

              return (
                <Card key={w.id} className="p-4">
                  {/* 見出し: 氏名・得意分野 */}
                  <div className="flex items-start gap-3">
                    <Avatar name={w.name} color={w.avatarColor} size="md" />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold">{w.name}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {w.specialties.map((s) => (
                          <Badge key={s} tone="violet">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="font-display text-lg font-bold leading-none text-aqua">
                        {w.completedCount}
                      </p>
                      <p className="mt-0.5 text-[10px] text-ink/45">完了案件</p>
                    </div>
                  </div>

                  {/* 稼働中タスク */}
                  <div className="mt-3 border-t border-ink/8 pt-3">
                    <p className="mb-2 flex items-center gap-1.5 text-[11px] font-bold tracking-wide text-ink/55">
                      <Icon name="clipboard" className="h-3.5 w-3.5" />
                      稼働中タスク ({myTasks.length})
                    </p>
                    {myTasks.length === 0 ? (
                      <p className="rounded-sm bg-cream px-3 py-2 text-[11px] text-ink/45">
                        現在アサイン中のタスクはありません
                      </p>
                    ) : (
                      <ul className="space-y-1.5">
                        {myTasks.map((t) => {
                          const proj = projects.find(
                            (p) => p.id === t.projectId,
                          );
                          return (
                            <li
                              key={t.id}
                              className="flex items-center gap-2 rounded-sm bg-cream px-3 py-2"
                            >
                              <Badge tone={TASK_STATUS_TONES[t.status]}>
                                {TASK_STATUS_LABELS[t.status]}
                              </Badge>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-xs font-semibold">
                                  {t.title}
                                </span>
                                <span className="block truncate text-[10px] text-ink/45">
                                  {proj ? `${proj.title}・` : ""}期限{" "}
                                  {formatMd(t.dueDate)}
                                </span>
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* 担当・応募中の案件 */}
                  {(assignedProjects.length > 0 ||
                    appliedProjects.length > 0) && (
                    <div className="mt-3 flex flex-wrap items-center gap-1.5 border-t border-ink/8 pt-3">
                      {assignedProjects.map((p) => (
                        <Link
                          key={p.id}
                          href={`/admin/projects/${p.id}`}
                          className="inline-flex items-center gap-1 rounded-sm border border-ink/12 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-ink/70 transition-colors hover:border-aqua hover:text-aqua"
                        >
                          <span>{p.emoji}</span>
                          <span className="max-w-[9rem] truncate">
                            {p.title}
                          </span>
                        </Link>
                      ))}
                      {appliedProjects.map((p) => (
                        <Link
                          key={p.id}
                          href={`/admin/projects/${p.id}`}
                          className="inline-flex items-center gap-1 rounded-sm border border-dashed border-ink/20 px-1.5 py-0.5 text-[10px] font-semibold text-ink/55 transition-colors hover:border-aqua hover:text-aqua"
                        >
                          <Icon name="sparkles" className="h-3 w-3" />
                          <span className="max-w-[9rem] truncate">
                            応募中: {p.title}
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </section>

        {/* 案件 × 担当 (募集案件のアサイン状況) */}
        <section>
          <SectionTitle
            title="募集案件のアサイン状況"
            action={{ href: "/admin/projects", label: "案件管理へ" }}
          />
          {workerProjects.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="作業者向けの募集はありません"
              description="案件管理から作業者(クリエイター)向けの募集を作成できます"
            />
          ) : (
            <Card className="divide-y divide-ink/8">
              {workerProjects.map((p) => {
                const applicants = (p.applicantWorkerIds ?? [])
                  .map((id) => workers.find((w) => w.id === id))
                  .filter((w): w is (typeof workers)[number] => Boolean(w));
                return (
                  <Link
                    key={p.id}
                    href={`/admin/projects/${p.id}`}
                    className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-ink/12 bg-cream text-xl">
                      {p.emoji}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-1.5">
                        <Badge tone={PROJECT_STATUS_TONES[p.status]}>
                          {PROJECT_STATUS_LABELS[p.status]}
                        </Badge>
                        <span className="text-[10px] text-ink/45">
                          {p.category}
                        </span>
                      </span>
                      <span className="mt-1 block truncate text-sm font-semibold">
                        {p.title}
                      </span>
                    </span>
                    <span className="flex shrink-0 flex-col items-end gap-1">
                      {applicants.length > 0 ? (
                        <span className="flex -space-x-1.5">
                          {applicants.map((w) => (
                            <Avatar
                              key={w.id}
                              name={w.name}
                              color={w.avatarColor}
                              size="sm"
                            />
                          ))}
                        </span>
                      ) : (
                        <span className="rounded-sm bg-ink/5 px-2 py-0.5 text-[10px] font-semibold text-ink/45">
                          応募なし
                        </span>
                      )}
                      <span className="text-[10px] text-ink/40">
                        応募 {applicants.length}名
                      </span>
                    </span>
                  </Link>
                );
              })}
            </Card>
          )}
        </section>

        <p className="text-center text-[11px] leading-relaxed text-ink/40">
          作業者・タスク・案件はすべてサンプルデータです (プロトタイプ版)
        </p>
      </main>
    </>
  );
}
