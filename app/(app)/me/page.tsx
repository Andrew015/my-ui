export default function MePage() {
  const rows = ["我的发布", "我的订单", "收藏与足迹", "设置"];

  return (
    <div className="px-4 pt-2 pb-4">
      <header className="flex items-center gap-4 py-6">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-teal-400 to-emerald-600 text-xl font-semibold text-white shadow-md">
          邻
        </div>
        <div>
          <p className="text-lg font-semibold text-stone-800">访客用户</p>
          <p className="text-sm text-stone-500">登录 / 资料 · 原型占位</p>
        </div>
      </header>

      <nav className="overflow-hidden rounded-2xl bg-white ring-1 ring-stone-200/80">
        {rows.map((label) => (
          <button
            key={label}
            type="button"
            className="flex w-full items-center justify-between border-b border-stone-100 px-4 py-4 text-left text-sm font-medium text-stone-700 last:border-0 hover:bg-stone-50"
          >
            {label}
            <span className="text-stone-300">›</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
