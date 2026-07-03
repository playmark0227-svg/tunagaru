/**
 * 手描き風のあしらい (ドゥードゥル) SVG
 * イラストチックな世界観を作る装飾パーツ。飾りなので aria-hidden。
 */

export function DoodleStar({ className = "h-6 w-6 text-butter" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path
        d="M12 3c.6 3.4 2 5.6 5.4 6.4-3.4 1.3-4.8 3.3-5.4 7-.6-3.7-2-5.7-5.4-7C10 8.6 11.4 6.4 12 3Z"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DoodleSquiggle({ className = "h-3 w-16 text-brand/40" }: { className?: string }) {
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

export function DoodleLoop({ className = "h-8 w-8 text-peach" }: { className?: string }) {
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

export function DoodleSparkles({ className = "text-butter" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className} aria-hidden="true">
      <path
        d="M20 6c.5 2.8 1.7 4.6 4.4 5.2-2.7 1-3.9 2.7-4.4 5.7-.5-3-1.7-4.7-4.4-5.7 2.7-.6 3.9-2.4 4.4-5.2Z"
        fill="currentColor"
      />
      <circle cx="31" cy="12" r="1.6" fill="currentColor" />
      <circle cx="9" cy="24" r="1.4" fill="currentColor" />
      <path
        d="M30 26c.3 1.8 1.1 3 2.9 3.4-1.8.6-2.6 1.7-2.9 3.6-.3-1.9-1.1-3-2.9-3.6 1.8-.4 2.6-1.6 2.9-3.4Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** ステッチ (破線) の区切り — ロゴの意匠 */
export function StitchDivider({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`h-0.5 w-full border-t-[3px] border-dashed border-brand/25 ${className}`}
    />
  );
}
