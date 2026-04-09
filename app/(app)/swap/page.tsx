"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getItemsByChannel } from "@/data/mock";

export default function SwapPage() {
  const [keyword, setKeyword] = useState("");
  const list = getItemsByChannel("swap");
  const filtered = useMemo(() => {
    const search = keyword.trim().toLowerCase();
    if (!search) return list;
    return list.filter((item) => {
      const source =
        `${item.title} ${item.location} ${item.tag} ${item.expectedSwapType ?? ""}`.toLowerCase();
      return source.includes(search);
    });
  }, [keyword, list]);

  return (
    <div>
      <PageHeader title="来置换" backHref="/" subtitle="发布或寻找置换需求" />
      <div className="px-4 py-4">
        <div className="rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-stone-200/80">
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="搜索置换物品或期望类型"
            className="w-full bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none"
            aria-label="搜索置换物品"
          />
        </div>

        <section className="mt-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-4 ring-1 ring-amber-200/80">
          <p className="text-sm font-semibold text-amber-900">交换助手</p>
          <p className="mt-1 text-xs text-amber-800/80">
            上传你想置换的物品照片，智能推荐可交换结果
          </p>
          <button
            type="button"
            className="mt-3 w-full rounded-xl bg-amber-500 py-2.5 text-sm font-medium text-white transition hover:bg-amber-600"
          >
            上传照片开始匹配
          </button>
          <div className="mt-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] text-amber-700 ring-1 ring-amber-200">
              匹配示例：摄影器材
            </span>
            <span className="rounded-full bg-white/80 px-2.5 py-1 text-[11px] text-amber-700 ring-1 ring-amber-200">
              匹配示例：桌面好物
            </span>
          </div>
        </section>

        <section className="mt-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-base font-semibold text-stone-800">置换广场</h2>
            <span className="text-xs text-stone-400">{filtered.length} 条</span>
          </div>
          <div className="columns-2 gap-3 [column-fill:_balance]">
            {filtered.map((item) => (
              <Link
                key={item.id}
                href={`/detail/${item.id}`}
                className="mb-3 block break-inside-avoid overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/80 transition hover:shadow-md"
              >
                <div
                  className={`bg-gradient-to-br from-stone-200 to-stone-100 ${
                    item.imageHeight === "lg"
                      ? "h-40"
                      : item.imageHeight === "sm"
                        ? "h-24"
                        : "h-32"
                  }`}
                />
                <div className="p-3">
                  <h3 className="line-clamp-2 text-sm font-medium leading-5 text-stone-800">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-sm font-semibold text-amber-700">{item.priceLabel}</p>
                  <p className="mt-1 truncate text-[11px] text-stone-500">
                    {item.location} · {item.tag}
                  </p>
                  <div className="mt-2">
                    <span className="inline-flex rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-800 ring-1 ring-amber-200/80">
                      期望置换：{item.expectedSwapType ?? "同类好物"}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          {!filtered.length ? (
            <div className="mt-4 rounded-2xl border border-dashed border-stone-300 bg-white/70 py-8 text-center text-sm text-stone-500">
              暂无匹配置换结果，换个关键词试试
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
