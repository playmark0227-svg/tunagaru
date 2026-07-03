import Link from "next/link";
import { Icon } from "@/components/icons";
import { Avatar, Card, ProductThumb, SectionTitle } from "@/components/ui";
import { formatYen } from "@/lib/format";
import {
  currentClient,
  newsPosts,
  products,
  visualSettings,
} from "@/lib/mock-data";

export const metadata = { title: "ホーム" };

export default function UserHomePage() {
  const featured = products.filter((p) =>
    visualSettings.featuredProductIds.includes(p.id),
  );
  const recommended = products.slice(0, 6);

  return (
    <main className="space-y-5 px-4 pb-24 pt-4">
      {/* 教室(先生)カード */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-br from-brand via-brand-dark to-sky-500 p-4 text-white">
          <div className="flex items-center gap-3">
            <Avatar
              name={currentClient.name}
              color="bg-white/20"
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] text-white/80">
                {currentClient.category}
              </p>
              <p className="truncate text-lg font-bold">
                {currentClient.name}
              </p>
              <p className="text-xs text-white/90">
                {currentClient.ownerName}先生
              </p>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 p-3">
          <Link
            href="/user/messages/th4"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-brand-soft py-2.5 text-sm font-bold text-brand-dark transition-colors active:bg-brand-soft/70"
          >
            <Icon name="chat" className="h-4 w-4" />
            先生に相談
          </Link>
          <Link
            href="/user/shop"
            className="flex items-center justify-center gap-1.5 rounded-xl bg-stone-100 py-2.5 text-sm font-bold text-stone-600 transition-colors active:bg-stone-200"
          >
            <Icon name="store" className="h-4 w-4" />
            商品を見る
          </Link>
        </div>
      </Card>

      {/* キャンペーンバナー */}
      <Link
        href="/user/messages/th8"
        className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 ring-1 ring-amber-200"
      >
        <span className="text-lg">🍂</span>
        <span className="flex-1">{visualSettings.campaignBanner}</span>
        <Icon name="chevron-right" className="h-4 w-4 shrink-0 text-amber-400" />
      </Link>

      {/* 先生からのお知らせ */}
      <section>
        <SectionTitle title="先生からのお知らせ" />
        <div className="space-y-2">
          {newsPosts.map((post) => (
            <Card key={post.id} className="flex gap-3 p-4">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-xl">
                {post.emoji}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold leading-snug">{post.title}</p>
                <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-500">
                  {post.body}
                </p>
                <p className="mt-1.5 text-[10px] text-stone-400">
                  {post.postedAt}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* おすすめ商品カルーセル */}
      <section>
        <SectionTitle title="おすすめ商品" action={{ href: "/user/shop", label: "すべて見る" }} />
        <div className="no-scrollbar -mx-4 flex gap-3 overflow-x-auto px-4 pb-1">
          {recommended.map((p) => (
            <Link
              key={p.id}
              href={`/user/shop/${p.id}`}
              className="w-32 shrink-0"
            >
              <ProductThumb
                emoji={p.emoji}
                gradient={p.gradient}
                size="md"
                className="!h-32 !w-32"
              />
              <p className="mt-1.5 line-clamp-2 text-xs font-semibold leading-snug">
                {p.name}
              </p>
              <p className="mt-0.5 text-sm font-bold text-brand">
                {formatYen(p.price)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 体験レッスン誘導 */}
      <Link href="/user/messages/th4" className="block">
        <Card className="flex items-center gap-3 border-brand/20 bg-brand-soft/50 p-4">
          <span className="text-2xl">🎨</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-brand-dark">
              体験レッスンに参加しませんか?
            </p>
            <p className="mt-0.5 text-xs text-stone-500">
              先生にメッセージで気軽にご相談ください
            </p>
          </div>
          <Icon name="chevron-right" className="h-5 w-5 shrink-0 text-brand" />
        </Card>
      </Link>

      {featured.length > 0 && (
        <p className="pt-2 text-center text-[10px] text-stone-400">
          ご注文は {currentClient.ownerName}先生の教室を通じて本部から発送されます
        </p>
      )}
    </main>
  );
}
