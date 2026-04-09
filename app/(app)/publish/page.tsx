export default function PublishPage() {
  return (
    <div className="px-4 pt-2 pb-4">
      <header className="py-4">
        <h1 className="text-xl font-semibold text-stone-800">发布</h1>
        <p className="mt-1 text-sm text-stone-500">发布闲置、短租或置换意向</p>
      </header>

      <div className="mt-4 space-y-3">
        <div className="rounded-2xl border-2 border-dashed border-teal-300/70 bg-teal-50/50 py-12 text-center">
          <p className="text-sm font-medium text-teal-800">上传图片 / 填写信息</p>
          <p className="mt-1 text-xs text-teal-600/80">此处为发布流程占位</p>
        </div>
        <button
          type="button"
          className="w-full rounded-2xl bg-teal-600 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-teal-700"
        >
          下一步
        </button>
      </div>
    </div>
  );
}
