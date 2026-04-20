import type { IdleCategory } from "@/data/mock";
import { idleCategories } from "@/data/mock";

type IdleCategoryTabsProps = {
  active: IdleCategory;
  onChange: (category: IdleCategory) => void;
};

export function IdleCategoryTabs({ active, onChange }: IdleCategoryTabsProps) {
  return (
    <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      <div className="flex w-max min-w-full flex-nowrap gap-2 whitespace-nowrap" role="tablist" aria-label="商品分类">
        {idleCategories.map((category) => {
          const isActive = category === active;
          return (
            <button
              key={category}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(category)}
              className={`shrink-0 rounded-full px-3.5 py-2 text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "scale-105 bg-brand text-brand-foreground shadow-md shadow-orange-500/25"
                  : "bg-white text-stone-600 ring-1 ring-orange-100/90 hover:bg-orange-50/80"
              }`}
            >
              {category}
            </button>
          );
        })}
      </div>
    </div>
  );
}
