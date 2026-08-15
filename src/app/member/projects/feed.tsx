"use client";

/**
 * 案件フィード (スタッフ限定・Instagram風)
 *
 * 受け取るのは StaffProjectView のみ。顧客提示額(clientPrice)は
 * サーバー側で除去済みなので、この画面からマージンは推測できない。
 */
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Badge, Card, EmptyState } from "@/components/ui";
import { formatDeadline, formatMd, formatYen } from "@/lib/format";
import { CATEGORY_TONES } from "@/lib/tones";
import {
  PROJECT_STATUS_LABELS,
  type ProjectCategory,
  type StaffProjectView,
} from "@/lib/types";

const CATEGORIES: (ProjectCategory | "すべて")[] = [
  "すべて",
  "動画制作",
  "HP制作",
  "デザイン",
  "SNS運用",
];

export function StaffProjectFeed({
  projects,
  myId,
}: {
  projects: StaffProjectView[];
  myId: string;
}) {
  const [category, setCategory] = useState<ProjectCategory | "すべて">(
    "すべて",
  );
  const [liked, setLiked] = useState<Record<string, boolean>>({});

  const open = projects.filter((p) => p.status === "open");
  const shown =
    category === "すべて"
      ? open
      : open.filter((p) => p.category === category);

  return (
    <main className="pb-24">
      {/* カテゴリ絞り込み */}
      <div className="no-scrollbar sticky top-12 z-10 flex gap-2 overflow-x-auto border-b border-ink/10 bg-cream/95 px-4 py-2.5 backdrop-blur">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`shrink-0 rounded-sm border px-3 py-1.5 text-xs font-bold transition-colors ${
              category === c
                ? "border-aqua bg-aqua text-white"
                : "border-ink/15 bg-white text-ink/55 hover:border-aqua hover:text-aqua"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* 募集の主旨 */}
      <div className="mx-4 mt-3 border border-aqua/40 bg-aqua-soft px-3 py-2">
        <p className="text-[11px] leading-relaxed text-ink/70">
          <span className="font-bold">スタッフ限定ページです。</span>
          ここに表示される金額は<strong>あなたへのお支払い額</strong>です。
          お客様には表示されません。
        </p>
      </div>

      {shown.length === 0 ? (
        <EmptyState
          icon="briefcase"
          title="募集中の案件はありません"
          description="新しい案件が出るとプッシュ通知でお知らせします"
        />
      ) : (
        <div className="stagger mt-3 space-y-4 px-4">
          {shown.map((p) => {
            const applied = p.applicantWorkerIds?.includes(myId) ?? false;
            const isLiked = liked[p.id] ?? false;
            return (
              <Card key={p.id} className="overflow-hidden">
                {/* 投稿者 */}
                <div className="flex items-center gap-2 border-b border-ink/8 px-4 py-2.5">
                  <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-brand text-[10px] font-bold text-white">
                    繋
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold">
                      {p.postedBy ?? "繋がるクラフト 本部"}
                    </p>
                    <p className="text-[10px] text-ink/40">
                      {formatMd(p.createdAt)} 投稿
                    </p>
                  </div>
                  <Badge tone={CATEGORY_TONES[p.category]}>{p.category}</Badge>
                </div>

                {/* カバー */}
                <div
                  className={`relative flex h-40 items-center justify-center bg-gradient-to-br text-6xl ${p.gradient}`}
                >
                  {p.emoji}
                  <span className="absolute bottom-2 right-2 rounded-sm border border-ink/12 bg-white/95 px-2 py-1 text-xs font-bold">
                    報酬 {formatYen(p.reward)}
                  </span>
                </div>

                {/* アクション */}
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <button
                    onClick={() =>
                      setLiked((s) => ({ ...s, [p.id]: !s[p.id] }))
                    }
                    className={`flex items-center gap-1 text-xs transition-colors ${
                      isLiked ? "font-bold text-rose-500" : "text-ink/50"
                    }`}
                    aria-label="気になる"
                  >
                    <Icon
                      name="heart"
                      className={`h-4.5 w-4.5 ${isLiked ? "animate-pop" : ""}`}
                    />
                    {p.likes + (isLiked ? 1 : 0)}
                  </button>
                  <Link
                    href={`/member/projects/${p.id}`}
                    className={`comic-press ml-auto rounded-sm px-4 py-1.5 text-xs font-bold transition-colors ${
                      applied
                        ? "border border-ink/15 bg-white text-ink/50"
                        : "border border-aqua bg-aqua text-white hover:bg-[#12a0bb]"
                    }`}
                  >
                    {applied ? "応募済み" : "詳しく見る"}
                  </Link>
                </div>

                {/* 本文 */}
                <div className="px-4 pb-4">
                  <p className="text-sm font-bold leading-snug">{p.title}</p>
                  <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink/55">
                    {p.description}
                  </p>
                  <div className="mt-2.5 flex flex-wrap items-center gap-3 border-t border-ink/8 pt-2.5 text-[11px] text-ink/45">
                    <span className="flex items-center gap-1">
                      <Icon name="calendar" className="h-3.5 w-3.5" />
                      締切 {formatMd(p.deadline)} ({formatDeadline(p.deadline)})
                    </span>
                    <span className="flex items-center gap-1">
                      <Icon name="users" className="h-3.5 w-3.5" />
                      応募 {p.applicantWorkerIds?.length ?? 0}名
                    </span>
                    <span className="ml-auto">
                      {PROJECT_STATUS_LABELS[p.status]}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}
