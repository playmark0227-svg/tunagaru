/**
 * 画面遷移アニメーション
 * template はルート遷移のたびに再マウントされるため、
 * マウント時のCSSアニメーションがそのままページトランジションになる。
 * (レイアウト内の下部タブ/サイドバーは固定のまま、コンテンツだけが動く)
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-page-in">{children}</div>;
}
