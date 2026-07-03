import type { Metadata } from "next";
import { AdminHeader } from "../header";
import { OrdersBoard } from "./orders-board";

export const metadata: Metadata = { title: "受注・発注管理" };

export default function AdminOrdersPage() {
  return (
    <>
      <AdminHeader title="受注・発注管理" />
      <main className="mx-auto max-w-md px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        <OrdersBoard />
      </main>
    </>
  );
}
