/**
 * デモモード用のクライアントサイドAPI
 *
 * GitHub Pages は静的ホスティングのためサーバー処理 (API Route) が使えない。
 * プロトタイプではこのモジュールが「本来はサーバーで行う処理」を擬似的に再現する。
 *
 * 本実装 (Firebase Hosting / Vercel) では、ここを fetch("/api/...") に差し替え、
 * サーバー側は src/lib/server/ の雛形を API Route / Cloud Functions として実装する。
 */
import { bookingSlots } from "./mock-data";
import type { BookingSlot, OrderItem } from "./types";

/** 疑似的な通信待ち時間 */
function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Stripe Checkout の代替 (デモ)。
 * 本実装: POST /api/checkout → Stripe Checkout Session を作成し session.url へ遷移。
 * 決済完了の webhook で注文を Firestore に保存し、本部へ自動発注を起こす。
 */
export async function demoCheckout(
  items: OrderItem[],
): Promise<{ ok: true; orderId: string; total: number }> {
  await wait(900);
  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  return { ok: true, orderId: "demo-o9999", total };
}

/**
 * Google Calendar 空き枠取得の代替 (デモ)。
 * 本実装: GET /api/calendar/availability → freeBusy API で本部カレンダーの
 * 空き時間を計算して返す (src/lib/server/google-calendar.ts 参照)。
 */
export async function fetchAvailability(): Promise<BookingSlot[]> {
  await wait(600);
  return bookingSlots;
}

/**
 * Zoom打ち合わせ予約の代替 (デモ)。
 * 本実装: POST /api/calendar/book → カレンダーに予定を作成し、
 * Zoomリンクを発行してチャット/プッシュ通知で双方に共有する。
 */
export async function demoBookSlot(
  slot: BookingSlot,
  purpose: string,
): Promise<{ ok: true; eventId: string; zoomUrl: string }> {
  void purpose;
  await wait(900);
  return {
    ok: true,
    eventId: `demo-ev-${slot.id}`,
    zoomUrl: "https://zoom.us/j/demo123456789",
  };
}

/**
 * プッシュ通知一斉送信の代替 (デモ)。
 * 本実装: POST /api/notifications → FCM トピック配信
 * (src/lib/server/notifications.ts 参照)。
 */
export async function demoSendAnnouncement(input: {
  title: string;
  body: string;
  target: string;
}): Promise<{ ok: true; queued: number }> {
  void input;
  await wait(900);
  return { ok: true, queued: 106 };
}
