import Link from "next/link";
import type { MarketplaceItem } from "@/data/marketplace-store";
import { getItemCoverClass } from "@/lib/item-cover";

type RelatedCardProps = {
  item: MarketplaceItem;
  compact?: boolean;
};

export function RelatedCard({ item, compact = false }: RelatedCardProps) {
  const coverStyle = item.image
    ? { backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" }
    : undefined;
  const distanceText =
    item.distanceKm != null ? `${item.location} · ${item.distanceKm}km` : item.location;

  return (
    <Link
      href={`/detail/${item.id}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-orange-100/80 transition hover:shadow-md active:scale-[0.98] ${
        compact ? "w-[156px] shrink-0" : "w-full"
      }`}
    >
      <div
        className={`w-full ${compact ? "h-24" : "h-28"} ${!item.image ? getItemCoverClass(item) : "bg-neutral-100"}`}
        style={coverStyle}
      />
      <div className="space-y-1.5 p-2.5">
        <p className="line-clamp-2 min-h-[2.5rem] text-sm font-medium leading-snug text-stone-800">{item.title}</p>
        <p className="text-sm font-semibold text-brand">{item.priceLabel}</p>
        <span className="inline-flex max-w-full rounded bg-orange-50 px-1.5 py-0.5 text-[10px] leading-tight text-orange-500">
          {item.tag}
        </span>
        <p className="truncate text-[11px] text-stone-400">{distanceText}</p>
      </div>
    </Link>
  );
}
