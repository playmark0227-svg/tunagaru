"use client";

import Link from "next/link";
import { useState } from "react";
import { Icon } from "@/components/icons";

/**
 * カート追加ボタン (固定フッター)
 * プロトタイプではローカルstateで「追加しました」を再現。
 * 本実装ではカート状態 (Context / Firestore) に反映する。
 */
export function AddToCartButton({ disabled }: { disabled?: boolean }) {
  const [added, setAdded] = useState(false);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t-[2.5px] border-ink bg-white p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] backdrop-blur">
      <div className="mx-auto max-w-md">
        {added ? (
          <div className="space-y-2">
            <div className="flex items-center justify-center gap-1.5 text-sm font-semibold text-emerald-600">
              <Icon name="check" className="h-4 w-4" />
              カートに追加しました
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setAdded(false)}
                className="flex-1 rounded-full border border-stone-300 py-3 text-sm font-bold text-stone-600"
              >
                買い物を続ける
              </button>
              <Link
                href="/user/cart"
                className="flex-1 rounded-full bg-brand py-3 text-center text-sm font-bold text-white active:bg-brand-dark"
              >
                カートを見る
              </Link>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setAdded(true)}
            disabled={disabled}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 text-sm font-bold text-white transition-colors active:bg-brand-dark disabled:opacity-40"
          >
            <Icon name="cart" className="h-5 w-5" />
            {disabled ? "在庫切れ" : "カートに入れる"}
          </button>
        )}
      </div>
    </div>
  );
}
