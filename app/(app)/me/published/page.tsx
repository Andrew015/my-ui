"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { PublishedCard } from "@/components/published-card";
import { PublishedStats } from "@/components/published-stats";
import { PublishedTabs } from "@/components/published-tabs";
import { PublishToast } from "@/components/publish-toast";
import {
  getMyPublishedItems,
  removePublishedItem,
  type MyPublishedItem,
  type PublishedStatus,
  type PublishedTypeFilter,
  updatePublishedItem,
} from "@/data/mock";
import { removeMarketplaceItem, updateItemStatus } from "@/data/marketplace-store";

const statusFilters: { key: "all" | PublishedStatus; label: string }[] = [
  { key: "all", label: "全部状态" },
  { key: "active", label: "展示中" },
  { key: "offline", label: "已下架" },
  { key: "done", label: "已完成" },
];

function toEditPath(type: MyPublishedItem["type"]) {
  if (type === "sell") return "/publish/sell";
  if (type === "rent") return "/publish/rent";
  if (type === "swap") return "/publish/swap";
  return "/publish/community";
}

export default function MyPublishedPage() {
  const router = useRouter();
  const [items, setItems] = useState<MyPublishedItem[]>(() => getMyPublishedItems());
  const [typeFilter, setTypeFilter] = useState<PublishedTypeFilter>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | PublishedStatus>("all");
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 1700);
  };

  const stats = useMemo(() => {
    const total = items.length;
    const active = items.filter((item) => item.status === "active").length;
    const offline = items.filter((item) => item.status === "offline").length;
    return { total, active, offline };
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const typeMatched = typeFilter === "all" ? true : item.type === typeFilter;
      const statusMatched = statusFilter === "all" ? true : item.status === statusFilter;
      return typeMatched && statusMatched;
    });
  }, [items, typeFilter, statusFilter]);

  const onToggleShelf = (target: MyPublishedItem) => {
    if (target.status === "done") return;
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== target.id) return item;
        const nextStatus = item.status === "active" ? "offline" : "active";
        updatePublishedItem(item.id, { status: nextStatus });
        updateItemStatus(item.id, nextStatus);
        showToast(nextStatus === "offline" ? "已下架，该内容将不再展示在首页和列表中" : "已重新上架");
        return { ...item, status: nextStatus };
      }),
    );
  };

  const onMarkDone = (target: MyPublishedItem) => {
    if (target.status !== "active") return;
    if (!window.confirm("确认该闲置已成交/已完成？")) return;
    updatePublishedItem(target.id, { status: "done" });
    updateItemStatus(target.id, "done");
    setItems((prev) => prev.map((item) => (item.id === target.id ? { ...item, status: "done" } : item)));
    showToast("已标记为完成");
  };

  const onDelete = (target: MyPublishedItem) => {
    if (!window.confirm("确认删除这条发布吗？")) return;
    console.log("delete-published", target);
    removePublishedItem(target.id);
    removeMarketplaceItem(target.id);
    setItems((prev) => prev.filter((item) => item.id !== target.id));
    showToast("已删除");
  };

  const onEdit = (target: MyPublishedItem) => {
    router.push(`${toEditPath(target.type)}/${target.id}`);
  };

  return (
    <div className="min-h-full bg-gray-100 pb-6">
      <PublishToast message={toast} />
      <PageHeader title="我的发布" backHref="/me" />

      <div className="mt-3">
        <PublishedStats total={stats.total} active={stats.active} offline={stats.offline} />
      </div>

      <div className="mt-3">
        <PublishedTabs value={typeFilter} onChange={setTypeFilter} />
      </div>

      <div className="mt-3 px-4">
        <div className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm ring-1 ring-orange-100/90">
          {statusFilters.map((status) => {
            const active = statusFilter === status.key;
            return (
              <button
                key={status.key}
                type="button"
                onClick={() => setStatusFilter(status.key)}
                className={`shrink-0 rounded-full px-3 py-1 text-xs transition ${
                  active
                    ? "bg-orange-50 text-orange-600 ring-1 ring-orange-200"
                    : "text-stone-500 hover:bg-stone-100"
                }`}
              >
                {status.label}
              </button>
            );
          })}
        </div>
      </div>

      <section className="mt-3 space-y-3 px-4">
        {filteredItems.length ? (
          filteredItems.map((item) => (
            <PublishedCard
              key={item.id}
              item={item}
              onEdit={onEdit}
              onToggleShelf={onToggleShelf}
              onMarkDone={onMarkDone}
              onDelete={onDelete}
            />
          ))
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}
