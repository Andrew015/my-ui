"use client";

type CategorySelectorProps = {
  label?: string;
  categories: string[];
  selectedCategory: string;
  onSelect: (value: string) => void;
};

export function CategorySelector({
  label = "分类",
  categories,
  selectedCategory,
  onSelect,
}: CategorySelectorProps) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <h2 className="text-sm font-semibold text-stone-800">{label}</h2>
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1 whitespace-nowrap">
        {categories.map((category) => {
          const active = selectedCategory === category;
          return (
            <button
              key={category}
              type="button"
              onClick={() => onSelect(category)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
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
