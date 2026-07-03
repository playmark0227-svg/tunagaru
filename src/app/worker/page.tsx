"use client";

/**
 * 案件募集フィード (Instagram風) — 作業者(クリエイター)のホーム
 *
 * コンポーネント構成:
 *   FeedHeader      ロゴ + 通知ベル
 *   CategoryChips   カテゴリで絞り込み (すべて/動画制作/HP制作/デザイン/…)
 *   FeedCard[]      1案件 = 1投稿
 *     ├ CardHeader    投稿者(本部)アバター + 投稿日 + カテゴリバッジ
 *     ├ CoverVisual   グラデーション+絵文字のカバー + 報酬ピル
 *     ├ ActionRow     いいね♥ / 保存 / 「詳しく見る」
 *     └ Caption       タイトル + 説明(2行省略) + 締切・応募数メタ
 *
 * 本実装では projects コレクションの forWorkers=true & status=open を
 * createdAt 降順で無限スクロール取得し、いいね/保存は users サブコレクションに保存。
 */
import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";
import { Avatar, Badge, Card } from "@/components/ui";
import { formatYen } from "@/lib/format";
import { currentWorker, projects } from "@/lib/mock-data";
import type { ProjectCategory } from "@/lib/types";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const categories: ("すべて" | ProjectCategory)[] = [
  "すべて",
  "動画制作",
  "HP制作",
  "デザイン",
  "SNS運用",
  "キャンペーン",
];

export default function WorkerFeedPage() {
  const [category, setCategory] = useState<(typeof categories)[number]>("すべて");
  const [likes, setLikes] = useState<Record<string, boolean>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  const feed = projects
    .filter((p) => p.forWorkers && p.status === "open")
    .filter((p) => category === "すべて" || p.category === category)
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <>
      {/* FeedHeader */}
      <header className="sticky top-0 z-20 border-b border-stone-200/70 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-12 max-w-md items-center gap-2 px-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${basePath}/logo.png`}
            alt="つながるCraft"
            className="h-6 w-auto"
          />
          <span className="flex-1 text-sm font-bold text-stone-500">
            案件フィード
          </span>
          <button
            className="relative flex h-9 w-9 items-center justify-center rounded-full text-stone-600 hover:bg-stone-100"
            aria-label="通知"
          >
            <Icon name="bell" className="h-5 w-5" />
            <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-rose-500" />
          </button>
        </div>
        {/* CategoryChips */}
        <div className="no-scrollbar mx-auto flex max-w-md gap-2 overflow-x-auto px-4 pb-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-colors ${
                category === cat
                  ? "bg-brand text-white"
                  : "bg-stone-100 text-stone-500"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      <main className="space-y-4 px-4 pb-24 pt-4">
        <p className="text-xs text-stone-500">
          こんにちは、{currentWorker.name}さん👋 新着の募集をチェックしましょう
        </p>

        {feed.map((p) => {
          const liked = likes[p.id] ?? false;
          const likeCount = p.likes + (liked ? 1 : 0);
          const applicants = p.applicantWorkerIds?.length ?? 0;
          return (
            <Card key={p.id} className="overflow-hidden">
              {/* CardHeader */}
              <div className="flex items-center gap-2.5 px-4 py-3">
                <Avatar name="繋がるクラフト" color="bg-brand" size="sm" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold">繋がるクラフト 本部</p>
                  <p className="text-[10px] text-stone-400">{p.createdAt} 投稿</p>
                </div>
                <Badge tone="brand">{p.category}</Badge>
              </div>

              {/* CoverVisual */}
              <Link href={`/worker/projects/${p.id}`} className="block">
                <div
                  className={`relative flex h-44 items-center justify-center bg-gradient-to-br ${p.gradient}`}
                >
                  <span className="text-6xl">{p.emoji}</span>
                  <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-brand shadow-sm">
                    報酬 {formatYen(p.budget)}
                  </span>
                </div>
              </Link>

              {/* ActionRow */}
              <div className="flex items-center gap-1 px-3 pt-2">
                <button
                  onClick={() =>
                    setLikes((prev) => ({ ...prev, [p.id]: !liked }))
                  }
                  aria-label="いいね"
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    liked ? "text-rose-500" : "text-stone-400 hover:text-rose-400"
                  }`}
                >
                  <Icon
                    name="heart"
                    className={`h-5.5 w-5.5 ${liked ? "fill-rose-500" : ""}`}
                  />
                </button>
                <span className="-ml-1 text-xs font-semibold text-stone-500">
                  {likeCount}
                </span>
                <button
                  onClick={() =>
                    setSaved((prev) => ({ ...prev, [p.id]: !(saved[p.id] ?? false) }))
                  }
                  aria-label="保存"
                  className={`ml-1 flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    saved[p.id] ? "text-brand" : "text-stone-400 hover:text-brand"
                  }`}
                >
                  <Icon
                    name="bookmark"
                    className={`h-5 w-5 ${saved[p.id] ? "fill-brand" : ""}`}
                  />
                </button>
                <div className="flex-1" />
                <Link
                  href={`/worker/projects/${p.id}`}
                  className="rounded-full bg-brand px-5 py-2 text-xs font-bold text-white transition-colors active:bg-brand-dark"
                >
                  詳しく見る
                </Link>
              </div>

              {/* Caption */}
              <div className="px-4 pb-4 pt-1.5">
                <p className="text-sm font-bold leading-snug">{p.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">
                  {p.description}
                </p>
                <p className="mt-2 flex items-center gap-3 text-[11px] text-stone-400">
                  <span className="flex items-center gap-1">
                    <Icon name="calendar" className="h-3.5 w-3.5" />
                    締切 {p.deadline}
                  </span>
                  <span className="flex items-center gap-1">
                    <Icon name="users" className="h-3.5 w-3.5" />
                    応募 {applicants}名
                  </span>
                </p>
              </div>
            </Card>
          );
        })}

        {feed.length === 0 && (
          <p className="py-16 text-center text-sm text-stone-400">
            このカテゴリの募集は現在ありません
          </p>
        )}

        <p className="pt-2 text-center text-[10px] leading-relaxed text-stone-400">
          新しい案件が投稿されるとプッシュ通知でお知らせします🔔
        </p>
      </main>
    </>
  );
}
