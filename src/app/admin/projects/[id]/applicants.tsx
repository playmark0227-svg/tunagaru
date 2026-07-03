"use client";

/** 応募クライアント一覧: 採用 / 見送り をローカルstateで操作できる */
import { useState } from "react";
import {
  APPLICATION_STATUS_LABELS,
  type ApplicationStatus,
} from "@/lib/types";
import { Avatar, Badge, Card } from "@/components/ui";
import { Icon } from "@/components/icons";

export interface ApplicantInfo {
  clientId: string;
  name: string;
  ownerName: string;
  category: string;
  avatarColor: string;
  status: ApplicationStatus;
  appliedAt: string;
  note?: string;
}

/** "2026-06-27" → "6/27" */
function md(date: string): string {
  const [, m, d] = date.split("-");
  return `${Number(m)}/${Number(d)}`;
}

export function Applicants({ initial }: { initial: ApplicantInfo[] }) {
  const [statuses, setStatuses] = useState<Record<string, ApplicationStatus>>(
    () => Object.fromEntries(initial.map((a) => [a.clientId, a.status])),
  );

  function decide(clientId: string, status: ApplicationStatus) {
    setStatuses((prev) => ({ ...prev, [clientId]: status }));
  }

  return (
    <Card className="divide-y divide-stone-100">
      {initial.map((a) => {
        const status = statuses[a.clientId];
        return (
          <div key={a.clientId} className="px-4 py-3">
            <div className="flex items-center gap-3">
              <Avatar name={a.name} color={a.avatarColor} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{a.name}</p>
                <p className="truncate text-xs text-stone-400">
                  {a.ownerName} 様・{md(a.appliedAt)} 応募
                </p>
              </div>
              <Badge
                tone={
                  status === "accepted"
                    ? "green"
                    : status === "rejected"
                      ? "gray"
                      : "blue"
                }
              >
                {APPLICATION_STATUS_LABELS[status]}
              </Badge>
            </div>

            {a.note && (
              <p className="mt-2 rounded-lg bg-stone-50 px-2.5 py-1.5 text-xs leading-relaxed text-stone-500">
                💬 {a.note}
              </p>
            )}

            {status === "applied" ? (
              <div className="mt-2.5 flex gap-2">
                <button
                  onClick={() => decide(a.clientId, "accepted")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-indigo-500 px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-indigo-600"
                >
                  <Icon name="check" className="h-3.5 w-3.5" />
                  採用する
                </button>
                <button
                  onClick={() => decide(a.clientId, "rejected")}
                  className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-stone-200 bg-white px-3 py-2 text-xs font-bold text-stone-500 transition-colors hover:bg-stone-50"
                >
                  <Icon name="x" className="h-3.5 w-3.5" />
                  見送り
                </button>
              </div>
            ) : status === "accepted" ? (
              <p className="mt-2.5 flex items-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                <Icon name="check" className="h-3.5 w-3.5" />
                採用しました — クライアントに通知し、タスクを作成しました
              </p>
            ) : (
              <p className="mt-2.5 rounded-xl bg-stone-50 px-3 py-2 text-xs text-stone-500">
                見送りにしました — クライアントへ丁寧なお知らせを送信済みです
              </p>
            )}
          </div>
        );
      })}
    </Card>
  );
}
