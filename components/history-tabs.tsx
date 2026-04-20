type HistoryTypeFilter = "all" | "sell" | "rent" | "swap" | "community";

type HistoryTabsProps = {
  value: HistoryTypeFilter;
  onChange: (value: HistoryTypeFilter) => void;
};

const tabs: { key: HistoryTypeFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "sell", label: "出售" },
  { key: "rent", label: "出租" },
  { key: "swap", label: "置换" },
  { key: "community", label: "公益" },
];

export function HistoryTabs({ value, onChange }: HistoryTabsProps) {
  return (
    <div className="px-4">
      <div className="flex gap-2 overflow-x-auto whitespace-nowrap rounded-xl bg-white p-2 shadow-sm ring-1 ring-orange-100/90">
        {tabs.map((tab) => {
          const active = value === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm transition ${
                active
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200/70"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
