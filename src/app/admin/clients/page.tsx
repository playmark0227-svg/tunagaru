import type { Metadata } from "next";
import { AdminHeader } from "../header";
import { ClientList } from "./client-list";

export const metadata: Metadata = { title: "顧客一覧" };

export default function AdminClientsPage() {
  return (
    <>
      <AdminHeader title="顧客一覧" />
      <main className="mx-auto max-w-md px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        <ClientList />
      </main>
    </>
  );
}
