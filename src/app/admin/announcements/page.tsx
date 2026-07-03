import type { Metadata } from "next";
import { AdminHeader } from "../header";
import { AnnounceForm } from "./announce-form";

export const metadata: Metadata = { title: "一斉通知" };

export default function AdminAnnouncementsPage() {
  return (
    <>
      <AdminHeader title="一斉通知" />
      <main className="mx-auto max-w-md px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        <AnnounceForm />
      </main>
    </>
  );
}
