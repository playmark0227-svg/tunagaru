import { notFound } from "next/navigation";
import {
  Badge,
  Card,
  PageHeader,
  ProgressSteps,
  SectionTitle,
  type BadgeTone,
} from "@/components/ui";
import { formatYen } from "@/lib/format";
import { applications, currentClient, projects } from "@/lib/mock-data";
import { PROJECT_STATUS_LABELS, type Project } from "@/lib/types";
import { ApplyButton } from "./apply-button";

export const metadata = { title: "案件詳細" };

export function generateStaticParams() {
  return projects.map((p) => ({ id: p.id }));
}

/** "2026-07-20" → "7/20" */
function shortDate(value: string): string {
  const [, m, d] = value.split("-");
  return `${Number(m)}/${Number(d)}`;
}

/** モックの「今日」(2026-07-03) からの残り日数 */
function daysUntil(dateStr: string): number {
  const today = new Date("2026-07-03T00:00:00+09:00").getTime();
  const target = new Date(`${dateStr}T00:00:00+09:00`).getTime();
  return Math.round((target - today) / 86400000);
}

const CATEGORY_TONES: Record<Project["category"], BadgeTone> = {
  HP制作: "blue",
  動画制作: "violet",
  キャンペーン: "brand",
  SNS運用: "green",
  EC構築: "amber",
  デザイン: "red",
};

const STATUS_TONES: Record<Project["status"], BadgeTone> = {
  open: "green",
  in_progress: "blue",
  done: "gray",
};

export default async function ClientProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);
  if (!project) notFound();

  const myApplication = applications.find(
    (a) => a.projectId === project.id && a.clientId === currentClient.id,
  );

  const stepIndex =
    myApplication?.status === "accepted"
      ? 2
      : myApplication
        ? 0
        : -1;

  return (
    <>
      <PageHeader title="案件詳細" backHref="/client/projects" />
      <main className="space-y-4 px-4 pb-24 pt-4">
        {/* 案件内容 */}
        <Card className="p-5">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge tone={CATEGORY_TONES[project.category]}>
              {project.category}
            </Badge>
            <Badge tone={STATUS_TONES[project.status]}>
              {PROJECT_STATUS_LABELS[project.status]}
            </Badge>
          </div>
          <h2 className="mt-3 text-lg font-bold leading-snug">
            {project.title}
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/70">
            {project.description}
          </p>
        </Card>

        {/* 条件 */}
        <Card className="divide-y divide-ink/8">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-ink/55">報酬(税込)</span>
            <span className="text-lg font-bold text-brand">
              {formatYen(project.budget)}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-ink/55">応募締切</span>
            <span className="text-sm font-semibold">
              {shortDate(project.deadline)}
              {project.status === "open" &&
                daysUntil(project.deadline) >= 0 && (
                  <span className="ml-1.5 text-xs font-bold text-brand-dark">
                    あと{daysUntil(project.deadline)}日
                  </span>
                )}
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-ink/55">応募状況</span>
            <span className="text-sm font-semibold">
              {project.applicantIds.length}教室が応募中
            </span>
          </div>
          <div className="flex items-center justify-between px-4 py-3">
            <span className="text-xs text-ink/55">掲載日</span>
            <span className="text-sm font-semibold">
              {shortDate(project.createdAt)}
            </span>
          </div>
        </Card>

        {/* 応募のながれ */}
        {(project.status === "open" || myApplication) && (
          <section>
            <SectionTitle title="応募のながれ" />
            <Card className="px-4 py-5">
              <ProgressSteps
                steps={["応募する", "本部から連絡", "採用・開始"]}
                currentIndex={stepIndex}
              />
              <p className="mt-3 text-center text-[11px] leading-relaxed text-ink/40">
                応募後、通常1〜2営業日以内に本部からチャットでご連絡します。
              </p>
            </Card>
          </section>
        )}

        {/* 応募ボタン */}
        <ApplyButton
          isOpen={project.status === "open"}
          appliedStatus={myApplication?.status}
        />
      </main>
    </>
  );
}
