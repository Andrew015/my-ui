"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { ItemCard } from "@/components/item-card";
import { SectionTitle } from "@/components/section-title";
import { getActiveMarketplaceItemsByChannel, useMarketplaceStore } from "@/data/marketplace-store";

export default function CommunityHelpPage() {
  const marketplace = useMarketplaceStore();
  const list = useMemo(
    () => getActiveMarketplaceItemsByChannel("help"),
    [marketplace.statusById],
  );

  return (
    <div>
      <PageHeader title="互助服务" backHref="/community" subtitle="邻里协作，共建社区" />
      <div className="px-4 py-4">
        <SectionTitle title="互助需求" subtitle={`${list.length} 条`} />
        <div className="grid gap-3">
          {list.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
