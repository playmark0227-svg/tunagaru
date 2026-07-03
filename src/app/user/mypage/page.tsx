import Link from "next/link";
import { Icon } from "@/components/icons";
import { Avatar, Card, PageHeader, SectionTitle } from "@/components/ui";
import { formatYen } from "@/lib/format";
import { currentClient, currentEndUser } from "@/lib/mock-data";
import { FaqAccordion, PushToggle } from "./mypage-client";

export const metadata = { title: "マイページ" };

export default function MyPage() {
  return (
    <>
      <PageHeader title="マイページ" />
      <main className="space-y-5 px-4 pb-24 pt-4">
        {/* プロフィール */}
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <Avatar
              name={currentEndUser.name}
              color={currentEndUser.avatarColor}
              size="lg"
            />
            <div className="min-w-0 flex-1">
              <p className="text-lg font-bold">{currentEndUser.name}</p>
              <p className="text-xs text-stone-500">
                {currentClient.name} の生徒
              </p>
              <p className="mt-0.5 text-[11px] text-stone-400">
                {currentEndUser.joinedAt} 登録
              </p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2 border-t border-stone-100 pt-3">
            <div className="text-center">
              <p className="text-[10px] text-stone-400">累計購入額</p>
              <p className="text-base font-bold text-brand">
                {formatYen(currentEndUser.totalSpent)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-[10px] text-stone-400">最終注文</p>
              <p className="text-base font-bold text-stone-700">
                {currentEndUser.lastOrderAt ?? "―"}
              </p>
            </div>
          </div>
        </Card>

        {/* 通知設定 */}
        <section>
          <SectionTitle title="設定" />
          <PushToggle />
        </section>

        {/* ホーム画面に追加 */}
        <Card className="flex gap-3 border-brand/20 bg-brand-soft/50 p-4">
          <span className="text-2xl">📱</span>
          <div className="flex-1">
            <p className="text-sm font-bold text-brand-dark">
              ホーム画面に追加すると便利です
            </p>
            <p className="mt-1 text-xs leading-relaxed text-stone-600">
              ブラウザの「共有」→「ホーム画面に追加」で、アプリのように
              ワンタップで開けます。
            </p>
          </div>
        </Card>

        {/* ヘルプ */}
        <section>
          <SectionTitle title="よくある質問" />
          <FaqAccordion />
        </section>

        {/* その他 */}
        <Card className="divide-y divide-stone-100">
          <Link
            href="/user/orders"
            className="flex items-center gap-3 px-4 py-3.5 active:bg-stone-50"
          >
            <Icon name="package" className="h-5 w-5 text-stone-400" />
            <span className="flex-1 text-sm font-semibold">注文履歴</span>
            <Icon name="chevron-right" className="h-4 w-4 text-stone-300" />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3.5 active:bg-stone-50"
          >
            <Icon name="logout" className="h-5 w-5 text-stone-400" />
            <span className="flex-1 text-sm font-semibold text-stone-600">
              エントランスへ戻る
            </span>
            <Icon name="chevron-right" className="h-4 w-4 text-stone-300" />
          </Link>
        </Card>

        <p className="pt-2 text-center text-[10px] text-stone-400">
          つながるクラフト プロトタイプ版
        </p>
      </main>
    </>
  );
}
