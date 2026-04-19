"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getItemsByChannel, rentCategories, type RentCategory } from "@/data/mock";

type SortKey = "综合" | "最新" | "距离最近" | "价格";

const sortOptions: SortKey[] = ["综合", "最新", "距离最近", "价格"];

export default function RentPage() {
  const allRentItems = getItemsByChannel("rent");
  const [keyword, setKeyword] = useState("");
  const [activeCategory, setActiveCategory] = useState<RentCategory>("推荐");
  const [activeSort, setActiveSort] = useState<SortKey>("综合");
  const [priceOrder, setPriceOrder] = useState<"asc" | "desc">("asc");

  const list = useMemo(() => {
    const byCategory =
      activeCategory === "推荐"
        ? allRentItems
        : allRentItems.filter((item) => item.category === activeCategory);

    const search = keyword.trim().toLowerCase();
    const filtered = !search
      ? byCategory
      : byCategory.filter((item) => {
          const source = `${item.title} ${item.tag} ${item.location}`.toLowerCase();
          return source.includes(search);
        });

    const sorted = [...filtered];
    if (activeSort === "最新") {
      sorted.sort(
        (a, b) =>
          new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime(),
      );
    } else if (activeSort === "距离最近") {
      sorted.sort(
        (a, b) =>
          (a.distanceKm ?? Number.MAX_SAFE_INTEGER) - (b.distanceKm ?? Number.MAX_SAFE_INTEGER),
      );
    } else if (activeSort === "价格") {
      sorted.sort((a, b) =>
        priceOrder === "asc"
          ? parsePrice(a.priceLabel) - parsePrice(b.priceLabel)
          : parsePrice(b.priceLabel) - parsePrice(a.priceLabel),
      );
    }

    return sorted;
  }, [activeCategory, activeSort, allRentItems, keyword, priceOrder]);

  return (
    <div>
      <PageHeader title="短租用" backHref="/" subtitle="短期借用更划算" />
      <div className="px-4 py-4">
        <div className="rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-orange-100/90">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索可租用物品"
            className="w-full bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none"
            aria-label="搜索可租用物品"
          />
        </div>

        <div className="mt-3 -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {rentCategories.map((category) => {
            const active = category === activeCategory;
            return (
              <button
                key={category}
                type="button"
                onClick={() => setActiveCategory(category)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-secondary text-emphasis"
                    : "bg-white text-stone-600 ring-1 ring-orange-100/80"
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        <div className="mt-2 rounded-xl bg-white ring-1 ring-orange-100/90">
          <div className="grid grid-cols-4 p-1">
            {sortOptions.map((label) => {
              const active = label === activeSort;
              return (
                <button
                  key={label}
                  type="button"
                  onClick={() => {
                    if (label === "价格") {
                      if (activeSort === "价格") {
                        setPriceOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                      } else {
                        setActiveSort("价格");
                        setPriceOrder("asc");
                      }
                      return;
                    }
                    setActiveSort(label);
                  }}
                  className={`rounded-lg px-1 py-1.5 text-xs font-medium transition ${
                    active ? "bg-orange-50 text-emphasis" : "text-stone-500"
                  }`}
                >
                  {label}
                  {label === "价格" && activeSort === "价格"
                    ? priceOrder === "asc"
                      ? " ↑"
                      : " ↓"
                    : ""}
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {list.map((item) => (
            <Link
              key={item.id}
              href={`/detail/${item.id}`}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-orange-100/90 transition hover:shadow-md"
            >
              <div className="relative h-32 bg-gradient-to-br from-orange-100/90 to-stone-100">
                <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                  {item.category ?? "推荐"}
                </span>
              </div>
              <div className="p-3">
                <h3 className="line-clamp-2 text-sm font-medium leading-5 text-stone-800">
                  {item.title}
                </h3>
                <p className="mt-1 text-base font-semibold text-brand">
                  {item.priceLabel}
                </p>
                <div className="mt-1 flex items-center justify-between gap-2">
                  <span className="truncate text-[11px] text-stone-500">{item.tag}</span>
                  <span className="truncate text-[11px] text-stone-400">
                    {item.location}
                    {item.distanceKm ? ` · ${item.distanceKm}km` : ""}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {!list.length ? (
          <div className="mt-6 rounded-2xl border border-dashed border-orange-200/80 bg-white/70 py-8 text-center text-sm text-stone-500">
            暂无匹配租赁信息，换个关键词试试
          </div>
        ) : null}
      </div>
    </div>
  );
}

function parsePrice(priceLabel: string) {
  const match = priceLabel.match(/\d+(\.\d+)?/);
  if (!match) return Number.MAX_SAFE_INTEGER;
  return Number(match[0]);
}
