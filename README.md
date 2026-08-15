# つながるCraft プラットフォーム(プロトタイプ)

顧客管理・メッセージ・案件管理・物販(B2B2C)をひとつのアプリに集約する
「繋がるクラフト」のプラットフォーム。まずは操作感を検証するための
**ビジュアルモックアップ(Phase 1)** です。

## 🔍 プレビュー

GitHub Pages で公開されます(push のたびに自動デプロイ):

**https://playmark0227-svg.github.io/tunagaru/**

> **初回のみ手動設定が必要です**(GitHub の仕様上、Pages の初回有効化はリポジトリ所有者しか行えません):
> リポジトリの **Settings → Pages → Build and deployment → Source = 「Deploy from a branch」→ Branch = `gh-pages` / `(root)` → Save**。
> 以降は push のたびに自動でビルド&公開されます。

スマートフォンでは「ホーム画面に追加」でネイティブアプリのように使えます(PWA)。

## 体験できる3つの立場

> **2026-08 の方針転換:** 打ち合わせの結果、「顧客」と「作業者」は別人ではなく
> **同一人物が兼ねる**ことが判明したため、両者を「メンバー」に統合しました。

| 立場 | 入口 | できること |
| --- | --- | --- |
| 本部 | `/admin` | 顧客ごとのチャットを一元管理・案件の発注と担当割り・**マージン管理**・全体配信・受発注・報酬管理 |
| メンバー(顧客 兼 スタッフ) | `/member` | 全体配信タイムライン・本部とのチャット/個別DM・自分の案件の進捗・**スタッフなら案件に応募**・仕入れ・生徒管理・Zoom予約 |
| エンドユーザー | `/user` | 先生のお知らせ・商品購入(決済デモ)・注文追跡・問い合わせ |

### 設計上の必須要件 — マージンを作業者に見せない

案件は**顧客への提示額 (`clientPrice`) と作業者への支払額 (`workerPrice`) を別々に持ちます**。
差額が本部のマージンになるため、作業者の画面へ渡す前に必ず `toStaffView()` を通し、
`clientPrice` をサーバー側で落とします。マージンを表示してよいのは本部画面だけです。

## 開発

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 静的エクスポート (out/)
npm run typecheck  # 型チェック (tsc --noEmit)
npm run lint       # ESLint (next + TypeScript)
```

### 実装上の約束ごと

画面をまたいだ表記ゆれを防ぐため、以下は必ず共通モジュールを経由します。

| 用途 | モジュール | 例 |
| --- | --- | --- |
| 日付・金額の表示 | `src/lib/format.ts` | `formatMd("2026-07-04")` → `7/4` |
| バッジの配色 | `src/lib/tones.ts` | `PROJECT_STATUS_TONES.open` → `brand` |
| 共通UI | `src/components/ui.tsx` | `Card` / `Badge` / `UnreadBadge` ほか |

画面内でこれらを再定義しないでください(同じ意味が別の色・別の書式で
表示される原因になります)。

データはすべて `src/lib/mock-data.ts` のサンプルです。Firebase / Stripe /
Google Calendar は雛形のみ実装済みで、`.env.example` のキーを設定すると
本接続に切り替えられる構造になっています(詳細: `docs/architecture.md`)。

## ドキュメント

- [画面構成案](docs/screen-plan.md) — 4ロールの全画面と主要ユーザーフロー
- [技術構成](docs/architecture.md) — フェーズ戦略 / Firestore設計 / Stripe / Google Calendar / FCM
