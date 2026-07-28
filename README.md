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

## 体験できる4つの視点

| ロール | 入口 | できること |
| --- | --- | --- |
| マスター管理者(本部) | `/admin` | ダッシュボード(AIダイジェスト)・顧客一覧・案件発行・**担当一覧**・受発注/EC連携・報酬管理・一斉通知・ビジュアル管理 |
| 作業者(クリエイター) | `/worker` | Instagram風の案件フィードで発見・応募/案件ごとの担当タスク/チャット |
| クライアント | `/client` | 案件応募・案件ごとのタスク/チャット・生徒管理・仕入れ・Zoom予約 |
| エンドユーザー | `/user` | 先生のお知らせ・商品購入(決済デモ)・注文追跡・問い合わせ |

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
