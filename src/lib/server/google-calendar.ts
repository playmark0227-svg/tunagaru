/**
 * Google Calendar 連携 (サーバー側雛形)
 *
 * ⚠️ GitHub Pages プレビューでは使われない (画面は src/lib/demo.ts のモックを使用)。
 *
 * 本実装の推奨構成:
 * - GCP でサービスアカウントを作成し、本部の Google カレンダーを
 *   サービスアカウントに共有 (閲覧+編集)
 * - アクセストークンは google-auth-library で取得 (ここでは REST 直叩きの雛形)
 *
 * 想定エンドポイント:
 * - GET  /api/calendar/availability → getAvailability()
 * - POST /api/calendar/book         → createBooking()
 */
import type { BookingSlot } from "../types";
import { bookingSlots } from "../mock-data";

const CALENDAR_API = "https://www.googleapis.com/calendar/v3";

/** 予約を受け付ける営業時間帯 (本部の運用に合わせて調整) */
export const BOOKABLE_TIMES = ["10:00", "13:00", "15:30", "19:00"];

function getConfig() {
  return {
    calendarId: process.env.GOOGLE_CALENDAR_ID ?? "primary",
    accessToken: process.env.GOOGLE_CALENDAR_ACCESS_TOKEN,
  };
}

export function isCalendarConfigured(): boolean {
  return Boolean(getConfig().accessToken);
}

/**
 * freeBusy API で本部カレンダーの予定を取得し、
 * 営業時間帯から埋まっている枠を除いた「空き枠」を返す。
 */
export async function getAvailability(
  timeMin: string,
  timeMax: string,
): Promise<BookingSlot[]> {
  const { calendarId, accessToken } = getConfig();
  if (!accessToken) {
    // 未設定時はモック枠を返す (デモモード)
    return bookingSlots;
  }

  const res = await fetch(`${CALENDAR_API}/freeBusy`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      timeZone: "Asia/Tokyo",
      items: [{ id: calendarId }],
    }),
  });

  if (!res.ok) {
    throw new Error(`freeBusy API エラー: ${res.status}`);
  }

  const data = (await res.json()) as {
    calendars: Record<string, { busy: { start: string; end: string }[] }>;
  };
  const busy = data.calendars[calendarId]?.busy ?? [];

  // TODO(本実装): timeMin〜timeMax の営業時間帯 (BOOKABLE_TIMES) を列挙し、
  // busy と重なる枠を available=false にして返す
  void busy;
  return bookingSlots;
}

/**
 * 予約確定: カレンダーに予定を作成する。
 * Zoom リンクは (a) 固定のパーソナルミーティングURL を description に入れる、
 * (b) Zoom API で都度発行する、のどちらかで運用する。
 */
export async function createBooking(input: {
  slot: BookingSlot;
  clientName: string;
  purpose: string;
}): Promise<{ eventId: string }> {
  const { calendarId, accessToken } = getConfig();
  if (!accessToken) {
    return { eventId: `demo-ev-${input.slot.id}` };
  }

  const start = `${input.slot.date}T${input.slot.time}:00+09:00`;
  const [h, m] = input.slot.time.split(":").map(Number);
  const endTime = `${String(h).padStart(2, "0")}:${String(m + 30).padStart(2, "0")}`;
  const end = `${input.slot.date}T${endTime}:00+09:00`;

  const res = await fetch(
    `${CALENDAR_API}/calendars/${encodeURIComponent(calendarId)}/events`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: `【Zoom打ち合わせ】${input.clientName}`,
        description: `目的: ${input.purpose}\n(つながるクラフト アプリからの自動予約)`,
        start: { dateTime: start, timeZone: "Asia/Tokyo" },
        end: { dateTime: end, timeZone: "Asia/Tokyo" },
      }),
    },
  );

  if (!res.ok) {
    throw new Error(`イベント作成エラー: ${res.status}`);
  }

  const event = (await res.json()) as { id: string };
  return { eventId: event.id };
}
