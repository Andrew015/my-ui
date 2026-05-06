"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { DetailTradeBar } from "@/components/detail-trade-bar";
import { FavoriteButton } from "@/components/favorite-button";
import { PageHeader } from "@/components/page-header";
import { RelatedSection } from "@/components/related-section";
import {
  channelMap,
  currentUser,
  getItemDetailBody,
  getItemDetailTags,
  getItemSupportTagLabels,
} from "@/data/mock";
import {
  addToHistory,
  getActiveMarketplaceItemsByChannel,
  getMarketplaceItemById,
  getMarketplaceItemsByChannel,
  updateItemStatus,
  useMarketplaceStore,
} from "@/data/marketplace-store";
import { getItemCoverClass } from "@/lib/item-cover";

function getListingType(channel: "idle" | "rent" | "swap" | "give" | "help") {
  if (channel === "idle") return "sell";
  if (channel === "rent") return "rent";
  if (channel === "swap") return "swap";
  return "community";
}

function getEditPath(channel: "idle" | "rent" | "swap" | "give" | "help", id: string) {
  if (channel === "idle") return `/publish/sell/${id}`;
  if (channel === "rent") return `/publish/rent/${id}`;
  if (channel === "swap") return `/publish/swap/${id}`;
  return `/publish/community/${id}`;
}

export default function DetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = String(params?.id ?? "");
  const marketplace = useMarketplaceStore();
  const [ownerToast, setOwnerToast] = useState<string | null>(null);
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
  const supportTags = getItemSupportTagLabels(item);
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
  const isOwner = item.ownerId === currentUser.id;
  const statusTitle =
    item.status === "offline"
      ? isOwner
        ? "你已下架该内容"
        : "该内容已下架"
      : isOwner
        ? "该内容已完成"
        : "该内容已完成";
  const statusDesc =
    item.status === "offline"
      ? isOwner
        ? "你可随时重新上架继续展示"
        : "发布者已暂时下架此信息"
      : "该商品/服务已完成交易或处理";
  const isActive = item.status === "active";

  const uniqueById = <T extends { id: string }>(list: T[]) => {
    const seen = new Set<string>();
    return list.filter((entry) => {
      if (seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    });
  };

  const activePool = useMemo(
    () => [
      ...getActiveMarketplaceItemsByChannel("idle"),
      ...getActiveMarketplaceItemsByChannel("rent"),
      ...getActiveMarketplaceItemsByChannel("swap"),
      ...getActiveMarketplaceItemsByChannel("give"),
      ...getActiveMarketplaceItemsByChannel("help"),
    ],
    [marketplace.statusById, marketplace.deletedIds],
  );
  const allPool = useMemo(
    () => [
      ...getMarketplaceItemsByChannel("idle"),
      ...getMarketplaceItemsByChannel("rent"),
      ...getMarketplaceItemsByChannel("swap"),
      ...getMarketplaceItemsByChannel("give"),
      ...getMarketplaceItemsByChannel("help"),
    ],
    [marketplace.statusById, marketplace.deletedIds],
  );
  const relatedByCategory = useMemo(() => {
    const currentType = getListingType(item.channel);
    const sameTypeActive = activePool.filter(
      (candidate) =>
        candidate.id !== item.id && getListingType(candidate.channel) === currentType,
    );
    const sameCategoryActive =
      item.category != null
        ? sameTypeActive.filter((candidate) => candidate.category === item.category)
        : sameTypeActive;

    if (sameCategoryActive.length >= 2) return sameCategoryActive.slice(0, 4);

    const sameTypeAnyStatus = allPool.filter(
      (candidate) =>
        candidate.id !== item.id && getListingType(candidate.channel) === currentType,
    );
    const mergedSameType = uniqueById([...sameCategoryActive, ...sameTypeAnyStatus]);
    if (mergedSameType.length >= 2) return mergedSameType.slice(0, 4);

    const mergedWithGlobal = uniqueById([
      ...mergedSameType,
      ...activePool.filter((candidate) => candidate.id !== item.id),
    ]);
    return mergedWithGlobal.slice(0, Math.min(4, mergedWithGlobal.length));
  }, [activePool, allPool, item.category, item.channel, item.id]);
  const guessLike = useMemo(() => {
    const candidates = activePool.filter((candidate) => candidate.id !== item.id);
    if (candidates.length) {
      return [...candidates].sort(() => Math.random() - 0.5).slice(0, 6);
    }
    return [...allPool.filter((candidate) => candidate.id !== item.id)]
      .sort(() => Math.random() - 0.5)
      .slice(0, 6);
  }, [activePool, allPool, item.id]);

  const showOwnerToast = (msg: string) => {
    setOwnerToast(msg);
    window.setTimeout(() => setOwnerToast(null), 1800);
  };

  const onUpdateOwnerStatus = (next: "active" | "offline" | "done") => {
    updateItemStatus(item.id, next);
    showOwnerToast(next === "active" ? "已上架" : next === "offline" ? "已下架" : "已标记完成");
  };

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
          {supportTags.length ? (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {supportTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}

          {item.supportRent ? (
            <section className="mt-3 rounded-xl bg-orange-50/60 p-3 ring-1 ring-orange-100/80">
              <p className="text-sm font-semibold text-emphasis">也支持租用</p>
              <dl className="mt-2 space-y-1.5 text-xs text-stone-600">
                {item.supportRentPrice != null ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-stone-400">日租金</dt>
                    <dd className="font-medium text-stone-800">￥{item.supportRentPrice}/天</dd>
                  </div>
                ) : null}
                {item.supportRentDeposit != null ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-stone-400">押金</dt>
                    <dd>￥{item.supportRentDeposit}</dd>
                  </div>
                ) : null}
                {item.supportRentDuration ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-stone-400">最短租期</dt>
                    <dd>{item.supportRentDuration}</dd>
                  </div>
                ) : null}
                {item.supportRentDescription ? (
                  <div className="pt-1">
                    <p className="text-stone-400">补充说明</p>
                    <p className="mt-0.5 leading-relaxed">{item.supportRentDescription}</p>
                  </div>
                ) : null}
              </dl>
            </section>
          ) : null}

          {item.supportSwap ? (
            <section className="mt-3 rounded-xl bg-orange-50/60 p-3 ring-1 ring-orange-100/80">
              <p className="text-sm font-semibold text-emphasis">也支持置换</p>
              <dl className="mt-2 space-y-1.5 text-xs text-stone-600">
                {item.supportExchangeWish ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-stone-400">想换什么</dt>
                    <dd className="flex-1 font-medium text-stone-800">{item.supportExchangeWish}</dd>
                  </div>
                ) : null}
                {item.supportExchangeType ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-stone-400">接受类型</dt>
                    <dd className="flex-1">{item.supportExchangeType}</dd>
                  </div>
                ) : null}
                {item.supportExchangeDescription ? (
                  <div className="pt-1">
                    <p className="text-stone-400">补充说明</p>
                    <p className="mt-0.5 leading-relaxed">{item.supportExchangeDescription}</p>
                  </div>
                ) : null}
              </dl>
            </section>
          ) : null}

          {item.supportGive ? (
            <section className="mt-3 rounded-xl bg-orange-50/60 p-3 ring-1 ring-orange-100/80">
              <p className="text-sm font-semibold text-emphasis">也支持赠送</p>
              <dl className="mt-2 space-y-1.5 text-xs text-stone-600">
                {item.giveCondition ? (
                  <div>
                    <p className="text-stone-400">赠送说明</p>
                    <p className="mt-0.5 leading-relaxed text-stone-800">{item.giveCondition}</p>
                  </div>
                ) : null}
                {item.giveTarget ? (
                  <div className="flex gap-2">
                    <dt className="shrink-0 text-stone-400">优先对象</dt>
                    <dd className="flex-1">{item.giveTarget}</dd>
                  </div>
                ) : null}
                {item.giveDescription ? (
                  <div className="pt-1">
                    <p className="text-stone-400">补充说明</p>
                    <p className="mt-0.5 leading-relaxed">{item.giveDescription}</p>
                  </div>
                ) : null}
              </dl>
            </section>
          ) : null}

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

        {relatedByCategory.length ? (
          <div className="mt-4">
            <RelatedSection title="同类推荐 · 附近相似" items={relatedByCategory} />
          </div>
        ) : null}
        <div className="mt-6">
          <RelatedSection title="猜你喜欢" items={guessLike} variant="grid" />
        </div>
      </div>

      {!isOwner && isActive ? (
        <DetailTradeBar item={item} />
      ) : !isOwner && item.status === "done" ? (
        <div className="sticky bottom-[-1.5rem] z-30 border-t border-orange-100/90 bg-white/98 px-4 py-3 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
          <Link
            href="/publish"
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
          >
            我也发布
          </Link>
        </div>
      ) : isOwner ? (
        <div className="sticky bottom-[-1.5rem] z-30 border-t border-orange-100/90 bg-white/98 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
          {item.status === "done" ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2.5">
                <Link
                  href={`/me/published/${encodeURIComponent(item.id)}/requests`}
                  className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
                >
                  查看申请
                </Link>
                <button
                  type="button"
                  onClick={() => router.push(`/me/published/${encodeURIComponent(item.id)}/requests`)}
                  className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-stone-800 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80"
                >
                  查看详情记录
                </button>
              </div>
            </div>
          ) : item.status === "offline" ? (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => onUpdateOwnerStatus("active")}
                  className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
                >
                  上架商品
                </button>
                <Link
                  href={getEditPath(item.channel, item.id)}
                  className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-stone-800 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80"
                >
                  编辑商品
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2.5">
                <Link
                  href={`/me/published/${encodeURIComponent(item.id)}/requests`}
                  className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-stone-800 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80"
                >
                  查看申请
                </Link>
                <Link
                  href={getEditPath(item.channel, item.id)}
                  className="inline-flex min-h-[52px] flex-1 items-center justify-center rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
                >
                  编辑商品
                </Link>
              </div>
              <div className="flex gap-2.5">
                <button
                  type="button"
                  onClick={() => onUpdateOwnerStatus("offline")}
                  className="inline-flex min-h-[36px] flex-1 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium text-stone-500 transition hover:bg-stone-100"
                >
                  下架商品
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateOwnerStatus("done")}
                  className="inline-flex min-h-[36px] flex-1 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium text-stone-500 transition hover:bg-stone-100"
                >
                  标记已完成
                </button>
              </div>
            </div>
          )}
        </div>
      ) : null}

      {ownerToast ? (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-[100] max-w-[min(360px,calc(100%-2rem))] -translate-x-1/2 rounded-xl bg-stone-900/92 px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg">
          {ownerToast}
        </div>
      ) : null}
    </div>
  );
}
