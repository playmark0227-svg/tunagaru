"use client";

import { useEffect, useState } from "react";

/**
 * 数値のカウントアップ表示 (KPIカード用)
 * "¥342,100" "6社" のような文字列から数値部分を検出し、
 * マウント時に 0 → 値 までイージング付きでカウントアップする。
 * 数値が見つからない場合・モーション低減設定時はそのまま表示。
 */
export function AnimatedValue({
  value,
  duration = 750,
}: {
  value: string;
  duration?: number;
}) {
  const match = value.match(/^([^\d]*)([\d,]+)(.*)$/);
  const target = match ? parseInt(match[2].replace(/,/g, ""), 10) : NaN;

  const [display, setDisplay] = useState(() =>
    match && !Number.isNaN(target) ? `${match[1]}0${match[3]}` : value,
  );

  useEffect(() => {
    if (!match || Number.isNaN(target)) {
      setDisplay(value);
      return;
    }
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setDisplay(value);
      return;
    }

    const [, prefix, , suffix] = match;
    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
      const current = Math.round(target * eased);
      setDisplay(`${prefix}${current.toLocaleString("ja-JP")}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <>{display}</>;
}
