import { PageHeader } from "@/components/ui";
import { ProjectTabs } from "./tabs";

export const metadata = { title: "案件一覧" };

export default function ClientProjectsPage() {
  return (
    <>
      <PageHeader title="案件" />
      <main className="px-4 pb-24 pt-4">
        <ProjectTabs />
      </main>
    </>
  );
}
