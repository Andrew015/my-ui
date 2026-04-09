export default function MessagesPage() {
  const placeholders = [
    { name: "系统通知", preview: "欢迎使用邻里流转…" },
    { name: "交易咨询", preview: "原型占位：聊天列表" },
  ];

  return (
    <div className="px-4 pt-2 pb-4">
      <header className="py-4">
        <h1 className="text-xl font-semibold text-stone-800">消息</h1>
        <p className="mt-1 text-sm text-stone-500">通知与聊天</p>
      </header>

      <ul className="divide-y divide-stone-200/90 rounded-2xl bg-white ring-1 ring-stone-200/80">
        {placeholders.map((row) => (
          <li key={row.name}>
            <button
              type="button"
              className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-stone-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-200/80 text-sm font-medium text-stone-600">
                {row.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-stone-800">{row.name}</span>
                  <span className="text-xs text-stone-400">刚刚</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-stone-500">
                  {row.preview}
                </p>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
