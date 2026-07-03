# 技術構成 — 繋がるクラフト・プラットフォーム

## フェーズ戦略(プロトタイプ先行型)

| フェーズ | 内容 | ホスティング |
| --- | --- | --- |
| **Phase 1 (今ここ)** | ビジュアルモックアップで操作感を検証。全データはモック、送信は擬似動作 | **GitHub Pages** (静的エクスポート) |
| Phase 2 | Firebase 導入: Auth(3階層ロール)・Firestore・FCM プッシュ通知 | Firebase Hosting / Vercel |
| Phase 3 | Stripe 決済 + 自動発注 webhook、Google Calendar 予約 | 同上 + Cloud Functions |
| Phase 4 | 運用改善: ビジュアル管理(ノーコード編集)、分析、iOS/Android ストア配信(必要なら Capacitor) |

Phase 1 は `next.config.mjs` の `output: "export"` により完全静的化している。
Phase 2 移行時は `output` と `basePath` を外し、`src/lib/demo.ts` の呼び出しを
API Route (`src/lib/server/` の雛形) + Firestore 購読に差し替えるだけでよい。

## ディレクトリ構成

```
src/
├── app/
│   ├── page.tsx            # エントランス (ロール選択 → 本実装ではログイン)
│   ├── admin/              # マスター管理者 (本部)
│   ├── client/             # 管理者 (クライアント/インストラクター)
│   └── user/               # エンドユーザー (生徒・一般顧客)
├── components/             # 共通UI (nav / ui / chat / icons)
└── lib/
    ├── types.ts            # ドメイン型 = Firestore ドキュメント型
    ├── mock-data.ts        # Phase 1 のモックデータ (Firestoreに置換予定)
    ├── demo.ts             # 擬似API (Phase 2 で fetch("/api/...") に差し替え)
    ├── firebase/           # Firebase クライアントSDK 雛形 (Auth/Firestore/FCM)
    └── server/             # サーバー側雛形 (Stripe / Google Calendar / FCM送信)
```

## Firestore データモデル(Phase 2)

```
users/{uid}                 # role: "master" | "client" | "endUser" (カスタムクレームと二重管理)
  └─ fcmTokens/{token}
clients/{clientId}          # 教室・サロン情報。ownerUid で users と紐付け
endUsers/{endUserId}        # clientId で所属教室と紐付け
projects/{projectId}        # 案件。status: open / in_progress / done
  └─ applications/{clientId}  # 応募 (サブコレクション)
tasks/{taskId}              # 修正依頼・Zoom予約等。projectId / clientId で参照
products/{productId}        # price (一般) / wholesalePrice (卸)
orders/{orderId}            # B2B2C: endUserId + clientId + status パイプライン
threads/{threadId}          # kind: hq_client / client_user / group, memberUids[]
  └─ messages/{messageId}
announcements/{id}          # 本部の一斉通知履歴
payouts/{id}                # 報酬・支払
settings/visual             # ビジュアル管理 (ノーコード編集対象)
```

### セキュリティルールの方針

- `master` は全読み書き可
- `client` は自分の `clients/{id}` と、`clientId` が一致する endUsers / orders / threads のみ
- `endUser` は自分のドキュメントと所属教室の公開情報・商品のみ
- ロールは Cloud Functions で付与する **カスタムクレーム** で判定(クライアント偽装不可)

## 決済 (Stripe) — `src/lib/server/stripe.ts`

1. `/user/cart` → `POST /api/checkout` → Checkout Session 作成(`metadata` に clientId / endUserId)
2. 決済完了 → `POST /api/webhooks/stripe` → 注文を Firestore に作成 (`status: received`)
3. 同時に **本部へ自動発注** (`status: ordered_to_hq`) + 本部・クライアント・購入者へ FCM 通知
4. 手数料: 国内カード 3.6% を価格設定に織り込む。クライアントへの売上分配が必要になったら **Stripe Connect** を導入

## Google Calendar 連携 — `src/lib/server/google-calendar.ts`

- サービスアカウントに本部カレンダーを共有し、`freeBusy` で空き枠を計算 → `/client/booking` に表示
- 予約確定で `events.insert`。Zoom リンクは固定PMI か Zoom API で発行し、チャット + プッシュで双方に共有

## プッシュ通知 (FCM) — `src/lib/server/notifications.ts`

- 一斉通知: トピック配信 (`clients`, `client-{id}-users`)
- 個別: メッセージ受信時に相手の `fcmTokens` へ送信
- PWA のためバックグラウンド受信は `firebase-messaging-sw.js` (Phase 2 で `public/sw.js` を置換)

## GitHub Pages プレビュー (Phase 1)

- `.github/workflows/deploy-pages.yml` が push のたびに自動ビルドし、成果物 (`out/`) を
  **`gh-pages` ブランチ**へ公開する (`peaceiris/actions-gh-pages`)。
  非デフォルトブランチ (`claude/**`) からでも確実にデプロイできるブランチ方式を採用。
- 公開URL: `https://<owner>.github.io/tunagaru/` (basePath = `/tunagaru`)
- **初回のみ手動設定が必要**: リポジトリ Settings → Pages → Source =
  「Deploy from a branch」→ Branch = `gh-pages` / `(root)` → Save。
  (GitHub の仕様上、Pages の初回有効化は Actions のトークンでは行えず、
  リポジトリ所有者の手動操作が必須。以降の再デプロイは全自動)

## コスト試算(目安)

| 項目 | 月額 |
| --- | --- |
| GitHub Pages (Phase 1) | ¥0 |
| Firebase Spark→Blaze (〜数百ユーザー) | ¥0〜数百円 |
| Stripe | 決済額の 3.6% のみ |
| Vercel Hobby / Firebase Hosting | ¥0〜 |

初期開発をプロトタイプ先行 + サーバーレス構成にすることで、100万円以下の開発予算と低ランニングコストを両立する。
