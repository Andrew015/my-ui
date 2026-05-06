import Link from "next/link";
import { FavoriteButton } from "@/components/favorite-button";
import { getItemSupportTagLabels } from "@/data/mock";
import { getItemCoverClass } from "@/lib/item-cover";
import type { Item } from "@/data/mock";

type ItemCardProps = {
  item: Item;
  variant?: "grid" | "row";
};

export function ItemCard({ item, variant = "row" }: ItemCardProps) {
  const supportTags = getItemSupportTagLabels(item);

  if (variant === "grid") {
    const distanceLine =
      item.distanceKm != null ? `${item.location} · ${item.distanceKm}km` : item.location;

    const coverStyle = item.image
      ? { backgroundImage: `url(${item.image})`, backgroundSize: "cover", backgroundPosition: "center" }
      : undefined;

    return (
      <Link
        href={`/detail/${item.id}`}
        className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-orange-100/70 transition-all duration-200 hover:shadow-md active:scale-[0.98]"
      >
        <div
          className={`relative aspect-square w-full ${!item.image ? getItemCoverClass(item) : ""}`}
          style={coverStyle}
        >
          <FavoriteButton itemId={item.id} className="absolute right-2 top-2" />
        </div>
        <div className="space-y-1.5 px-2.5 pb-3 pt-2.5">
          <h3 className="line-clamp-2 min-h-[2.5rem] text-[13px] font-medium leading-snug text-stone-800">
            {item.title}
          </h3>
          <p className="text-xl font-semibold tabular-nums leading-none text-brand">{item.priceLabel}</p>
          {supportTags.length ? (
            <div className="flex flex-wrap gap-1">
              {supportTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded bg-orange-50 px-1.5 py-0.5 text-[10px] leading-tight text-orange-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
          <span className="inline-flex max-w-full rounded bg-stone-100 px-1.5 py-0.5 text-[10px] leading-tight text-stone-500">
            {item.tag}
          </span>
          <p className="truncate text-xs leading-tight text-stone-400">{distanceLine}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/detail/${item.id}`}
      className="relative block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90 transition hover:shadow-md"
    >
      <FavoriteButton itemId={item.id} className="absolute right-3 top-3" />
      <div className={`mb-3 h-28 rounded-xl ${getItemCoverClass(item)} ring-1 ring-orange-100/50`} />
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-stone-800">{item.title}</h3>
        <span className="shrink-0 rounded-full bg-stone-100 px-2 py-0.5 text-[11px] font-medium text-stone-600">
          {item.tag}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-brand">{item.priceLabel}</p>
      {supportTags.length ? (
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {supportTags.map((tag) => (
            <span key={tag} className="rounded bg-orange-50 px-2 py-0.5 text-[11px] text-orange-600">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <p className="mt-1 text-xs text-stone-500">
        {item.location} · {item.owner}
      </p>
    </Link>
  );
}
