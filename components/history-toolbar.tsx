type HistoryToolbarProps = {
  onClear: () => void;
  disabled?: boolean;
};

export function HistoryToolbar({ onClear, disabled = false }: HistoryToolbarProps) {
  return (
    <div className="px-4">
      <div className="flex items-center justify-between rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-orange-100/90">
        <p className="text-sm font-medium text-stone-700">最近浏览记录</p>
        <button
          type="button"
          onClick={onClear}
          disabled={disabled}
          className="rounded-lg px-2.5 py-1 text-xs text-stone-500 transition hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          清空历史
        </button>
      </div>
    </div>
  );
}
