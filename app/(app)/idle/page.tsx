"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IdleCategoryTabs } from "@/components/idle-category-tabs";
import { IdleSearchBar } from "@/components/idle-search-bar";
import { IdleSortBar, type IdleSortKey } from "@/components/idle-sort-bar";
import { ItemCard } from "@/components/item-card";
import { ItemGrid } from "@/components/item-grid";
import { PageHeader } from "@/components/page-header";
import {
  type IdleCategory,
  getItemSortPrice,
} from "@/data/mock";
import { getActiveMarketplaceItemsByChannel, useMarketplaceStore } from "@/data/marketplace-store";

function IdlePageInner() {
  const searchParams = useSearchParams();
  const marketplace = useMarketplaceStore();
  const allIdleItems = useMemo(
    () => getActiveMarketplaceItemsByChannel("idle"),
    [marketplace.statusById],
  );
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState<IdleCategory>("推荐");
  const [activeSort, setActiveSort] = useState<IdleSortKey>("综合");
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setKeyword(q);
  }, [searchParams]);

  const handleSortChange = (sort: IdleSortKey) => {
    setActiveSort(sort);
    if (sort === "价格") setPriceOrder("asc");
  };

  const list = useMemo(() => {
    const byCategory =
      activeCategory === "推荐"
        ? allIdleItems
        : allIdleItems.filter((item) => item.category === activeCategory);

    const search = keyword.trim().toLowerCase();
    const filtered = !search
      ? byCategory
      : byCategory.filter((item) => item.title.toLowerCase().includes(search));

    const sorted = [...filtered];
    if (activeSort === "最新") {
      sorted.sort(
        (a, b) =>
          new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime(),
      );
    } else if (activeSort === "附近") {
      sorted.sort(
        (a, b) =>
          (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER),
      );
    } else if (activeSort === "价格") {
      sorted.sort((a, b) =>
        priceOrder === "asc"
          ? getItemSortPrice(a) - getItemSortPrice(b)
          : getItemSortPrice(b) - getItemSortPrice(a),
      );
    }

    return sorted;
  }, [activeCategory, activeSort, allIdleItems, keyword, priceOrder]);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        title="淘闲置"
        backHref="/"
        rightSlot={
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full text-stone-400 transition-colors hover:bg-orange-50 hover:text-emphasis"
            aria-label="筛选（即将上线）"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M7 12h10M10 18h4" strokeLinecap="round" />
            </svg>
          </button>
        }
      />

      <div className="flex min-h-0 flex-1 flex-col px-4 pb-3 pt-3">
        <IdleSearchBar value={keyword} onChange={setKeyword} />

        <div className="mt-2">
          <IdleCategoryTabs active={activeCategory} onChange={setActiveCategory} />
        </div>

        <div className="mt-2">
          <IdleSortBar
            activeSort={activeSort}
            priceOrder={priceOrder}
            onSortChange={handleSortChange}
            onPriceToggle={() => setPriceOrder((p) => (p === "asc" ? "desc" : "asc"))}
          />
        </div>

        <div className="mt-7 min-h-0 flex-1 rounded-t-2xl bg-[#F5F5F5] px-2 pb-6 pt-4 ring-1 ring-stone-200/40">
          <ItemGrid>
            {list.map((item) => (
              <ItemCard key={item.id} item={item} variant="grid" />
            ))}
          </ItemGrid>

          {!list.length ? (
            <div className="mx-1 mt-4 rounded-xl border border-dashed border-orange-200/90 bg-white py-10 text-center text-sm text-stone-500">
              暂无匹配商品，换个关键词试试
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function IdlePage() {
  return (
    <Suspense fallback={<div className="min-h-[50dvh] bg-surface" aria-hidden />}>
      <IdlePageInner />
    </Suspense>
  );
}
