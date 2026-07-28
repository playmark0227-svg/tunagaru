import Link from "next/link";
import { formatMd } from "@/lib/format";
import { Icon } from "@/components/icons";
import {
  Badge,
  Card,
  EmptyState,
  PageHeader,
  SectionTitle,
  type BadgeTone,
} from "@/components/ui";
import { currentClient, projects, tasks } from "@/lib/mock-data";
import {
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
} from "@/lib/types";

export const metadata = { title: "タスク管理" };

const STATUS_ORDER: TaskStatus[] = ["todo", "in_progress", "review", "done"];

const STATUS_TONES: Record<TaskStatus, BadgeTone> = {
  todo: "gray",
  in_progress: "blue",
  review: "amber",
  done: "green",
};

const KIND_TONES: Record<Task["kind"], BadgeTone> = {
  修正依頼: "red",
  Zoom予約: "blue",
  素材提出: "violet",
  確認: "amber",
  発送: "green",
  その他: "gray",
};

function TaskCard({ task }: { task: Task }) {
  const project = task.projectId
    ? projects.find((p) => p.id === task.projectId)
    : undefined;
  return (
    <Card className={`p-4 ${task.status === "done" ? "opacity-70" : ""}`}>
      <div className="flex flex-wrap items-center gap-1.5">
        <Badge tone={KIND_TONES[task.kind]}>{task.kind}</Badge>
        <Badge tone={STATUS_TONES[task.status]}>
          {TASK_STATUS_LABELS[task.status]}
        </Badge>
        <span className="ml-auto text-xs font-bold text-brand-dark">
          期限 {formatMd(task.dueDate)}
        </span>
      </div>
      <p className="mt-2 text-sm font-bold leading-snug">{task.title}</p>
      {task.note && (
        <p className="mt-1 text-xs leading-relaxed text-ink/55">
          {task.note}
        </p>
      )}
      <div className="mt-2 flex items-center gap-2 text-[10px] text-ink/40">
        <span>担当: {task.assignee}</span>
        {project && <span className="truncate">案件: {project.title}</span>}
      </div>
      {task.kind === "Zoom予約" && task.status !== "done" && (
        <Link
          href="/client/booking"
          className="mt-3 flex items-center justify-center gap-1.5 rounded-sm bg-brand-soft py-2.5 text-xs font-bold text-brand-dark transition-colors active:bg-brand-soft/70"
        >
          <Icon name="video" className="h-4 w-4" />
          空き枠からZoomを予約する
          <Icon name="chevron-right" className="h-3.5 w-3.5" />
        </Link>
      )}
    </Card>
  );
}

export default function ClientTasksPage() {
  const myTasks = tasks.filter((t) => t.clientId === currentClient.id);

  return (
    <>
      <PageHeader title="タスク" />
      <main className="space-y-6 px-4 pb-24 pt-4">
        {/* ステータスの概況 */}
        <div className="grid grid-cols-4 gap-2">
          {STATUS_ORDER.map((status) => (
            <Card key={status} className="p-2 text-center">
              <p
                className={`text-lg font-bold ${
                  status === "done" ? "text-emerald-600" : "text-ink/80"
                }`}
              >
                {myTasks.filter((t) => t.status === status).length}
              </p>
              <p className="text-[10px] text-ink/55">
                {TASK_STATUS_LABELS[status]}
              </p>
            </Card>
          ))}
        </div>

        {myTasks.length === 0 ? (
          <EmptyState
            icon="clipboard"
            title="タスクはありません"
            description="案件が始まると、ここで進捗を共有できます"
          />
        ) : (
          /* 案件ごとにタスクを整理 (種別はカテゴリバッジで明示) */
          (() => {
            const projectIds = Array.from(
              new Set(myTasks.map((t) => t.projectId ?? "none")),
            );
            return projectIds.map((pid) => {
              const project = projects.find((p) => p.id === pid);
              const items = myTasks
                .filter((t) => (t.projectId ?? "none") === pid)
                .sort(
                  (a, b) =>
                    STATUS_ORDER.indexOf(a.status) -
                    STATUS_ORDER.indexOf(b.status),
                );
              const doneCount = items.filter(
                (t) => t.status === "done",
              ).length;
              return (
                <section key={pid}>
                  {project ? (
                    <div className="mb-2 flex items-center gap-2">
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br text-base ${project.gradient}`}
                      >
                        {project.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-ink/80">
                          {project.title}
                        </p>
                      </div>
                      <Badge tone="brand">{project.category}</Badge>
                      <span className="shrink-0 text-[10px] text-ink/40">
                        {doneCount}/{items.length}
                      </span>
                    </div>
                  ) : (
                    <SectionTitle title={`その他 (${items.length})`} />
                  )}
                  <div className="space-y-2">
                    {items.map((t) => (
                      <TaskCard key={t.id} task={t} />
                    ))}
                  </div>
                </section>
              );
            });
          })()
        )}

        <Card className="sticker-glow flex gap-3 p-4">
          <span className="text-xl">📋</span>
          <p className="text-xs leading-relaxed text-ink/70">
            チャットで届いた依頼は、メッセージ横の
            <span className="font-bold text-brand">タスク化ボタン</span>
            でそのままここに追加できます。転記忘れがなくなります。
          </p>
        </Card>
      </main>
    </>
  );
}
