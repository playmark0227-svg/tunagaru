"use client";

import Link from "next/link";
import { useState } from "react";
import { Badge, Card, EmptyState, type BadgeTone } from "@/components/ui";
import { formatYen } from "@/lib/format";
import { applications, currentClient, projects } from "@/lib/mock-data";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
  type Project,
} from "@/lib/types";

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

const APP_TONES: Record<ApplicationStatus, BadgeTone> = {
  applied: "blue",
  accepted: "green",
  rejected: "gray",
};

function ProjectCard({
  project,
  footer,
}: {
  project: Project;
  footer?: React.ReactNode;
}) {
  return (
    <Card>
      <Link
        href={`/client/projects/${project.id}`}
        className="block p-4 transition-colors active:bg-stone-50"
      >
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge tone={CATEGORY_TONES[project.category]}>
            {project.category}
          </Badge>
          {footer}
        </div>
        <p className="mt-2 text-sm font-bold leading-snug">{project.title}</p>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">
          {project.description}
        </p>
        <div className="mt-3 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-stone-400">報酬(税込)</p>
            <p className="text-base font-bold text-brand">
              {formatYen(project.budget)}
            </p>
          </div>
          <p className="text-xs text-stone-500">
            締切 {shortDate(project.deadline)}
            {daysUntil(project.deadline) >= 0 && (
              <span className="ml-1 font-semibold text-brand-dark">
                あと{daysUntil(project.deadline)}日
              </span>
            )}
          </p>
        </div>
      </Link>
    </Card>
  );
}

export function ProjectTabs() {
  const [tab, setTab] = useState<"open" | "applied">("open");

  const myApplications = applications.filter(
    (a) => a.clientId === currentClient.id,
  );
  const appliedProjectIds = new Set(myApplications.map((a) => a.projectId));
  // 作業者(クリエイター)向け募集はクライアントには表示しない
  const openProjects = projects.filter(
    (p) => p.status === "open" && !p.forWorkers,
  );

  return (
    <div>
      {/* タブ切替 */}
      <div className="flex rounded-full bg-stone-200/60 p-1">
        {(
          [
            { key: "open", label: `募集中 (${openProjects.length})` },
            { key: "applied", label: `応募済み (${myApplications.length})` },
          ] as const
        ).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 rounded-full py-2 text-sm font-semibold transition-colors ${
              tab === t.key
                ? "bg-white text-brand-dark shadow-sm"
                : "text-stone-500"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* 募集中タブ */}
      {tab === "open" && (
        <div className="mt-4 space-y-3">
          {openProjects.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="募集中の案件はありません"
              description="新しい案件が公開されるとプッシュ通知でお知らせします"
            />
          ) : (
            openProjects.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                footer={
                  appliedProjectIds.has(p.id) ? (
                    <Badge tone="blue">応募済み</Badge>
                  ) : undefined
                }
              />
            ))
          )}
        </div>
      )}

      {/* 応募済みタブ */}
      {tab === "applied" && (
        <div className="mt-4 space-y-3">
          {myApplications.length === 0 ? (
            <EmptyState
              icon="briefcase"
              title="まだ応募した案件はありません"
              description="気になる案件を見つけたら応募してみましょう"
            />
          ) : (
            myApplications.map((app) => {
              const project = projects.find((p) => p.id === app.projectId);
              if (!project) return null;
              return (
                <ProjectCard
                  key={app.id}
                  project={project}
                  footer={
                    <Badge tone={APP_TONES[app.status]}>
                      {APPLICATION_STATUS_LABELS[app.status]}
                    </Badge>
                  }
                />
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
