import Link from "next/link";
import { Icon, type IconName } from "@/components/icons";

/**
 * エントランス: ロール選択画面 (プロトタイプ用)
 *
 * ▼ 2026-08 打ち合わせでの方針転換
 * 以前は「クライアント」と「作業者」を別の入口にしていたが、実際には
 * 顧客がそのままスタッフを兼ねているため、両者を「メンバー」に統合した。
 * 本実装ではログイン後にロールで自動振り分けされ、この画面は無くなる。
 */

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
    title: "本部",
    who: "繋がるクラフト",
    description:
      "顧客ごとのチャットを一元管理/案件の発注と担当割り/マージン管理/全体配信",
  },
  {
    href: "/member",
    icon: "users",
    title: "メンバー",
    who: "顧客 兼 スタッフ",
    description:
      "本部とのやりとり/自分の案件の進捗確認/スタッフとして案件に応募",
  },
  {
    href: "/user",
    icon: "user",
    title: "エンドユーザー",
    who: "メンバーの先にいるお客様",
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
          バラバラのやりとりを、ひとつに。
          <br />
          あなたの
          <span className="font-bold text-aqua">デジタル系 総合相談窓口</span>
        </p>
      </div>

      {/* ロール選択 */}
      <div className="mt-8">
        <p className="mb-3 flex items-center gap-2 text-[11px] font-medium tracking-[0.2em] text-ink/40">
          <span className="h-px w-4 bg-ink/25" />
          SELECT ROLE — 体験する立場
        </p>
        <div className="stagger space-y-2.5">
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

      {/* 統合についての補足 */}
      <div className="mt-6 border border-aqua/40 bg-aqua-soft px-4 py-3">
        <p className="text-[11px] leading-relaxed text-ink/70">
          <span className="font-bold">「メンバー」について:</span>{" "}
          つながるCraftでは<strong>お客様がそのままスタッフを兼ねる</strong>
          ため、顧客用と作業者用の入口を分けず1つにまとめています。
          スタッフ権限のある方だけ「案件」タブが表示されます。
        </p>
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
