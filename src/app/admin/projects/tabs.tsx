"use client";

/** 案件管理: タブ (募集中・進行中・完了) + 案件カード */
import Link from "next/link";
import { useState } from "react";
import { clients, projects } from "@/lib/mock-data";
import {
  PROJECT_STATUS_LABELS,
  type ProjectCategory,
  type ProjectStatus,
} from "@/lib/types";
import { formatYen } from "@/lib/format";
import { Badge, Card, EmptyState, type BadgeTone } from "@/components/ui";
import { Icon } from "@/components/icons";

const categoryTone: Record<ProjectCategory, BadgeTone> = {
  HP制作: "blue",
  動画制作: "violet",
  キャンペーン: "brand",
  SNS運用: "amber",
  EC構築: "green",
  デザイン: "gray",
};

const tabs: ProjectStatus[] = ["open", "in_progress", "done"];

/** "2026-07-20" → "7/20" */
function md(date: string): string {
  const [, m, d] = date.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function ProjectTabs() {
  const [tab, setTab] = useState<ProjectStatus>("open");
  const filtered = projects.filter((p) => p.status === tab);

  return (
    <div className="space-y-4">
      {/* タブ */}
      <div className="flex rounded-none border border-ink/10 bg-white p-1 shadow-sm">
        {tabs.map((t) => {
          const count = projects.filter((p) => p.status === t).length;
          return (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 rounded-sm py-2 text-xs font-bold transition-colors ${
                tab === t
                  ? "bg-aqua text-white shadow-sm"
                  : "text-ink/55 hover:text-ink/80"
              }`}
            >
              {PROJECT_STATUS_LABELS[t]} ({count})
            </button>
          );
        })}
      </div>

      {/* 案件カード */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="briefcase"
          title="該当する案件はありません"
          description="「案件を作成」から新しい案件を発行できます"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((p) => {
            const assigned = clients.find((c) => c.id === p.assignedClientId);
            return (
              <Link key={p.id} href={`/admin/projects/${p.id}`} className="block">
                <Card className="p-4 transition-shadow hover:shadow-md">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <Badge tone={categoryTone[p.category]}>{p.category}</Badge>
                    {p.status === "open" && p.applicantIds.length > 0 && (
                      <Badge tone="red">応募 {p.applicantIds.length}件</Badge>
                    )}
                    {p.status !== "open" && (
                      <Badge tone={p.status === "done" ? "green" : "blue"}>
                        {PROJECT_STATUS_LABELS[p.status]}
                      </Badge>
                    )}
                  </div>
                  <h3 className="mt-2 font-bold leading-snug">{p.title}</h3>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/55">
                    {p.description}
                  </p>
                  <div className="mt-3 flex items-center gap-3 text-xs text-ink/55">
                    <span className="text-sm font-bold text-ink">
                      {formatYen(p.budget)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="calendar" className="h-3.5 w-3.5" />
                      締切 {md(p.deadline)}
                    </span>
                    <span className="ml-auto flex items-center gap-1">
                      <Icon name="users" className="h-3.5 w-3.5" />
                      応募 {p.applicantIds.length}件
                    </span>
                  </div>
                  {assigned && (
                    <p className="mt-2 rounded-sm bg-cream px-3 py-1.5 text-xs text-ink/55">
                      担当: {assigned.name} ({assigned.ownerName} 様)
                    </p>
                  )}
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
