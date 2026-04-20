"use client";

import type { PublishCategory } from "@/data/mock";

type PublishCategoryProps = {
  categories: PublishCategory[];
  selectedCategory: PublishCategory;
  onSelect: (category: PublishCategory) => void;
};

export function PublishCategory({
  categories,
  selectedCategory,
  onSelect,
}: PublishCategoryProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <h2 className="text-sm font-semibold text-stone-800">分类</h2>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm transition ${
                active
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-orange-200 hover:text-stone-800"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </section>
  );
}
