import type { Metadata } from "next";
import { PageHeader } from "@/components/ui";
import { currentMember, projects } from "@/lib/mock-data";
import { toStaffView } from "@/lib/types";
import { StaffProjectFeed } from "./feed";

export const metadata: Metadata = { title: "案件" };

/**
 * 案件募集ページ (スタッフ限定)
 *
 * ▼ 2026-08 打ち合わせ — この画面が分離されている理由
 * 顧客への提示額と作業者への支払額の差が本部のマージンになる。
 * 同じ画面に並ぶと差額が推測できてしまうため、
 * 「スタッフだけが見えるページ」と「顧客も見えるページ」を分ける。
 *
 * サーバー側で toStaffView() を通し、顧客提示額(clientPrice)は
 * そもそもクライアントコンポーネントへ渡さない。
 */
export default function MemberProjectsPage() {
  // スタッフ以外はこのページに来ない導線だが、念のため空表示にする
  if (!currentMember.isStaff) {
    return (
      <>
        <PageHeader title="案件" />
        <main className="px-4 pb-24 pt-4">
          <p className="text-sm text-ink/55">
            案件募集はスタッフの方のみご覧いただけます。
          </p>
        </main>
      </>
    );
  }

  // ここで顧客提示額を落とす。以降のコードは金額を1種類しか持たない。
  const staffProjects = projects.map(toStaffView);

  return (
    <>
      <PageHeader title="案件" />
      <StaffProjectFeed projects={staffProjects} myId={currentMember.id} />
    </>
  );
}
