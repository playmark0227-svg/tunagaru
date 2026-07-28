/**
 * 表示フォーマット共通ヘルパー
 *
 * 日付は Firestore/API から "2026-07-04" (ISO) で受け取る想定。
 * 画面にそのまま出すと冗長なので、必ずこのモジュールを通して整形する。
 * (各画面に同じ関数を書くと表記ゆれが起きるため、ここに集約)
 */

/** プロトタイプで「今日」とみなす日付 (モックデータの基準日) */
export const MOCK_TODAY = "2026-07-03";

/** 金額を "¥4,950" 形式にフォーマット */
export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}

/** "2026-07-04" → "7/4" (一覧・バッジ等の省略表記) */
export function formatMd(date: string): string {
  const [, m, d] = date.split("-");
  return `${Number(m)}/${Number(d)}`;
}

/** "2026-07-04" → "2026年7月4日" (詳細・登録日等の正式表記) */
export function formatDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${Number(y)}年${Number(m)}月${Number(d)}日`;
}

/** "2026-07" → "2026年7月" (月次サマリー用) */
export function formatMonth(month: string): string {
  const [y, m] = month.split("-");
  return `${Number(y)}年${Number(m)}月`;
}

/** 基準日 (MOCK_TODAY) から対象日までの残り日数。過去なら負数 */
export function daysUntil(date: string): number {
  const today = new Date(`${MOCK_TODAY}T00:00:00+09:00`).getTime();
  const target = new Date(`${date}T00:00:00+09:00`).getTime();
  return Math.round((target - today) / 86400000);
}

/**
 * 締切までの残り日数を人が読める形に。
 * 例: "今日まで" / "あと3日" / "3日超過"
 */
export function formatDeadline(date: string): string {
  const days = daysUntil(date);
  if (days === 0) return "今日まで";
  if (days > 0) return `あと${days}日`;
  return `${Math.abs(days)}日超過`;
}
