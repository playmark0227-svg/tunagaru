import type { Metadata } from "next";
import { AdminHeader } from "../../header";
import { VisualEditor } from "./visual-editor";

export const metadata: Metadata = { title: "ビジュアル管理" };

export default function AdminVisualSettingsPage() {
  return (
    <>
      <AdminHeader title="ビジュアル管理" />
      <main className="mx-auto max-w-md px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        <VisualEditor />
      </main>
    </>
  );
}
