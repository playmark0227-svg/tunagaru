import type { Metadata } from "next";
import { Avatar, Card, ListRow, SectionTitle } from "@/components/ui";
import { Icon, type IconName } from "@/components/icons";
import { AdminHeader } from "../header";

export const metadata: Metadata = { title: "メニュー" };

const menuItems: {
  href: string;
  icon: IconName;
  iconClass: string;
  label: string;
  description: string;
}[] = [
  {
    href: "/admin/orders",
    icon: "package",
    iconClass: "bg-amber-50 text-amber-600",
    label: "受注・発注管理",
    description: "B2B2Cパイプラインの確認・更新",
  },
  {
    href: "/admin/payments",
    icon: "credit-card",
    iconClass: "bg-emerald-50 text-emerald-600",
    label: "報酬・支払管理",
    description: "売上サマリーと案件ごとの支払状況",
  },
  {
    href: "/admin/announcements",
    icon: "megaphone",
    iconClass: "bg-aqua-soft text-aqua",
    label: "一斉通知",
    description: "プッシュ通知の配信と履歴",
  },
  {
    href: "/admin/settings/visual",
    icon: "pencil",
    iconClass: "bg-violet-50 text-violet-500",
    label: "ビジュアル管理",
    description: "ホーム画面のノーコード編集",
  },
];

export default function AdminMenuPage() {
  return (
    <>
      <AdminHeader title="メニュー" />

      <main className="mx-auto max-w-md space-y-6 px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        {/* アカウント */}
        <Card className="flex items-center gap-3 p-4">
          <Avatar name="繋がるクラフト 本部" color="bg-aqua" size="lg" />
          <div className="min-w-0 flex-1">
            <p className="font-bold">繋がるクラフト 本部</p>
            <p className="text-xs text-ink/40">マスター管理者アカウント</p>
          </div>
        </Card>

        {/* 管理メニュー */}
        <section>
          <SectionTitle title="管理メニュー" />
          <Card className="divide-y divide-ink/8">
            {menuItems.map((item) => (
              <ListRow key={item.href} href={item.href}>
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-sm ${item.iconClass}`}
                >
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className="block truncate text-xs text-ink/40">
                    {item.description}
                  </span>
                </span>
              </ListRow>
            ))}
          </Card>
        </section>

        {/* エントランスへ戻る */}
        <section>
          <Card className="divide-y divide-ink/8">
            <ListRow href="/">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-ink/5 text-ink/55">
                <Icon name="logout" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">
                  エントランスへ戻る
                </span>
                <span className="block truncate text-xs text-ink/40">
                  ロール選択画面に戻ります
                </span>
              </span>
            </ListRow>
          </Card>
        </section>

        <p className="text-center text-[11px] leading-relaxed text-ink/40">
          つながるクラフト 本部管理 — プロトタイプ版
        </p>
      </main>
    </>
  );
}
