import Link from "next/link";
import type { MarketplaceItem } from "@/data/marketplace-store";

type MapItemCardProps = {
  item: MarketplaceItem;
};

function getTypeLabel(item: MarketplaceItem) {
  if (item.channel === "idle") return "出售";
  if (item.channel === "rent") return "出租";
  if (item.channel === "swap") return "置换";
  return "公益";
}

function getMainText(item: MarketplaceItem) {
  if (item.channel === "swap") return `想换 ${item.expectedSwapType ?? "同类物品"}`;
  return item.priceLabel;
}

export function MapItemCard({ item }: MapItemCardProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-orange-100/90">
      <div className="flex items-start justify-between gap-2">
        <p className="line-clamp-2 flex-1 text-sm font-semibold text-stone-800">{item.title}</p>
        <span className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] text-orange-600">
          {getTypeLabel(item)}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-brand">{getMainText(item)}</p>
      <p className="mt-1 text-xs text-stone-500">
        {item.location}
        {item.distanceKm != null ? ` · ${item.distanceKm}km` : ""}
      </p>

      <div className="mt-3 flex justify-end">
        <Link
          href={`/detail/${item.id}`}
          className="rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground"
        >
          查看详情
        </Link>
      </div>
    </section>
  );
}
