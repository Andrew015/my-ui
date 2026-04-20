"use client";

import { useMemo, useState } from "react";
import { HistoryCard } from "@/components/history-card";
import { HistoryEmptyState } from "@/components/history-empty-state";
import { HistoryTabs } from "@/components/history-tabs";
import { HistoryToolbar } from "@/components/history-toolbar";
import { PageHeader } from "@/components/page-header";
import { PublishToast } from "@/components/publish-toast";
import {
  clearHistory,
  getHistoryItems,
  getHistoryItemsByType,
  removeFromHistory,
  useMarketplaceStore,
} from "@/data/marketplace-store";

type HistoryTypeFilter = "all" | "sell" | "rent" | "swap" | "community";

export default function HistoryPage() {
  const marketplace = useMarketplaceStore();
  const [typeFilter, setTypeFilter] = useState<HistoryTypeFilter>("all");
  const [toast, setToast] = useState<string | null>(null);

  const allHistory = useMemo(
    () => getHistoryItems(),
    [marketplace.history, marketplace.statusById, marketplace.deletedIds],
  );
  const list = useMemo(() => {
    if (typeFilter === "all") return allHistory;
    return getHistoryItemsByType(typeFilter);
  }, [allHistory, typeFilter, marketplace.history, marketplace.statusById, marketplace.deletedIds]);

  const handleRemove = (id: string) => {
    removeFromHistory(id);
    setToast("已删除该条历史");
    setTimeout(() => setToast(null), 1200);
  };

  const handleClear = () => {
    if (!allHistory.length) return;
    if (!window.confirm("确认清空全部浏览历史？")) return;
    clearHistory();
    setToast("已清空浏览历史");
    setTimeout(() => setToast(null), 1200);
  };

  return (
    <div className="min-h-full bg-gray-100 pb-6">
      <PublishToast message={toast} />
      <PageHeader title="浏览历史" backHref="/me" />

      <div className="mt-3">
        <HistoryToolbar onClear={handleClear} disabled={!allHistory.length} />
      </div>

      <div className="mt-3">
        <HistoryTabs value={typeFilter} onChange={setTypeFilter} />
      </div>

      <section className="mt-3 space-y-3 px-4">
        {list.length ? (
          list.map((item) => (
            <HistoryCard key={item.id} item={item} onRemove={handleRemove} />
          ))
        ) : (
          <HistoryEmptyState />
        )}
      </section>
    </div>
  );
}
