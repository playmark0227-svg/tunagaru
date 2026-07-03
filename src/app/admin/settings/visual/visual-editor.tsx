"use client";

/**
 * ビジュアル管理: ノーコード編集フォーム + スマホ風ライブプレビュー
 * 入力内容がリアルタイムで右側 (モバイルは下) のプレビューに反映される。
 */
import { useState } from "react";
import { products, visualSettings } from "@/lib/mock-data";
import { formatYen } from "@/lib/format";
import { Card, ProductThumb, SectionTitle } from "@/components/ui";
import { Icon } from "@/components/icons";

type Phase = "editing" | "saving" | "saved";

export function VisualEditor() {
  const [heroTitle, setHeroTitle] = useState(visualSettings.heroTitle);
  const [heroSubtitle, setHeroSubtitle] = useState(visualSettings.heroSubtitle);
  const [campaignBanner, setCampaignBanner] = useState(
    visualSettings.campaignBanner,
  );
  const [brandColor, setBrandColor] = useState(visualSettings.brandColor);
  const [featuredIds, setFeaturedIds] = useState<string[]>(
    visualSettings.featuredProductIds,
  );
  const [phase, setPhase] = useState<Phase>("editing");

  const featured = products.filter((p) => featuredIds.includes(p.id));

  function toggleFeatured(id: string) {
    setPhase("editing");
    setFeaturedIds((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id],
    );
  }

  function save() {
    if (phase === "saving") return;
    setPhase("saving");
    // 本実装: Firestore の settings ドキュメントを更新
    setTimeout(() => setPhase("saved"), 900);
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      {/* 編集フォーム */}
      <section>
        <SectionTitle title="ノーコード編集" />
        <Card className="space-y-4 p-5">
          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">
              ヒーロー見出し
            </label>
            <input
              type="text"
              value={heroTitle}
              onChange={(e) => {
                setHeroTitle(e.target.value);
                setPhase("editing");
              }}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">
              ヒーローサブテキスト
            </label>
            <input
              type="text"
              value={heroSubtitle}
              onChange={(e) => {
                setHeroSubtitle(e.target.value);
                setPhase("editing");
              }}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">
              キャンペーンバナー
            </label>
            <input
              type="text"
              value={campaignBanner}
              onChange={(e) => {
                setCampaignBanner(e.target.value);
                setPhase("editing");
              }}
              className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:bg-white"
            />
            <p className="mt-1 text-[11px] text-stone-400">
              空欄にするとバナーは表示されません
            </p>
          </div>

          <div>
            <label className="mb-1 block text-xs font-bold text-stone-600">
              ブランドカラー
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => {
                  setBrandColor(e.target.value);
                  setPhase("editing");
                }}
                className="h-10 w-14 cursor-pointer rounded-lg border border-stone-200 bg-white p-1"
                aria-label="ブランドカラーを選択"
              />
              <input
                type="text"
                value={brandColor}
                onChange={(e) => {
                  setBrandColor(e.target.value);
                  setPhase("editing");
                }}
                className="w-28 rounded-xl border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-indigo-400 focus:bg-white"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-bold text-stone-600">
              おすすめ商品 ({featuredIds.length}件 選択中)
            </label>
            <div className="space-y-2">
              {products.map((p) => {
                const checked = featuredIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleFeatured(p.id)}
                    className={`flex w-full items-center gap-3 rounded-xl border p-2.5 text-left transition-colors ${
                      checked
                        ? "border-indigo-400 bg-indigo-50/60"
                        : "border-stone-200 bg-white hover:bg-stone-50"
                    }`}
                  >
                    <ProductThumb
                      emoji={p.emoji}
                      gradient={p.gradient}
                      size="sm"
                    />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold">
                        {p.name}
                      </span>
                      <span className="block text-xs text-stone-400">
                        {formatYen(p.price)}
                      </span>
                    </span>
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        checked
                          ? "bg-indigo-500 text-white"
                          : "border border-stone-300 text-transparent"
                      }`}
                    >
                      <Icon name="check" className="h-3.5 w-3.5" />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <button
            onClick={save}
            disabled={phase === "saving"}
            className={`flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-bold text-white shadow-sm transition-colors ${
              phase === "saving"
                ? "cursor-wait bg-indigo-300"
                : "bg-indigo-500 hover:bg-indigo-600"
            }`}
          >
            {phase === "saving" ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                公開しています…
              </>
            ) : (
              <>
                <Icon name="sparkles" className="h-4.5 w-4.5" />
                この内容で公開する
              </>
            )}
          </button>
          {phase === "saved" && (
            <p className="flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-xs font-semibold text-emerald-700">
              <Icon name="check" className="h-4 w-4 shrink-0" />
              公開しました!エンドユーザーのホーム画面に反映されています
            </p>
          )}
        </Card>
      </section>

      {/* スマホ風ライブプレビュー */}
      <section className="md:sticky md:top-20">
        <SectionTitle title="ライブプレビュー (エンドユーザーのホーム)" />
        <div className="mx-auto w-[290px] overflow-hidden rounded-[2.2rem] border-[6px] border-stone-800 bg-white shadow-xl">
          <div className="h-[560px] overflow-y-auto bg-cream">
            {/* 擬似ステータスバー */}
            <div className="flex items-center justify-between bg-white px-4 py-1.5 text-[9px] font-semibold text-stone-500">
              <span>9:41</span>
              <span>●●●</span>
            </div>

            {/* キャンペーンバナー */}
            {campaignBanner.trim() && (
              <div className="bg-amber-100 px-3 py-1.5 text-center text-[10px] font-bold text-amber-800">
                {campaignBanner}
              </div>
            )}

            {/* ヒーロー */}
            <div
              className="px-4 pb-5 pt-4 text-white"
              style={{ backgroundColor: brandColor }}
            >
              <p className="text-[9px] font-semibold opacity-80">
                つながるクラフト
              </p>
              <p className="mt-1 text-sm font-bold leading-snug">
                {heroTitle.trim() || "(見出しが未入力です)"}
              </p>
              <p className="mt-1 text-[10px] leading-relaxed opacity-90">
                {heroSubtitle}
              </p>
            </div>

            {/* おすすめ商品 */}
            <div className="px-3 py-3">
              <p className="text-[11px] font-bold text-stone-700">
                おすすめ商品
              </p>
              {featured.length === 0 ? (
                <p className="mt-2 rounded-xl bg-white px-3 py-4 text-center text-[10px] text-stone-400">
                  おすすめ商品が未選択です
                </p>
              ) : (
                <div className="mt-2 space-y-2">
                  {featured.map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center gap-2.5 rounded-xl border border-stone-200/70 bg-white p-2 shadow-sm"
                    >
                      <ProductThumb
                        emoji={p.emoji}
                        gradient={p.gradient}
                        size="sm"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[11px] font-semibold">
                          {p.name}
                        </p>
                        <p
                          className="text-[11px] font-bold"
                          style={{ color: brandColor }}
                        >
                          {formatYen(p.price)}
                        </p>
                      </div>
                      <span
                        className="shrink-0 rounded-full px-2 py-1 text-[9px] font-bold text-white"
                        style={{ backgroundColor: brandColor }}
                      >
                        見る
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* 体験レッスンバナー */}
              <div className="mt-3 rounded-xl bg-gradient-to-br from-orange-100 to-rose-100 px-3 py-3">
                <p className="text-[10px] font-bold text-stone-700">
                  🌸 体験レッスン受付中
                </p>
                <p className="mt-0.5 text-[9px] text-stone-500">
                  お近くの教室をさがしてみましょう
                </p>
              </div>
            </div>

            {/* 擬似ボトムナビ */}
            <div className="sticky bottom-0 flex justify-around border-t border-stone-200 bg-white px-2 py-2">
              {(["home", "store", "package", "chat", "user"] as const).map(
                (name, i) => (
                  <span
                    key={name}
                    style={i === 0 ? { color: brandColor } : undefined}
                    className={i === 0 ? "" : "text-stone-300"}
                  >
                    <Icon name={name} className="h-4 w-4" />
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
        <p className="mt-3 text-center text-[11px] text-stone-400">
          入力内容がそのままプレビューに反映されます
        </p>
      </section>
    </div>
  );
}
