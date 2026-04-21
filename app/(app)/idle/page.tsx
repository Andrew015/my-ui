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

const SEARCH_HISTORY_KEY = "idle-search-history";
const HOT_KEYWORDS = ["相机", "婴儿车", "打印机", "书桌", "折叠椅"];

function IdlePageInner() {
  const searchParams = useSearchParams();
  const marketplace = useMarketplaceStore();
  const allIdleItems = useMemo(
    () => getActiveMarketplaceItemsByChannel("idle"),
    [marketplace.statusById],
  );
  const [keyword, setKeyword] = useState("");
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchMode, setSearchMode] = useState(false);
  const [activeCategory, setActiveCategory] = useState<IdleCategory>("推荐");
  const [activeSort, setActiveSort] = useState<IdleSortKey>("综合");
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const q = searchParams.get("q");
    if (q) setKeyword(q);
  }, [searchParams]);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(SEARCH_HISTORY_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) setSearchHistory(parsed.slice(0, 8));
    } catch {
      // ignore localStorage read errors
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(SEARCH_HISTORY_KEY, JSON.stringify(searchHistory.slice(0, 8)));
    } catch {
      // ignore localStorage write errors
    }
  }, [searchHistory]);

  const handleSortChange = (sort: IdleSortKey) => {
    setActiveSort(sort);
    if (sort === "价格") setPriceOrder("asc");
  };

  const pushSearchHistory = (text: string) => {
    const normalized = text.trim();
    if (!normalized) return;
    setSearchHistory((prev) => [normalized, ...prev.filter((item) => item !== normalized)].slice(0, 8));
  };

  const runSearch = (text: string) => {
    const normalized = text.trim();
    setKeyword(normalized);
    if (normalized) pushSearchHistory(normalized);
    setSearchMode(false);
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
        <IdleSearchBar
          value={keyword}
          onChange={setKeyword}
          onFocus={() => setSearchMode(true)}
          onSubmit={() => runSearch(keyword)}
          showCancel={searchMode}
          onCancel={() => setSearchMode(false)}
        />

        {searchMode ? (
          <div className="mt-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-orange-100/90">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-stone-700">搜索历史</h3>
              <button
                type="button"
                onClick={() => setSearchHistory([])}
                className="text-xs text-stone-400 hover:text-stone-600"
              >
                清空历史
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {searchHistory.length ? (
                searchHistory.map((word) => (
                  <button
                    key={word}
                    type="button"
                    onClick={() => runSearch(word)}
                    className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-600"
                  >
                    {word}
                  </button>
                ))
              ) : (
                <p className="text-xs text-stone-400">暂无搜索历史</p>
              )}
            </div>

            <h3 className="mt-4 text-sm font-semibold text-stone-700">热门搜索</h3>
            <div className="mt-2 flex flex-wrap gap-2">
              {HOT_KEYWORDS.map((word) => (
                <button
                  key={word}
                  type="button"
                  onClick={() => runSearch(word)}
                  className="rounded-full bg-orange-50 px-3 py-1 text-xs text-orange-600"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        ) : null}

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
            <div className="mx-1 mt-4 rounded-xl border border-dashed border-orange-200/90 bg-white py-10 text-center">
              <p className="text-sm text-stone-500">没有找到相关闲置</p>
              <button
                type="button"
                onClick={() => {
                  setKeyword("");
                  setActiveCategory("推荐");
                  setActiveSort("综合");
                  setPriceOrder("asc");
                }}
                className="mt-3 rounded-lg bg-orange-50 px-3 py-1.5 text-xs font-medium text-orange-600"
              >
                看看推荐
              </button>
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
