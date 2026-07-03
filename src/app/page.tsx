import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";

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
  accent: string;
}[] = [
  {
    href: "/admin",
    icon: "chart",
    title: "マスター管理者",
    who: "本部(繋がるクラフト)",
    description: "全クライアント・作業者を俯瞰管理/案件発行/一斉通知/売上管理",
    accent: "bg-brand",
  },
  {
    href: "/worker",
    icon: "sparkles",
    title: "作業者(クリエイター)",
    who: "スタッフ・映像/Web/デザインの作り手",
    description: "案件フィードで新規案件を発見・応募/担当タスクの確認",
    accent: "bg-violet-500",
  },
  {
    href: "/client",
    icon: "store",
    title: "クライアント",
    who: "インストラクター・教室運営者",
    description: "本部/作業者とのチャット/案件の進捗確認/物販の注文",
    accent: "bg-amber-500",
  },
  {
    href: "/user",
    icon: "user",
    title: "エンドユーザー",
    who: "生徒・一般のお客様",
    description: "先生の情報チェック/商品の購入/お問い合わせ",
    accent: "bg-emerald-500",
  },
];

export default function EntrancePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      {/* ロゴ */}
      <div className="flex flex-col items-center gap-4 pt-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${basePath}/logo.png`}
          alt="つながるCraft"
          className="h-14 w-auto"
        />
        <p className="text-center text-sm leading-relaxed text-stone-500">
          顧客管理・メッセージ・案件・物販をひとつに。
          <br />
          あなたの<span className="font-bold text-brand">デジタル系 総合相談窓口</span>
        </p>
      </div>

      {/* ロール選択 */}
      <div className="mt-8 space-y-3">
        <p className="text-center text-xs font-medium text-stone-400">
          — 体験するユーザーを選択してください —
        </p>
        {roles.map((role) => (
          <Link
            key={role.href}
            href={role.href}
            className="flex items-center gap-4 rounded-2xl border border-stone-200/70 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:translate-y-0"
          >
            <span
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white ${role.accent}`}
            >
              <Icon name={role.icon} className="h-6 w-6" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[11px] font-medium text-stone-400">
                {role.who}
              </span>
              <span className="block font-bold">{role.title}</span>
              <span className="mt-0.5 block text-xs leading-relaxed text-stone-500">
                {role.description}
              </span>
            </span>
            <Icon
              name="chevron-right"
              className="h-5 w-5 shrink-0 text-stone-300"
            />
          </Link>
        ))}
      </div>

      <footer className="mt-auto pt-10 text-center text-[11px] leading-relaxed text-stone-400">
        <p>
          プロトタイプ版 — 画面と操作感を検証するためのモックアップです。
          <br />
          データはすべてサンプルで、送信内容は保存されません。
        </p>
        <p className="mt-2">
          スマホの「ホーム画面に追加」でアプリのように使えます 📱
        </p>
      </footer>
    </main>
  );
}
