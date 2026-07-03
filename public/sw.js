/**
 * つながるクラフト PWA Service Worker (プロトタイプ版)
 * - ホーム画面追加の要件を満たす最小構成
 * - 本実装では Workbox + FCM (firebase-messaging-sw.js) に置き換える
 */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// fetch ハンドラ (インストール可能条件のため必須)。ネットワーク素通し。
self.addEventListener("fetch", (event) => {
  event.respondWith(fetch(event.request));
});
