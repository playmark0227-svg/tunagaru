import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@/components/icons";
import { AdminHeader } from "../header";
import { ProjectTabs } from "./tabs";

export const metadata: Metadata = { title: "案件管理" };

export default function AdminProjectsPage() {
  return (
    <>
      <AdminHeader
        title="案件管理"
        action={
          <Link
            href="/admin/projects/new"
            className="flex items-center gap-1 rounded-full bg-indigo-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm transition-colors hover:bg-indigo-600"
          >
            <Icon name="plus" className="h-3.5 w-3.5" />
            案件を作成
          </Link>
        }
      />
      <main className="mx-auto max-w-md px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        <ProjectTabs />
      </main>
    </>
  );
}
