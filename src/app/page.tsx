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
}[] = [
  {
    href: "/admin",
    icon: "chart",
    title: "マスター管理者",
    who: "本部(繋がるクラフト)",
    description: "全クライアント・作業者を俯瞰管理/案件発行/一斉通知/売上管理",
  },
  {
    href: "/worker",
    icon: "sparkles",
    title: "作業者(クリエイター)",
    who: "スタッフ・映像/Web/デザインの作り手",
    description: "案件フィードで新規案件を発見・応募/担当タスクの確認",
  },
  {
    href: "/client",
    icon: "store",
    title: "クライアント",
    who: "インストラクター・教室運営者",
    description: "本部/作業者とのチャット/案件の進捗確認/物販の注文",
  },
  {
    href: "/user",
    icon: "user",
    title: "エンドユーザー",
    who: "生徒・一般のお客様",
    description: "先生の情報チェック/商品の購入/お問い合わせ",
  },
];

export default function EntrancePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-md flex-col px-6 py-10">
      {/* ヒーロー */}
      <div className="hud-corners mt-6 flex flex-col items-center gap-4 border border-ink/12 bg-white/70 px-6 py-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`${basePath}/logo.png`}
          alt="つながるCraft"
          className="h-12 w-auto"
        />
        <div className="h-px w-16 bg-aqua" />
        <p className="text-center text-[13px] leading-relaxed text-ink/60">
          顧客管理・メッセージ・案件・物販をひとつに。
          <br />
          あなたの
          <span className="font-bold text-aqua">デジタル系 総合相談窓口</span>
        </p>
      </div>

      {/* ロール選択 */}
      <div className="mt-8">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-ink/40">
          <span className="h-px w-4 bg-ink/25" />
          SELECT ROLE — 体験するユーザー
        </p>
        <div className="space-y-2.5">
          {roles.map((role) => (
            <Link
              key={role.href}
              href={role.href}
              className="sticker comic-press group flex items-center gap-4 rounded-none p-4 transition-colors hover:border-aqua"
            >
              <span className="comic-circle flex h-11 w-11 shrink-0 items-center justify-center bg-cream text-ink/70 transition-colors group-hover:border-aqua group-hover:bg-aqua-soft group-hover:text-aqua">
                <Icon name={role.icon} className="h-5.5 w-5.5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[10px] font-medium tracking-wide text-ink/40">
                  {role.who}
                </span>
                <span className="block text-[15px] font-bold tracking-wide">
                  {role.title}
                </span>
                <span className="mt-0.5 block text-[11px] leading-relaxed text-ink/50">
                  {role.description}
                </span>
              </span>
              <Icon
                name="chevron-right"
                className="h-5 w-5 shrink-0 text-ink/25 transition-all group-hover:translate-x-0.5 group-hover:text-aqua"
              />
            </Link>
          ))}
        </div>
      </div>

      <footer className="mt-auto pt-10">
        <div className="mb-4 h-px w-full bg-ink/10" />
        <p className="text-center text-[11px] leading-relaxed text-ink/40">
          プロトタイプ版 — 画面と操作感を検証するためのモックアップです。
          <br />
          データはすべてサンプルで、送信内容は保存されません。
        </p>
        <p className="mt-2 text-center text-[11px] text-ink/40">
          スマホの「ホーム画面に追加」でアプリのように使えます 📱
        </p>
      </footer>
    </main>
  );
}
