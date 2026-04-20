"use client";

import { useMemo, useState } from "react";
import { FavoriteCard } from "@/components/favorite-card";
import { FavoriteEmptyState } from "@/components/favorite-empty-state";
import { FavoritesStats } from "@/components/favorites-stats";
import { FavoritesTabs } from "@/components/favorites-tabs";
import { PageHeader } from "@/components/page-header";
import { PublishToast } from "@/components/publish-toast";
import {
  getFavoriteItems,
  getFavoriteItemsByType,
  toggleFavorite,
  useMarketplaceStore,
} from "@/data/marketplace-store";

type FavoriteTypeFilter = "all" | "sell" | "rent" | "swap" | "community";

export default function FavoritesPage() {
  const marketplace = useMarketplaceStore();
  const [typeFilter, setTypeFilter] = useState<FavoriteTypeFilter>("all");
  const [toast, setToast] = useState<string | null>(null);

  const allFavorites = useMemo(
    () => getFavoriteItems(),
    [marketplace.favoriteById, marketplace.statusById, marketplace.deletedIds],
  );

  const list = useMemo(() => {
    if (typeFilter === "all") return allFavorites;
    return getFavoriteItemsByType(typeFilter);
  }, [allFavorites, typeFilter, marketplace.favoriteById, marketplace.statusById, marketplace.deletedIds]);

  const stats = useMemo(() => {
    const total = allFavorites.length;
    const active = allFavorites.filter((item) => item.status === "active").length;
    const invalid = total - active;
    return { total, active, invalid };
  }, [allFavorites]);

  const handleUnfavorite = (id: string) => {
    const next = toggleFavorite(id);
    if (!next) {
      setToast("已取消收藏");
      setTimeout(() => setToast(null), 1200);
    }
  };

  return (
    <div className="min-h-full bg-gray-100 pb-6">
      <PublishToast message={toast} />
      <PageHeader title="我的收藏" backHref="/me" />

      <div className="mt-3">
        <FavoritesStats total={stats.total} active={stats.active} invalid={stats.invalid} />
      </div>

      <div className="mt-3">
        <FavoritesTabs value={typeFilter} onChange={setTypeFilter} />
      </div>

      <section className="mt-3 space-y-3 px-4">
        {list.length ? (
          list.map((item) => (
            <FavoriteCard key={item.id} item={item} onUnfavorite={handleUnfavorite} />
          ))
        ) : (
          <FavoriteEmptyState />
        )}
      </section>
    </div>
  );
}
