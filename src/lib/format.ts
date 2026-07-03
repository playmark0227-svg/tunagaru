/** 金額を "¥4,950" 形式にフォーマット */
export function formatYen(amount: number): string {
  return `¥${amount.toLocaleString("ja-JP")}`;
}
