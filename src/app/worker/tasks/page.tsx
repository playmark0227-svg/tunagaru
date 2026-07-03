import Link from "next/link";
import { Icon } from "@/components/icons";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import { projects, workerTasks } from "@/lib/mock-data";
import {
  TASK_SOURCE_LABELS,
  TASK_STATUS_LABELS,
  type Task,
  type TaskStatus,
} from "@/lib/types";

export const metadata = { title: "担当タスク" };

/**
 * 担当タスク — 「案件種別ごとに整理されたタスク画面」
 * 案件(プロジェクト)単位でグルーピングし、カテゴリバッジで種別を明示。
 * チャット/AI/EC など発生源も表示し、転記忘れゼロの運用を可視化する。
 */

const statusTone: Record<TaskStatus, "amber" | "blue" | "violet" | "green"> = {
  todo: "amber",
  in_progress: "blue",
  review: "violet",
  done: "green",
};

const statusOrder: TaskStatus[] = ["todo", "in_progress", "review", "done"];

function TaskRow({ task }: { task: Task }) {
  return (
    <li className="px-4 py-3">
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-semibold leading-snug ${
              task.status === "done" ? "text-ink/40 line-through" : ""
            }`}
          >
            {task.title}
          </p>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] text-ink/40">
            <span className="flex items-center gap-1">
              <Icon name="calendar" className="h-3.5 w-3.5" />
              {task.dueDate} まで
            </span>
            {task.source && task.source !== "manual" && (
              <span
                className={`rounded-sm px-1.5 py-0.5 text-[10px] font-bold ${
                  task.source === "ai"
                    ? "bg-violet-50 text-violet-600"
                    : task.source === "chat"
                      ? "bg-sky-50 text-sky-600"
                      : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {TASK_SOURCE_LABELS[task.source]}
                {task.source === "ai" && " (Phase 3)"}
              </span>
            )}
          </p>
          {task.note && (
            <p className="mt-1 text-[11px] leading-relaxed text-ink/55">
              {task.note}
            </p>
          )}
        </div>
        <Badge tone={statusTone[task.status]}>
          {TASK_STATUS_LABELS[task.status]}
        </Badge>
      </div>
    </li>
  );
}

export default function WorkerTasksPage() {
  // 案件ごとにグルーピング
  const projectIds = Array.from(
    new Set(workerTasks.map((t) => t.projectId).filter(Boolean)),
  ) as string[];

  return (
    <>
      <PageHeader title="担当タスク" />
      <main className="space-y-4 px-4 pb-24 pt-4">
        <p className="text-xs leading-relaxed text-ink/55">
          担当中の案件ごとにタスクを整理しています。チャットの依頼は
          <span className="font-bold text-brand">📋タスク化ボタン</span>
          でそのままここに追加されます。
        </p>

        {projectIds.length === 0 && (
          <EmptyState
            icon="clipboard"
            title="担当中のタスクはありません"
            description="案件フィードから応募して、最初の案件を始めましょう"
          />
        )}

        {projectIds.map((pid) => {
          const project = projects.find((p) => p.id === pid);
          if (!project) return null;
          const list = workerTasks
            .filter((t) => t.projectId === pid)
            .sort(
              (a, b) =>
                statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status),
            );
          const doneCount = list.filter((t) => t.status === "done").length;
          return (
            <Card key={pid} className="overflow-hidden">
              {/* 案件ヘッダー */}
              <Link
                href={`/worker/projects/${pid}`}
                className="flex items-center gap-3 border-b border-ink/8 bg-cream/70 px-4 py-3 active:bg-ink/5"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br text-xl ${project.gradient}`}
                >
                  {project.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{project.title}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <Badge tone="brand">{project.category}</Badge>
                    <span className="text-[10px] text-ink/40">
                      {doneCount}/{list.length} 完了
                    </span>
                  </div>
                </div>
                <Icon
                  name="chevron-right"
                  className="h-4 w-4 shrink-0 text-ink/25"
                />
              </Link>
              <ul className="divide-y divide-ink/8">
                {list.map((t) => (
                  <TaskRow key={t.id} task={t} />
                ))}
              </ul>
            </Card>
          );
        })}

        <Card className="sticker-glow flex gap-3 p-4">
          <span className="text-xl">🤖</span>
          <p className="text-xs leading-relaxed text-ink/70">
            <span className="font-bold text-aqua">AIアシスタント (Phase 3)</span>
            : チャットの会話からタスク候補を自動抽出し、毎朝「未完了事項レポート」をお届けする予定です。
          </p>
        </Card>
      </main>
    </>
  );
}
