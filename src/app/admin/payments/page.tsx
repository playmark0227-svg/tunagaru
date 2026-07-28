import type { Metadata } from "next";
import { adminStats, payouts } from "@/lib/mock-data";
import { PAYOUT_STATUS_LABELS } from "@/lib/types";
import { formatYen } from "@/lib/format";
import { Badge, Card, SectionTitle, StatCard } from "@/components/ui";
import { Icon } from "@/components/icons";
import { AdminHeader } from "../header";
import { PAYOUT_TONES } from "@/lib/tones";

export const metadata: Metadata = { title: "報酬・支払管理" };

const STRIPE_FEE_RATE = 0.036;
const THIS_MONTH = "2026-07";

/** "2026-07" → "2026年7月" */
function monthLabel(month: string): string {
  const [y, m] = month.split("-");
  return `${y}年${Number(m)}月`;
}

export default function AdminPaymentsPage() {
  const thisMonthTotal = payouts
    .filter((p) => p.month === THIS_MONTH)
    .reduce((sum, p) => sum + p.amount, 0);
  const paidTotal = payouts
    .filter((p) => p.status === "paid")
    .reduce((sum, p) => sum + p.amount, 0);

  const months = [...new Set(payouts.map((p) => p.month))].sort().reverse();

  return (
    <>
      <AdminHeader title="報酬・支払管理" />

      <main className="mx-auto max-w-md space-y-6 px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        {/* 今月のサマリー */}
        <section>
          <SectionTitle title="今月の売上サマリー (2026年7月)" />
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            <StatCard
              label="今月売上"
              value={formatYen(adminStats.monthlySales)}
              sub={`先月比 ${adminStats.monthlySalesGrowth}`}
              icon="chart"
              tone="green"
            />
            <StatCard
              label="今月の案件報酬"
              value={formatYen(thisMonthTotal)}
              sub={`${payouts.filter((p) => p.month === THIS_MONTH).length}件の案件`}
              icon="briefcase"
              tone="blue"
            />
            <StatCard
              label="支払済 (累計)"
              value={formatYen(paidTotal)}
              sub="振込完了分"
              icon="credit-card"
              tone="brand"
            />
          </div>
        </section>

        {/* Stripe手数料の説明 */}
        <Card className="flex items-start gap-3 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm bg-aqua-soft text-aqua">
            <Icon name="credit-card" className="h-5 w-5" />
          </span>
          <p className="text-xs leading-relaxed text-ink/55">
            <span className="font-bold text-ink/80">
              決済手数料について
            </span>
            <br />
            Stripe決済手数料 3.6% を控除した金額が実際の振込額になります。
            請求書の発行・振込処理は毎月末に自動で行われます。
          </p>
        </Card>

        {/* 月別の支払一覧 */}
        {months.map((month) => (
          <section key={month}>
            <SectionTitle title={`${monthLabel(month)}の支払`} />
            <div className="space-y-3">
              {payouts
                .filter((p) => p.month === month)
                .map((p) => {
                  const fee = Math.round(p.amount * STRIPE_FEE_RATE);
                  const net = p.amount - fee;
                  return (
                    <Card key={p.id} className="p-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-bold leading-snug">
                            {p.projectTitle}
                          </p>
                          <p className="mt-0.5 text-xs text-ink/40">
                            {p.clientName} 様
                          </p>
                        </div>
                        <Badge tone={PAYOUT_TONES[p.status]}>
                          {PAYOUT_STATUS_LABELS[p.status]}
                        </Badge>
                      </div>
                      <div className="mt-3 space-y-1 rounded-sm bg-cream px-3 py-2.5 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="text-ink/55">報酬額</span>
                          <span className="font-semibold text-ink/80">
                            {formatYen(p.amount)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-ink/55">
                            Stripe手数料 (3.6%)
                          </span>
                          <span className="font-semibold text-rose-500">
                            −{formatYen(fee)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between border-t border-ink/10 pt-1.5">
                          <span className="font-bold text-ink/80">
                            振込額
                          </span>
                          <span className="text-sm font-bold text-aqua">
                            {formatYen(net)}
                          </span>
                        </div>
                      </div>
                    </Card>
                  );
                })}
            </div>
          </section>
        ))}
      </main>
    </>
  );
}
