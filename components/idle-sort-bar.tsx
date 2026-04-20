export type IdleSortKey = "综合" | "最新" | "附近" | "价格";

const sortOptions: IdleSortKey[] = ["综合", "最新", "附近", "价格"];

type IdleSortBarProps = {
  activeSort: IdleSortKey;
  priceOrder: "asc" | "desc";
  onSortChange: (sort: IdleSortKey) => void;
  onPriceToggle: () => void;
};

export function IdleSortBar({
  activeSort,
  priceOrder,
  onSortChange,
  onPriceToggle,
}: IdleSortBarProps) {
  return (
    <div className="rounded-xl bg-white px-2 shadow-sm ring-1 ring-orange-100/90">
      <div className="flex">
        {sortOptions.map((label) => {
          const active = label === activeSort;
          return (
            <button
              key={label}
              type="button"
              onClick={() => {
                if (label === "价格") {
                  if (activeSort === "价格") {
                    onPriceToggle();
                  } else {
                    onSortChange("价格");
                  }
                  return;
                }
                onSortChange(label);
              }}
              className={`min-w-0 flex-1 border-b-2 py-2.5 text-center text-xs font-medium transition-colors ${
                active
                  ? "border-brand font-semibold text-brand"
                  : "border-transparent text-stone-500 hover:text-stone-700"
              }`}
            >
              <span className="truncate">
                {label}
                {label === "价格" && activeSort === "价格"
                  ? priceOrder === "asc"
                    ? " ↑"
                    : " ↓"
                  : ""}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
