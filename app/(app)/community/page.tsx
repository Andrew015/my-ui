"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { SectionTitle } from "@/components/section-title";
import { ItemCard } from "@/components/item-card";
import { getActiveMarketplaceItemsByChannel, useMarketplaceStore } from "@/data/marketplace-store";

export default function CommunityPage() {
  const marketplace = useMarketplaceStore();
  const giveList = useMemo(
    () => getActiveMarketplaceItemsByChannel("give"),
    [marketplace.statusById],
  );
  const helpList = useMemo(
    () => getActiveMarketplaceItemsByChannel("help"),
    [marketplace.statusById],
  );

  return (
    <div>
      <PageHeader title="邻里公益" backHref="/" subtitle="免费赠送与互助服务" />
      <div className="space-y-5 px-4 py-4">
        <SectionTitle title="公益入口" />
        <Link
          href="/community/give"
          className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-100/90 transition hover:shadow-md"
        >
          <h2 className="text-base font-semibold text-emphasis">免费赠送</h2>
          <p className="mt-1 text-sm text-stone-500">送出闲置，送给需要的人</p>
        </Link>
        <Link
          href="/community/help"
          className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-orange-100/90 transition hover:shadow-md"
        >
          <h2 className="text-base font-semibold text-emphasis">互助服务</h2>
          <p className="mt-1 text-sm text-stone-500">技能与时间互助，邻里搭把手</p>
        </Link>
        <SectionTitle title="最新公益发布" subtitle={`${giveList.length + helpList.length} 条`} />
        <div className="grid gap-3">
          {[...giveList.slice(0, 1), ...helpList.slice(0, 1)].map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
