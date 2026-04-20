"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";
import { FavoriteButton } from "@/components/favorite-button";
import { PageHeader } from "@/components/page-header";
import {
  channelMap,
  getItemDetailBody,
  getItemDetailTags,
} from "@/data/mock";
import { addToHistory, getMarketplaceItemById, useMarketplaceStore } from "@/data/marketplace-store";
import { getItemCoverClass } from "@/lib/item-cover";

export default function DetailPage() {
  const params = useParams<{ id: string }>();
  const id = String(params?.id ?? "");
  const marketplace = useMarketplaceStore();
  const item = getMarketplaceItemById(id);

  useEffect(() => {
    if (!id || !item) return;
    addToHistory(id);
  }, [id]);

  if (!item) {
    return (
      <div className="flex min-h-full flex-col bg-gray-100">
        <PageHeader title="商品详情" backHref="/" />
        <div className="px-4 py-6">
          <section className="rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-orange-100/90">
            <p className="text-sm text-stone-500">内容不存在</p>
            <Link
              href="/idle"
              className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
            >
              返回闲置列表
            </Link>
          </section>
        </div>
      </div>
    );
  }

  const tags = getItemDetailTags(item);
  const body = getItemDetailBody(item);
  const subtitle = channelMap[item.channel];

  const backHref =
    item.channel === "idle"
      ? "/idle"
      : item.channel === "rent"
        ? "/rent"
        : item.channel === "swap"
          ? "/swap"
          : item.channel === "give" || item.channel === "help"
            ? "/community"
            : "/";

  const coverStyle = item.image
    ? { backgroundImage: `url(${item.image})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : undefined;
  const sellerMeta = item.distanceKm
    ? `📍 ${item.location} · 距离 ${item.distanceKm.toFixed(1)}km`
    : "最近活跃：1小时前";
  const statusTitle = item.status === "offline" ? "该内容已下架" : "该内容已完成";
  const statusDesc =
    item.status === "offline"
      ? "发布者已暂时下架此信息"
      : "该商品/服务已完成交易或处理";
  const isActive = item.status === "active";

  return (
    <div className="flex flex-col" key={marketplace.statusById[item.id] ?? "active"}>
      <PageHeader title="商品详情" backHref={backHref} subtitle={subtitle} />

      <div
        className={`relative aspect-square w-full max-h-[min(100vw,390px)] overflow-hidden ${
          !item.image ? "bg-gradient-to-br from-orange-50 to-gray-100" : "bg-neutral-100"
        }`}
        style={coverStyle}
      >
        {!item.image ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`h-36 w-36 rounded-3xl opacity-75 blur-sm ${getItemCoverClass(item)}`}
              aria-hidden
            />
            <span className="absolute text-5xl" aria-hidden>
              📦
            </span>
          </div>
        ) : null}
      </div>

      <div className="flex justify-center gap-1.5 py-2.5">
        <span className="h-1.5 w-5 rounded-full bg-brand" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-stone-300" aria-hidden />
        <span className="h-1.5 w-1.5 rounded-full bg-stone-300" aria-hidden />
        <span className="sr-only">多图浏览占位，后续可接轮播</span>
      </div>

      <div className="px-4 pb-4 pt-2">
        {!isActive ? (
          <section className="mb-4 rounded-xl bg-white p-4 text-center shadow-sm ring-1 ring-orange-100/90">
            <p className="text-sm font-semibold text-stone-700">{statusTitle}</p>
            <p className="mt-1 text-xs text-stone-500">{statusDesc}</p>
            <Link
              href={backHref}
              className="mt-3 inline-flex rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600"
            >
              返回上一页
            </Link>
          </section>
        ) : null}
        <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <div className="flex justify-end">
            <FavoriteButton itemId={item.id} />
          </div>
          <p className="text-2xl font-bold tabular-nums leading-tight text-brand">{item.priceLabel}</p>
          <h1 className="mt-4 text-lg font-semibold leading-snug text-stone-900">{item.title}</h1>
          <p className="mt-1.5 text-xs text-stone-400">{item.location}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((t) => (
              <span
                key={t}
                className="rounded-full bg-orange-50 px-2 py-1 text-xs font-medium text-orange-500"
              >
                {t}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-stone-800">卖家信息</h2>
          <div className="mt-3 flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-100 to-orange-50 text-base font-semibold text-emphasis ring-2 ring-orange-100/80">
              {item.owner.slice(0, 1)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-stone-900">{item.owner}</p>
              <p className="mt-0.5 text-xs text-stone-500">
                {item.sellerCredit ?? "信用良好 · 邻里认证"}
              </p>
              <p className="mt-1 text-xs text-stone-400">{sellerMeta}</p>
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-stone-800">商品描述</h2>
          <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-stone-600">{body}</p>
        </section>
      </div>

      {isActive ? (
        <div className="sticky bottom-0 z-30 flex gap-3 border-t border-orange-100/90 bg-white/98 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Link
            href={`/messages/${item.id}`}
            className="flex min-h-[48px] flex-[1.1] items-center justify-center rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
          >
            联系对方
          </Link>
          <Link
            href="/publish"
            className="flex min-h-[48px] flex-1 items-center justify-center rounded-xl bg-white text-sm font-semibold text-stone-800 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80"
          >
            我也发布
          </Link>
        </div>
      ) : item.status === "done" ? (
        <div className="sticky bottom-0 z-30 border-t border-orange-100/90 bg-white/98 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <Link
            href="/publish"
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
          >
            我也发布
          </Link>
        </div>
      ) : null}
    </div>
  );
}
