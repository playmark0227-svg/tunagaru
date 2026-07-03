/**
 * FCM (Firebase Cloud Messaging) プッシュ通知 (雛形)
 *
 * 本実装フロー:
 * 1. ユーザーが通知を許可 → enablePushNotifications() で FCM トークン取得
 * 2. トークンを Firestore の users/{uid}/fcmTokens に保存
 * 3. 本部の一斉通知やメッセージ受信時に、サーバー側
 *    (src/lib/server/notifications.ts) からトピック / トークン宛に送信
 * 4. 受信側は firebase-messaging-sw.js (Service Worker) でバックグラウンド表示
 */
import { isFirebaseConfigured, getFirebaseApp } from "./client";

export async function enablePushNotifications(): Promise<
  { ok: true; token: string } | { ok: false; reason: string }
> {
  if (!isFirebaseConfigured) {
    // デモモード: 許可ダイアログだけ再現したい場合はここを拡張
    return { ok: false, reason: "デモモードのためプッシュ通知は無効です" };
  }

  const { getMessaging, getToken, isSupported } = await import(
    "firebase/messaging"
  );

  if (!(await isSupported())) {
    return { ok: false, reason: "このブラウザはプッシュ通知に対応していません" };
  }

  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return { ok: false, reason: "通知が許可されませんでした" };
  }

  const token = await getToken(getMessaging(getFirebaseApp()), {
    vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
  });

  // TODO(本実装): token を Firestore に保存する
  return { ok: true, token };
}
