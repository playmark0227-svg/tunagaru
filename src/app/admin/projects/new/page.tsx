import type { Metadata } from "next";
import { AdminHeader } from "../../header";
import { NewProjectForm } from "./new-project-form";

export const metadata: Metadata = { title: "案件作成" };

export default function AdminNewProjectPage() {
  return (
    <>
      <AdminHeader title="案件作成" backHref="/admin/projects" />
      <main className="mx-auto max-w-md px-4 pb-24 pt-4 md:max-w-2xl md:px-8 md:pb-12 md:pt-6">
        <NewProjectForm />
      </main>
    </>
  );
}
