type IdleSearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onFocus?: () => void;
  showCancel?: boolean;
  onCancel?: () => void;
  placeholder?: string;
};

export function IdleSearchBar({
  value,
  onChange,
  onSubmit,
  onFocus,
  showCancel = false,
  onCancel,
  placeholder = "搜索闲置商品",
}: IdleSearchBarProps) {
  return (
    <div className="flex items-center gap-2">
      <form
        className="flex-1 rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-orange-100/90"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit?.();
        }}
      >
        <div className="flex items-center gap-2">
          <svg
            className="h-4 w-4 shrink-0 text-stone-400"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.2-3.2" />
          </svg>
          <input
            value={value}
            onFocus={onFocus}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-w-0 flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 outline-none"
            aria-label="搜索闲置商品"
          />
          <button
            type="submit"
            className="rounded-lg bg-orange-50 px-2 py-1 text-xs font-medium text-orange-600"
          >
            搜索
          </button>
        </div>
      </form>
      {showCancel ? (
        <button
          type="button"
          onClick={onCancel}
          className="shrink-0 text-sm text-stone-500"
        >
          取消
        </button>
      ) : null}
    </div>
  );
}
