import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import {
  DoodleBone,
  DoodleCloud,
  DoodleDoghouse,
  DoodlePaw,
  DoodleSparkles,
  DoodleStar,
  ZigzagDivider,
} from "@/components/doodles";

/**
 * エントランス: ロール選択画面 (プロトタイプ用)
 * 本実装では Firebase Authentication のログイン画面になり、
 * カスタムクレームのロールに応じて自動で各ホームへ振り分ける。
 */

// 静的エクスポート + サブパス配信のため <img> には basePath を手動付与
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const roles: {
  href: string;
  icon: IconName;
  title: string;
  who: string;
  description: string;
  circleColor: string;
  tilt: string;
}[] = [
  {
    href: "/admin",
    icon: "chart",
    title: "マスター管理者",
    who: "本部(繋がるクラフト)",
    description: "全クライアント・作業者を俯瞰管理/案件発行/一斉通知/売上管理",
    circleColor: "bg-skypale",
    tilt: "-rotate-3",
  },
  {
    href: "/worker",
    icon: "sparkles",
    title: "作業者(クリエイター)",
    who: "スタッフ・映像/Web/デザインの作り手",
    description: "案件フィードで新規案件を発見・応募/担当タスクの確認",
    circleColor: "bg-lilac",
    tilt: "rotate-2",
  },
  {
    href: "/client",
    icon: "store",
    title: "クライアント",
    who: "インストラクター・教室運営者",
    description: "本部/作業者とのチャット/案件の進捗確認/物販の注文",
    circleColor: "bg-butter",
    tilt: "-rotate-2",
  },
  {
    href: "/user",
    icon: "user",
    title: "エンドユーザー",
    who: "生徒・一般のお客様",
    description: "先生の情報チェック/商品の購入/お問い合わせ",
    circleColor: "bg-mint",
    tilt: "rotate-3",
  },
];

export default function EntrancePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      {/* ヒーロー: ロゴ + コミックのあしらい */}
      <div className="relative flex flex-col items-center gap-4 pt-8">
        <DoodleCloud className="absolute -top-2 left-0 h-7 w-11" />
        <DoodleStar className="absolute right-2 top-0 h-5 w-5 rotate-12 text-butter" />
        <DoodleDoghouse className="absolute -right-1 top-14 h-9 w-9 rotate-6" />
        <DoodleBone className="absolute left-1 top-16 h-4 w-7 -rotate-12" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${basePath}/logo.png`}
          alt="つながるCraft"
          className="h-14 w-auto"
        />
        <ZigzagDivider className="w-40" />
        <p className="text-center text-sm font-bold leading-relaxed text-ink/70">
          顧客管理・メッセージ・案件・物販をひとつに。
          <br />
          あなたの
          <span className="mx-1 inline-block -rotate-1 rounded-lg border-2 border-ink bg-butter px-1.5 font-black text-ink">
            デジタル系 総合相談窓口
          </span>
        </p>
      </div>

      {/* ロール選択 */}
      <div className="mt-9 space-y-4">
        <p className="flex items-center justify-center gap-2 text-xs font-bold tracking-widest text-ink/50">
          <DoodlePaw className="h-4 w-4 opacity-40" />
          体験するユーザーをえらんでね
          <DoodlePaw className="h-4 w-4 -scale-x-100 opacity-40" />
        </p>
        {roles.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="sticker comic-press group flex items-center gap-4 rounded-2xl p-4"
          >
            <span
              className={`comic-circle flex h-14 w-14 shrink-0 items-center justify-center text-ink transition-transform group-hover:scale-110 ${role.circleColor} ${role.tilt}`}
            >
              <Icon name={role.icon} className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold text-ink/45">
                {role.who}
              </span>
              <span className="block text-[15px] font-black tracking-wide">
                {role.title}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-ink/60">
                {role.description}
              </span>
            </span>
            <Icon
              name="chevron-right"
              className="h-5 w-5 shrink-0 text-ink/40 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>

      <footer className="mt-auto pt-10">
        <div className="mb-4 flex items-center justify-center gap-3">
          <DoodleSparkles className="h-6 w-6 text-butter" />
          <DoodleBone className="h-4 w-7" />
          <DoodleSparkles className="h-6 w-6 -scale-x-100 text-butter" />
        </div>
        <p className="text-center text-[11px] font-bold leading-relaxed text-ink/45">
          プロトタイプ版 — 画面と操作感を検証するためのモックアップです。
          <br />
          データはすべてサンプルで、送信内容は保存されません。
        </p>
        <p className="mt-2 text-center text-[11px] font-bold text-ink/45">
          スマホの「ホーム画面に追加」でアプリのように使えます 📱
        </p>
      </footer>
    </main>
  );
}
