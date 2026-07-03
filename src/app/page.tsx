import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";
import {
  DoodleLoop,
  DoodleSparkles,
  DoodleSquiggle,
  DoodleStar,
  StitchDivider,
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
  blobColor: string;
  tilt: string;
}[] = [
  {
    href: "/admin",
    icon: "chart",
    title: "マスター管理者",
    who: "本部(繋がるクラフト)",
    description: "全クライアント・作業者を俯瞰管理/案件発行/一斉通知/売上管理",
    blobColor: "bg-brand text-white",
    tilt: "-rotate-3",
  },
  {
    href: "/worker",
    icon: "sparkles",
    title: "作業者(クリエイター)",
    who: "スタッフ・映像/Web/デザインの作り手",
    description: "案件フィードで新規案件を発見・応募/担当タスクの確認",
    blobColor: "bg-lilac text-violet-700",
    tilt: "rotate-2",
  },
  {
    href: "/client",
    icon: "store",
    title: "クライアント",
    who: "インストラクター・教室運営者",
    description: "本部/作業者とのチャット/案件の進捗確認/物販の注文",
    blobColor: "bg-butter text-amber-700",
    tilt: "-rotate-2",
  },
  {
    href: "/user",
    icon: "user",
    title: "エンドユーザー",
    who: "生徒・一般のお客様",
    description: "先生の情報チェック/商品の購入/お問い合わせ",
    blobColor: "bg-mint text-emerald-700",
    tilt: "rotate-3",
  },
];

export default function EntrancePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      {/* ヒーロー: ロゴ + 手描きあしらい */}
      <div className="relative flex flex-col items-center gap-4 pt-6">
        <DoodleSparkles className="absolute -top-1 right-3 h-9 w-9 rotate-12 text-butter" />
        <DoodleStar className="absolute left-2 top-10 h-5 w-5 -rotate-12 text-peach" />
        <DoodleLoop className="absolute -left-2 -top-2 h-8 w-8 text-mint" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${basePath}/logo.png`}
          alt="つながるCraft"
          className="h-14 w-auto drop-shadow-[3px_3px_0_rgba(40,47,90,0.08)]"
        />
        <DoodleSquiggle className="h-3 w-24 text-peach" />
        <p className="text-center text-sm font-bold leading-relaxed text-stone-500">
          顧客管理・メッセージ・案件・物販をひとつに。
          <br />
          あなたの
          <span className="mx-1 inline-block -rotate-1 rounded-lg bg-butter px-1.5 font-black text-brand">
            デジタル系 総合相談窓口
          </span>
        </p>
      </div>

      {/* ロール選択 */}
      <div className="mt-9 space-y-4">
        <p className="text-center text-xs font-bold tracking-widest text-brand/50">
          ─ 体験するユーザーをえらんでね ─
        </p>
        {roles.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="sticker group flex items-center gap-4 rounded-3xl p-4 transition-transform hover:-translate-y-1 hover:rotate-[0.5deg] active:translate-y-0"
          >
            <span
              className={`blob flex h-14 w-14 shrink-0 items-center justify-center transition-transform group-hover:scale-110 ${role.blobColor} ${role.tilt}`}
            >
              <Icon name={role.icon} className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-bold text-stone-400">
                {role.who}
              </span>
              <span className="block text-[15px] font-black tracking-wide">
                {role.title}
              </span>
              <span className="mt-0.5 block text-xs leading-relaxed text-stone-500">
                {role.description}
              </span>
            </span>
            <Icon
              name="chevron-right"
              className="h-5 w-5 shrink-0 text-brand/30 transition-transform group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>

      <footer className="mt-auto pt-10">
        <StitchDivider className="mb-4" />
        <p className="text-center text-[11px] font-bold leading-relaxed text-stone-400">
          プロトタイプ版 — 画面と操作感を検証するためのモックアップです。
          <br />
          データはすべてサンプルで、送信内容は保存されません。
        </p>
        <p className="mt-2 text-center text-[11px] font-bold text-stone-400">
          スマホの「ホーム画面に追加」でアプリのように使えます 📱
        </p>
      </footer>
    </main>
  );
}
