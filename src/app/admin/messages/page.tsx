import type { Metadata } from "next";
import Link from "next/link";
import { hqThreads } from "@/lib/mock-data";
import { Avatar, Card } from "@/components/ui";
import { AdminHeader } from "../header";

export const metadata: Metadata = { title: "チャット" };

export default function AdminMessagesPage() {
  const unreadTotal = hqThreads.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <>
      <AdminHeader
        title="チャット"
        action={
          unreadTotal > 0 ? (
            <span className="rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-bold text-indigo-600">
              未読 {unreadTotal}件
            </span>
          ) : undefined
        }
      />

      <main className="mx-auto max-w-md px-4 pb-24 pt-4 md:max-w-4xl md:px-8 md:pb-12 md:pt-6">
        <p className="mb-3 text-xs text-stone-400">
          クライアント別のスレッドとグループです。タップしてトークを開けます。
        </p>
        <Card className="divide-y divide-stone-100">
          {hqThreads.map((t) => (
            <Link
              key={t.id}
              href={`/admin/messages/${t.id}`}
              className="flex items-center gap-3 px-4 py-3.5 transition-colors hover:bg-stone-50 active:bg-stone-100"
            >
              <Avatar name={t.title} color={t.avatarColor} size="md" />
              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-1.5">
                  <span className="truncate text-sm font-bold">{t.title}</span>
                  {t.kind === "group" && (
                    <span className="shrink-0 rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-500">
                      {t.memberCount}名
                    </span>
                  )}
                </span>
                <span
                  className={`mt-0.5 block truncate text-xs ${
                    t.unreadCount > 0
                      ? "font-semibold text-stone-600"
                      : "text-stone-400"
                  }`}
                >
                  {t.lastMessage}
                </span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[10px] text-stone-400">
                  {t.lastMessageAt}
                </span>
                {t.unreadCount > 0 ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-indigo-500 px-1.5 text-[10px] font-bold text-white">
                    {t.unreadCount}
                  </span>
                ) : (
                  <span className="h-5" />
                )}
              </span>
            </Link>
          ))}
        </Card>
      </main>
    </>
  );
}
