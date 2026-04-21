import { RelatedCard } from "@/components/related-card";
import type { MarketplaceItem } from "@/data/marketplace-store";

type RelatedSectionProps = {
  title: string;
  items: MarketplaceItem[];
  variant?: "horizontal" | "grid";
};

export function RelatedSection({
  title,
  items,
  variant = "horizontal",
}: RelatedSectionProps) {
  if (!items.length) return null;

  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <h2 className="text-sm font-semibold text-stone-800">{title}</h2>
      {variant === "horizontal" ? (
        <div className="mt-3 flex gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {items.map((item) => (
            <RelatedCard key={item.id} item={item} compact />
          ))}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-2 gap-3">
          {items.map((item) => (
            <RelatedCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </section>
  );
}
