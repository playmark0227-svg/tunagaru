import { Icon, type IconName } from "@/components/icons";
import {
  Avatar,
  Badge,
  Card,
  ListRow,
  PageHeader,
  SectionTitle,
} from "@/components/ui";
import { currentMember, endUsers } from "@/lib/mock-data";

export const metadata = { title: "メニュー" };

const menuItems: {
  href: string;
  icon: IconName;
  label: string;
  sub: string;
}[] = [
  {
    href: "/member/students",
    icon: "users",
    label: "生徒管理",
    sub: `アプリ利用中 ${endUsers.length}名`,
  },
  {
    href: "/member/shop",
    icon: "store",
    label: "仕入れ(卸)",
    sub: "卸価格カタログ・発注",
  },
  {
    href: "/member/booking",
    icon: "video",
    label: "Zoom予約",
    sub: "本部との打ち合わせ",
  },
];

export default function ClientMenuPage() {
  return (
    <>
      <PageHeader title="メニュー" />
      <main className="space-y-4 px-4 pb-24 pt-4">
        {/* プロフィール (行のみ・モーダルなし) */}
        <Card className="flex items-center gap-3 p-4">
          <Avatar
            name={currentMember.ownerName}
            color={currentMember.avatarColor}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <p className="text-base font-bold">{currentMember.ownerName}</p>
            <p className="mt-0.5 truncate text-xs text-ink/55">
              {currentMember.name}|{currentMember.category}
            </p>
            <div className="mt-1.5">
              <Badge tone="brand">{currentMember.plan}プラン</Badge>
            </div>
          </div>
        </Card>

        {/* メニュー */}
        <section>
          <SectionTitle title="教室の運営" />
          <Card className="divide-y divide-ink/8">
            {menuItems.map((item) => (
              <ListRow key={item.href} href={item.href}>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-brand-soft text-brand">
                  <Icon name={item.icon} className="h-5 w-5" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-ink/40">
                    {item.sub}
                  </span>
                </span>
              </ListRow>
            ))}
            {/* プロフィール行 (表示のみ) */}
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-ink/5 text-ink/55">
                <Icon name="user" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold">プロフィール</span>
                <span className="mt-0.5 block text-xs text-ink/40">
                  {currentMember.ownerName}({currentMember.name})
                </span>
              </span>
            </div>
          </Card>
        </section>

        {/* その他 */}
        <section>
          <SectionTitle title="その他" />
          <Card>
            <ListRow href="/">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-ink/5 text-ink/55">
                <Icon name="logout" className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-bold text-rose-600">
                  エントランスへ戻る
                </span>
                <span className="mt-0.5 block text-xs text-ink/40">
                  ロール選択画面 (プロトタイプ用)
                </span>
              </span>
            </ListRow>
          </Card>
        </section>

        <p className="pt-2 text-center text-[11px] leading-relaxed text-ink/40">
          つながるクラフト プロトタイプ版
          <br />
          お困りのことは本部チャットからお気軽にどうぞ🌿
        </p>
      </main>
    </>
  );
}
