"use client";

/** 顧客一覧: 検索ボックス + ステータス絞り込み + クライアントカード */
import Link from "next/link";
import { useState } from "react";
import { clients } from "@/lib/mock-data";
import {
  CLIENT_STATUS_LABELS,
  type ClientStatus,
} from "@/lib/types";
import { Avatar, Badge, Card, EmptyState, type BadgeTone } from "@/components/ui";
import { Icon } from "@/components/icons";

const statusTone: Record<ClientStatus, BadgeTone> = {
  active: "green",
  trial: "amber",
  suspended: "gray",
};

const filters: { value: ClientStatus | "all"; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "active", label: "契約中" },
  { value: "trial", label: "トライアル" },
  { value: "suspended", label: "休止中" },
];

export function ClientList() {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<ClientStatus | "all">("all");

  const filtered = clients.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const q = query.trim();
    const matchesQuery =
      !q ||
      c.name.includes(q) ||
      c.ownerName.includes(q) ||
      c.category.includes(q);
    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-4">
      {/* 検索ボックス */}
      <div className="relative">
        <Icon
          name="search"
          className="pointer-events-none absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-ink/40"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="教室名・代表者名・業種で検索"
          className="w-full rounded-none border border-ink/12 bg-white py-3 pl-10 pr-4 text-sm shadow-sm outline-none focus:border-indigo-400"
        />
      </div>

      {/* ステータス絞り込み */}
      <div className="no-scrollbar -mx-4 flex gap-2 overflow-x-auto px-4 md:mx-0 md:px-0">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`shrink-0 rounded-sm px-4 py-1.5 text-xs font-semibold transition-colors ${
              filter === f.value
                ? "bg-aqua text-white"
                : "border border-ink/12 bg-white text-ink/55 hover:bg-cream"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <p className="text-xs text-ink/40">
        {clients.length}社中 {filtered.length}社を表示
      </p>

      {/* クライアントカード */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="search"
          title="該当するクライアントがいません"
          description="検索条件を変えてお試しください"
        />
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((c) => (
            <Link key={c.id} href={`/admin/clients/${c.id}`} className="block">
              <Card className="p-4 transition-shadow hover:shadow-md">
                <div className="flex items-center gap-3">
                  <Avatar name={c.name} color={c.avatarColor} size="md" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{c.name}</p>
                    <p className="truncate text-xs text-ink/55">
                      {c.ownerName}・{c.category}
                    </p>
                  </div>
                  <Icon
                    name="chevron-right"
                    className="h-4 w-4 shrink-0 text-ink/25"
                  />
                </div>
                <div className="mt-3 flex flex-wrap items-center gap-1.5">
                  <Badge tone={statusTone[c.status]}>
                    {CLIENT_STATUS_LABELS[c.status]}
                  </Badge>
                  <Badge tone="violet">{c.plan}プラン</Badge>
                  <span className="ml-auto flex items-center gap-1 text-xs text-ink/55">
                    <Icon name="users" className="h-3.5 w-3.5" />
                    生徒 {c.studentCount}名
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
