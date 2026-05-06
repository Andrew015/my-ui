"use client";

export type LocationFilterType = "all" | "sell" | "rent" | "swap" | "community";

type LocationFilterTabsProps = {
  value: LocationFilterType;
  onChange: (value: LocationFilterType) => void;
};

const tabs: { key: LocationFilterType; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "sell", label: "出售" },
  { key: "rent", label: "出租" },
  { key: "swap", label: "置换" },
  { key: "community", label: "公益" },
];

export function LocationFilterTabs({ value, onChange }: LocationFilterTabsProps) {
  return (
    <div className="flex gap-2 overflow-x-auto whitespace-nowrap pb-1">
      {tabs.map((tab) => {
        const active = value === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition ${
              active
                ? "bg-brand text-brand-foreground shadow-sm"
                : "bg-white text-stone-600 ring-1 ring-orange-100/90"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
