/**
 * プッシュ通知送信 (サーバー側雛形)
 *
 * ⚠️ GitHub Pages プレビューでは使われない (画面は src/lib/demo.ts のモックを使用)。
 *
 * 本実装:
 * - firebase-admin SDK (要追加: npm i firebase-admin) を Cloud Functions /
 *   API Route で初期化し、FCM で送信する
 * - 一斉通知はトピック配信 (例: topic "clients", "client-c1-users")
 * - 個別メッセージ通知は users/{uid}/fcmTokens 宛に送信
 *
 * 想定エンドポイント: POST /api/notifications
 */

export interface PushPayload {
  title: string;
  body: string;
  /** "clients" | "endUsers" | `client-${clientId}-users` などのトピック */
  topic: string;
  /** タップ時に開くパス 例: "/client/projects/p4" */
  link?: string;
}

export async function sendPushToTopic(
  payload: PushPayload,
): Promise<{ ok: boolean; messageId?: string }> {
  // TODO(本実装): firebase-admin を導入して以下を有効化する
  //
  // import { getMessaging } from "firebase-admin/messaging";
  // const messageId = await getMessaging().send({
  //   topic: payload.topic,
  //   notification: { title: payload.title, body: payload.body },
  //   webpush: {
  //     fcmOptions: { link: payload.link ?? "/" },
  //   },
  // });
  // return { ok: true, messageId };

  console.info("[demo] push notification:", payload);
  return { ok: true };
}
