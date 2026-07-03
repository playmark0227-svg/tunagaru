"use client";

import { useEffect } from "react";

/**
 * PWA用 Service Worker の登録。
 * ホーム画面追加 (A2HS) の要件を満たすため、本番ビルドでのみ登録する。
 * GitHub Pages のサブパス配信に対応するため basePath を付与する。
 */
export function RegisterServiceWorker() {
  useEffect(() => {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
    if (
      process.env.NODE_ENV === "production" &&
      typeof navigator !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      navigator.serviceWorker
        .register(`${basePath}/sw.js`, { scope: `${basePath}/` })
        .catch(() => {
          // 登録失敗はプロトタイプでは致命的でないため無視
        });
    }
  }, []);

  return null;
}
