import Link from "next/link";
import { Avatar, Card, PageHeader } from "@/components/ui";
import { endUserThreads } from "@/lib/mock-data";

export const metadata = { title: "メッセージ" };

export default function UserMessagesPage() {
  return (
    <>
      <PageHeader title="メッセージ" />
      <main className="px-4 pb-24 pt-4">
        <Card className="divide-y divide-ink/8">
          {endUserThreads.map((thread) => (
            <Link
              key={thread.id}
              href={`/user/messages/${thread.id}`}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-cream active:bg-ink/5"
            >
              <Avatar name={thread.title} color={thread.avatarColor} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <p className="truncate text-sm font-bold">{thread.title}</p>
                  {thread.kind === "group" && thread.memberCount && (
                    <span className="shrink-0 text-[10px] text-ink/40">
                      ({thread.memberCount})
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate text-xs text-ink/55">
                  {thread.lastMessage}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[10px] text-ink/40">
                  {thread.lastMessageAt}
                </span>
                {thread.unreadCount > 0 ? (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-sm bg-brand px-1.5 text-[10px] font-bold text-white">
                    {thread.unreadCount}
                  </span>
                ) : (
                  <span className="h-5" />
                )}
              </div>
            </Link>
          ))}
        </Card>

        <p className="mt-4 px-2 text-center text-[11px] leading-relaxed text-ink/40">
          先生への質問・体験レッスンのご相談はこちらからどうぞ🌸
        </p>
      </main>
    </>
  );
}
