import Link from "next/link";
import { Icon } from "@/components/icons";
import { Avatar, Card, PageHeader, SectionTitle } from "@/components/ui";
import { currentWorker, workerTasks } from "@/lib/mock-data";
import { WorkerPushToggle } from "./push-toggle";
import { formatDate } from "@/lib/format";

export const metadata = { title: "マイページ" };

export default function WorkerMyPage() {
  const activeTasks = workerTasks.filter((t) => t.status !== "done").length;

  return (
    <>
      <PageHeader title="マイページ" />
      <main className="space-y-5 px-4 pb-24 pt-4">
        {/* プロフィール */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Avatar
              name={currentWorker.name}
              color={currentWorker.avatarColor}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold">{currentWorker.name}</p>
              <p className="text-xs text-ink/55">
                作業者(クリエイター) / {formatDate(currentWorker.joinedAt)} 登録
              </p>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {currentWorker.specialties.map((s) => (
                  <span
                    key={s}
                    className="rounded-sm bg-brand-soft px-2 py-0.5 text-[10px] font-bold text-brand-dark"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-ink/8 pt-3">
            <div className="text-center">
              <p className="text-[10px] text-ink/40">完了した案件</p>
              <p className="text-base font-bold text-brand">
                {currentWorker.completedCount}件
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-ink/40">進行中のタスク</p>
              <p className="text-base font-bold text-ink/80">
                {activeTasks}件
              </p>
            </div>
          </div>
        </Card>

        {/* 通知設定 */}
        <section>
          <SectionTitle title="設定" />
          <WorkerPushToggle />
        </section>

        {/* ショートカット */}
        <Card className="divide-y divide-ink/8">
          <Link
            href="/worker"
            className="flex items-center gap-3 px-4 py-3.5 active:bg-cream"
          >
            <Icon name="sparkles" className="h-5 w-5 text-ink/40" />
            <span className="flex-1 text-sm font-semibold">
              案件フィードを見る
            </span>
            <Icon name="chevron-right" className="h-4 w-4 text-ink/25" />
          </Link>
          <Link
            href="/worker/tasks"
            className="flex items-center gap-3 px-4 py-3.5 active:bg-cream"
          >
            <Icon name="clipboard" className="h-5 w-5 text-ink/40" />
            <span className="flex-1 text-sm font-semibold">担当タスク</span>
            <Icon name="chevron-right" className="h-4 w-4 text-ink/25" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3.5 active:bg-cream"
          >
            <Icon name="logout" className="h-5 w-5 text-ink/40" />
            <span className="flex-1 text-sm font-semibold text-ink/70">
              エントランスへ戻る
            </span>
            <Icon name="chevron-right" className="h-4 w-4 text-ink/25" />
          </Link>
        </Card>

        <p className="pt-2 text-center text-[10px] text-ink/40">
          つながるCraft プロトタイプ版
        </p>
      </main>
    </>
  );
}
