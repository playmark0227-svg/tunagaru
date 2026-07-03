/**
 * コミック風の一本線ドゥードゥル (スヌーピー的な世界観のあしらい)
 * 犬小屋・骨・足あと・雲・ジグザグなど。飾りなので aria-hidden。
 */

/** 犬小屋 (赤い屋根) */
export function DoodleDoghouse({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M8 22 24 8l16 14" stroke="#262b47" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#ef6351" />
      <path d="M11 22v18h26V22" stroke="#262b47" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#fff" />
      <path d="M20 40V30a4 4 0 0 1 8 0v10" stroke="#262b47" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="#262b47" />
    </svg>
  );
}

/** 骨 */
export function DoodleBone({ className = "h-6 w-9" }: { className?: string }) {
  return (
    <svg viewBox="0 0 36 20" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 7a3.5 3.5 0 1 1 4-3.4h12A3.5 3.5 0 1 1 28 7a3.5 3.5 0 1 1-4 3.4H12A3.5 3.5 0 1 1 8 7Z"
        transform="translate(0 4)"
        fill="#fff"
        stroke="#262b47"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 足あと */
export function DoodlePaw({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="#262b47" className={className} aria-hidden="true">
      <ellipse cx="12" cy="16" rx="5" ry="4.2" />
      <circle cx="5.5" cy="10" r="2.3" />
      <circle cx="10" cy="6.6" r="2.3" />
      <circle cx="15" cy="6.8" r="2.3" />
      <circle cx="19" cy="10.5" r="2.2" />
    </svg>
  );
}

/** 雲 (一本線) */
export function DoodleCloud({ className = "h-8 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 28" fill="none" className={className} aria-hidden="true">
      <path
        d="M10 22a6 6 0 0 1 1-11.8A8 8 0 0 1 26 7a7 7 0 0 1 11 5.6A5.2 5.2 0 0 1 38 22H10Z"
        fill="#fff"
        stroke="#262b47"
        strokeWidth="2.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 星 (手描き) */
export function DoodleStar({ className = "h-6 w-6 text-butter" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3c.6 3.4 2 5.6 5.4 6.4-3.4 1.3-4.8 3.3-5.4 7-.6-3.7-2-5.7-5.4-7C10 8.6 11.4 6.4 12 3Z"
        fill="currentColor"
        stroke="#262b47"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** キラキラ */
export function DoodleSparkles({ className = "text-butter" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 6c.5 2.8 1.7 4.6 4.4 5.2-2.7 1-3.9 2.7-4.4 5.7-.5-3-1.7-4.7-4.4-5.7 2.7-.6 3.9-2.4 4.4-5.2Z"
        fill="currentColor"
        stroke="#262b47"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <circle cx="31" cy="12" r="1.6" fill="#262b47" />
      <circle cx="9" cy="24" r="1.4" fill="#262b47" />
      <path
        d="M30 26c.3 1.8 1.1 3 2.9 3.4-1.8.6-2.6 1.7-2.9 3.6-.3-1.9-1.1-3-2.9-3.6 1.8-.4 2.6-1.6 2.9-3.4Z"
        fill="currentColor"
        stroke="#262b47"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** くるり線 */
export function DoodleLoop({ className = "h-8 w-8 text-ink/50" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
      <path
        d="M4 22c8 4 16 2 18-4 1.6-4.8-2.6-8.4-6.4-6-3.6 2.2-2.4 8 2.4 10 5 2 9-1 10.5-5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** なみなみ線 */
export function DoodleSquiggle({ className = "h-3 w-16 text-ink/40" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 12" fill="none" className={className} aria-hidden="true">
      <path
        d="M2 8c5-6 9-6 14 0s9 6 14 0 9-6 14 0 9 6 18 0"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** ジグザグの区切り (チャーリー・ブラウンのあの柄) */
export function ZigzagDivider({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 320 14"
      preserveAspectRatio="none"
      className={`h-3 w-full text-ink ${className}`}
      aria-hidden="true"
    >
      <path
        d="M0 12 16 2l16 10L48 2l16 10L80 2l16 10L112 2l16 10L144 2l16 10L176 2l16 10L208 2l16 10L240 2l16 10L272 2l16 10L304 2l16 10"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** 旧テーマ互換エイリアス */
export function StitchDivider({ className = "" }: { className?: string }) {
  return <ZigzagDivider className={className} />;
}
