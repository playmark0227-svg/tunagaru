"use client";

import { useState } from "react";
import { Icon } from "@/components/icons";
import { Card } from "@/components/ui";

/** プッシュ通知トグル (デモ) */
export function PushToggle() {
  const [on, setOn] = useState(false);
  return (
    <Card className="p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-soft text-brand">
          <Icon name="bell" className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-sm font-bold">プッシュ通知</p>
          <p className="text-[11px] text-stone-500">
            先生からのお知らせや発送通知を受け取る
          </p>
        </div>
        <button
          onClick={() => setOn((v) => !v)}
          role="switch"
          aria-checked={on}
          aria-label="プッシュ通知の切り替え"
          className={`relative h-7 w-12 shrink-0 rounded-full transition-colors ${
            on ? "bg-brand" : "bg-stone-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              on ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
      {on && (
        <p className="mt-3 rounded-xl bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
          ✓ この端末に通知が届きます(デモ)。本実装では Firebase Cloud Messaging
          で配信されます。
        </p>
      )}
    </Card>
  );
}

/** よくある質問 (アコーディオン) */
const faqs = [
  {
    q: "商品はどのように届きますか?",
    a: "ご注文は先生の教室を通じて本部から発送され、3〜5営業日でお手元に届きます。",
  },
  {
    q: "支払い方法は?",
    a: "クレジットカード決済(Stripe)に対応予定です。本プロトタイプでは実際の請求は発生しません。",
  },
  {
    q: "体験レッスンを申し込みたい",
    a: "メッセージから先生に直接ご相談いただけます。空き状況をご案内します。",
  },
];

export function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <Card className="divide-y divide-stone-100">
      {faqs.map((faq, i) => (
        <div key={i}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center gap-2 px-4 py-3.5 text-left"
          >
            <span className="flex-1 text-sm font-semibold">{faq.q}</span>
            <Icon
              name="chevron-right"
              className={`h-4 w-4 shrink-0 text-stone-400 transition-transform ${
                open === i ? "rotate-90" : ""
              }`}
            />
          </button>
          {open === i && (
            <p className="px-4 pb-4 text-xs leading-relaxed text-stone-500">
              {faq.a}
            </p>
          )}
        </div>
      ))}
    </Card>
  );
}
