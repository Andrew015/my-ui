import Link from "next/link";
import type { Item } from "@/data/mock";

export function ItemCard({ item }: { item: Item }) {
  return (
    <Link
      href={`/detail/${item.id}`}
      className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/80 transition hover:shadow-md"
    >
      <div className="mb-3 h-28 rounded-xl bg-gradient-to-br from-stone-100 to-stone-200/70" />
      <div className="flex items-start justify-between gap-2">
        <h3 className="line-clamp-2 text-sm font-semibold text-stone-800">{item.title}</h3>
        <span className="shrink-0 rounded-full bg-teal-50 px-2 py-0.5 text-xs font-medium text-teal-700">
          {item.tag}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-teal-700">{item.priceLabel}</p>
      <p className="mt-1 text-xs text-stone-500">
        {item.location} · {item.owner}
      </p>
    </Link>
  );
}
