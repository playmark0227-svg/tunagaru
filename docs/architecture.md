# 技術構成 — 繋がるクラフト・プラットフォーム

## フェーズ戦略(プロトタイプ先行型)

まずAIなしの「一元管理・チャット・タスク表示」をコア機能として早期に完成させ、
その後のアップデートでAI機能・EC連携を追加する。

| フェーズ | 内容 | ホスティング |
| --- | --- | --- |
| **Phase 1 (今ここ)** | ビジュアルモックアップで操作感を検証。全データはモック、送信は擬似動作 | **GitHub Pages** (静的エクスポート) |
| **Phase 2 (コア)** | Firebase 導入: Auth(本部/作業者/クライアントの3階層ロール)・Firestore(チャット/タスク/案件フィード)・FCM プッシュ通知。**一元管理・チャット・タスク表示をここで完成させる** | Firebase Hosting / Vercel |
| Phase 3 | Stripe 決済 + 自動発注 webhook、Google Calendar 予約、**外部EC(BASE)webhook連携**、**AIアシスタント**(タスク自動抽出・朝のダイジェスト・文面バッファー) | 同上 + Cloud Functions |
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

## Firestore データモデル — AI導入を見据えた設計(Phase 2〜3)

将来のAI機能 (タスク自動抽出・朝のダイジェスト・文面バッファー) が
**後付けできる**よう、メッセージ・タスク・イベントを正規化して蓄積する。

```
users/{uid}                 # role: "master" | "worker" | "client" | "endUser"
  └─ fcmTokens/{token}      #   (カスタムクレームと二重管理)
workers/{workerId}          # 作業者: specialties[], completedCount, ownerUid
clients/{clientId}          # 教室・サロン情報。ownerUid で users と紐付け
endUsers/{endUserId}        # clientId で所属教室と紐付け

projects/{projectId}        # 案件 = フィード投稿。category / forWorkers / likes /
  │                         #   emoji / gradient (フィード用ビジュアル)
  └─ applications/{uid}     # 応募 (クライアント/作業者 共通)

threads/{threadId}          # kind: hq_client / hq_worker / client_user / group
  │                         # ★projectId / category を持ち「案件ごとに分離」を強制
  └─ messages/{messageId}   # body, senderUid, sentAt
                            # ★taskifiedTaskId: タスク化済みならそのID (転記忘れ防止の記録)
                            # ★aiAnalyzedAt: AI走査済みマーカー (Phase 3)

tasks/{taskId}              # title, kind, status, dueDate, assigneeUid
                            # ★source: "manual" | "chat" | "ai" | "ec" (発生源を記録)
                            # ★sourceRef: 元メッセージ/EC通知への参照パス
                            # projectId / clientId / workerId で案件・担当に紐付け

events/{eventId}            # ★横断イベントログ (追記専用)
                            #   type: message_sent / task_created / order_placed /
                            #         ec_sale_received / application_submitted ...
                            #   AIダイジェストはこのログを毎朝集計して生成する

ecNotifications/{id}        # ★BASE等のwebhook受信レコード → taskCreated フラグ
aiInsights/{date}           # ★朝のダイジェスト生成結果 (kind, text, href)[]

products/{productId}        # price (一般) / wholesalePrice (卸)
orders/{orderId}            # B2B2C: endUserId + clientId + status パイプライン
announcements/{id}          # 本部の一斉通知履歴 (target: all / workers / clients)
payouts/{id}                # 報酬・支払
settings/visual             # ビジュアル管理 (ノーコード編集対象)
```

### AI機能がこの設計に乗る仕組み (Phase 3)

1. **タスク自動抽出**: Cloud Functions が `messages` の新規ドキュメントを監視 →
   LLM (Claude API) で「依頼・約束・期限」を検出 → `tasks` に `source: "ai"` の
   下書きを作成し、担当者に確認通知。`sourceRef` で元メッセージへ遡れる。
2. **朝のダイジェスト**: 毎朝のスケジュール実行で `events` + `tasks` を集計 →
   期限超過 / 返信待ち / 未完了を `aiInsights/{date}` に保存 → 本部ダッシュボードに表示 + プッシュ。
3. **文面バッファー**: 作業者⇄クライアントの直接やり取りで、送信前にLLMが
   文面をビジネス調に整えるオプション (クライアント側 UI に「AIで整える」ボタン)。

### セキュリティルールの方針

- `master` は全読み書き可
- `worker` は自分がメンバーの threads / 自分の tasks / forWorkers=true の projects のみ
- `client` は自分の `clients/{id}` と、`clientId` が一致する endUsers / orders / threads のみ
- `endUser` は自分のドキュメントと所属教室の公開情報・商品のみ
- ロールは Cloud Functions で付与する **カスタムクレーム** で判定(クライアント偽装不可)

## 外部EC (BASE) 連携 (Phase 3)

1. BASE Developers の Webhook (注文作成) を Cloud Functions で受信
2. `ecNotifications` に保存 + 本部へプッシュ通知
3. `/admin/orders` の ECパネルからワンタップで発送タスク作成 (`source: "ec"`)
   — 在庫数の自動減算もここで行う
4. STORES 等の他モールも同じ `ecNotifications` スキーマに正規化して追加可能

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
