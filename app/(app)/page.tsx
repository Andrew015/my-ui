"use client";

import Link from "next/link";
import { useMemo } from "react";
import { FavoriteButton } from "@/components/favorite-button";
import { HomeSearchBar } from "@/components/home-search-bar";
import { SectionTitle } from "@/components/section-title";
import { homeEntries } from "@/data/mock";
import { getActiveMarketplaceItemsByChannel, useMarketplaceStore } from "@/data/marketplace-store";

export default function HomePage() {
  const marketplace = useMarketplaceStore();
  const [idleEntry, rentEntry, swapEntry, communityEntry] = homeEntries;
  const nearbySale = useMemo(
    () => getActiveMarketplaceItemsByChannel("idle").slice(0, 4),
    [marketplace.statusById],
  );
  const nearbyRent = useMemo(
    () => getActiveMarketplaceItemsByChannel("rent").slice(0, 2),
    [marketplace.statusById],
  );
  const communityFeed = useMemo(
    () => [
      ...getActiveMarketplaceItemsByChannel("give").slice(0, 1),
      ...getActiveMarketplaceItemsByChannel("help").slice(0, 1),
    ],
    [marketplace.statusById],
  );

  return (
    <div className="px-4 pb-10 pt-1">
      <header className="pt-3">
        <p className="text-xs font-medium uppercase tracking-widest text-emphasis/90">邻里流转</p>
        <h1 className="mt-1.5 text-2xl font-semibold leading-tight tracking-tight text-stone-800">
          让闲置流动起来
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          同小区好价、短租救急、公益互助，一天一个样。
        </p>
      </header>

      <HomeSearchBar />

      <section className="mt-7" aria-label="主入口">
        <div className="mb-3 flex items-end justify-between gap-2">
          <h2 className="text-base font-semibold text-emphasis">主入口</h2>
          <span className="text-xs text-stone-400">先逛再换，更放心</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={idleEntry.href}
            className={`relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${idleEntry.accent} p-5 text-white shadow-md`}
          >
            <span className="inline-flex w-fit rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-medium backdrop-blur-sm">
              热卖
            </span>
            <div>
              <p className="text-lg font-bold leading-snug">{idleEntry.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-white/90">{idleEntry.desc}</p>
              <p className="mt-3 text-[11px] font-medium text-white/80">立即逛 ›</p>
            </div>
          </Link>
          <Link
            href={rentEntry.href}
            className={`relative flex min-h-[132px] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br ${rentEntry.accent} p-5 text-emphasis shadow-md ring-1 ring-orange-200/60`}
          >
            <span className="inline-flex w-fit rounded-full bg-white/70 px-2 py-0.5 text-[10px] font-semibold text-emphasis">
              省心租
            </span>
            <div>
              <p className="text-lg font-bold leading-snug">{rentEntry.title}</p>
              <p className="mt-2 text-xs leading-relaxed text-emphasis/85">{rentEntry.desc}</p>
              <p className="mt-3 text-[11px] font-semibold text-emphasis/80">去看看 ›</p>
            </div>
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2.5">
          <Link
            href={swapEntry.href}
            className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90 transition active:scale-[0.99] hover:shadow-md"
          >
            <span className="text-sm font-semibold text-stone-800">{swapEntry.title}</span>
            <span className="mt-1 text-xs leading-snug text-stone-500">{swapEntry.desc}</span>
          </Link>
          <Link
            href={communityEntry.href}
            className="flex flex-col rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90 transition active:scale-[0.99] hover:shadow-md"
          >
            <span className="text-sm font-semibold text-stone-800">{communityEntry.title}</span>
            <span className="mt-1 text-xs leading-snug text-stone-500">{communityEntry.desc}</span>
          </Link>
        </div>
      </section>

      <div className="mt-7 flex gap-3">
        <Link
          href="/publish"
          className="flex flex-1 items-center justify-center rounded-2xl bg-brand py-3.5 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
        >
          发布闲置 / 出租
        </Link>
        <Link
          href="/idle"
          className="flex flex-1 items-center justify-center rounded-2xl bg-white py-3.5 text-sm font-semibold text-emphasis ring-1 ring-orange-100/90 transition hover:bg-orange-50/80"
        >
          浏览全部在售
        </Link>
      </div>

      <section className="mt-10 rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-orange-100/80">
        <SectionTitle title="附近在售" subtitle="邻里刚上新" />
        {nearbySale.length ? (
          <>
            <div className="grid grid-cols-2 gap-3">
              {nearbySale.map((item) => (
                <Link
                  key={item.id}
                  href={`/detail/${item.id}`}
                  className="relative overflow-hidden rounded-2xl bg-surface shadow-sm ring-1 ring-orange-100/70 transition hover:shadow-md"
                >
                  <FavoriteButton itemId={item.id} className="absolute right-2 top-2" />
                  <div className="h-[88px] bg-gradient-to-br from-orange-100/90 to-stone-100" />
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-medium leading-snug text-stone-800">{item.title}</p>
                    <p className="mt-1.5 text-sm font-semibold text-brand">{item.priceLabel}</p>
                    <p className="mt-1 truncate text-[11px] text-stone-500">{item.location}</p>
                  </div>
                </Link>
              ))}
            </div>
            <Link
              href="/idle"
              className="mt-4 block text-center text-xs font-medium text-brand"
            >
              查看更多在售 ›
            </Link>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-orange-200/80 bg-white/70 py-7 text-center text-sm text-stone-500">
            <p>暂无内容，去发布一条</p>
            <Link href="/publish" className="mt-2 inline-block text-xs font-medium text-brand">
              去发布
            </Link>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-orange-100/80">
        <SectionTitle title="附近可租" subtitle="短租更省心" />
        {nearbyRent.length ? (
          <>
            <div className="space-y-3">
              {nearbyRent.map((item) => (
                <Link
                  key={item.id}
                  href={`/detail/${item.id}`}
                  className="relative flex items-center gap-3 rounded-2xl bg-surface p-3 ring-1 ring-orange-100/60 transition hover:shadow-sm"
                >
                  <FavoriteButton itemId={item.id} className="absolute right-2 top-2" />
                  <div className="h-14 w-14 shrink-0 rounded-xl bg-gradient-to-br from-orange-50 to-yellow-50 ring-1 ring-orange-100/80" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-stone-800">{item.title}</p>
                    <p className="mt-0.5 text-sm font-semibold text-brand">{item.priceLabel}</p>
                    <p className="mt-0.5 truncate text-xs text-stone-500">{item.location}</p>
                  </div>
                  <span className="shrink-0 text-stone-300">›</span>
                </Link>
              ))}
            </div>
            <Link href="/rent" className="mt-4 block text-center text-xs font-medium text-brand">
              进入短租用专区 ›
            </Link>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-orange-200/80 bg-white/70 py-7 text-center text-sm text-stone-500">
            <p>暂无内容，去发布一条</p>
            <Link href="/publish" className="mt-2 inline-block text-xs font-medium text-brand">
              去发布
            </Link>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-orange-100/80">
        <SectionTitle title="公益动态" subtitle="赠送 · 互助" />
        {communityFeed.length ? (
          <>
            <div className="space-y-3">
              {communityFeed.map((item) => (
                <Link
                  key={item.id}
                  href={`/detail/${item.id}`}
                  className="relative block w-full rounded-2xl bg-surface p-4 ring-1 ring-orange-100/60 transition hover:shadow-sm"
                >
                  <FavoriteButton itemId={item.id} className="absolute right-2 top-2" />
                  <div className="flex items-start justify-between gap-3">
                    <p className="min-w-0 flex-1 text-sm font-semibold leading-snug text-stone-800">{item.title}</p>
                    <span className="shrink-0 rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-emphasis">
                      {item.priceLabel}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-stone-500">
                    {item.location} · {item.tag}
                  </p>
                </Link>
              ))}
            </div>
            <Link href="/community" className="mt-4 block text-center text-xs font-medium text-brand">
              进入邻里公益 ›
            </Link>
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-orange-200/80 bg-white/70 py-7 text-center text-sm text-stone-500">
            <p>暂无内容，去发布一条</p>
            <Link href="/publish" className="mt-2 inline-block text-xs font-medium text-brand">
              去发布
            </Link>
          </div>
        )}
      </section>

      <section className="mt-6 rounded-3xl bg-white/90 p-4 shadow-sm ring-1 ring-orange-100/80">
        <p className="text-sm font-semibold text-emphasis">社区小贴士</p>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          优先同小区当面交接，先发实拍、再说价格，邻里交易更省心。
        </p>
      </section>
    </div>
  );
}
