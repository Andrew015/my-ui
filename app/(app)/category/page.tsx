export default function CategoryPage() {
  const channels = [
    "数码家电",
    "家居日用",
    "图书文娱",
    "母婴儿童",
    "服饰鞋包",
    "运动户外",
  ];

  return (
    <div className="px-4 pt-2 pb-4">
      <header className="py-4">
        <h1 className="text-xl font-semibold text-stone-800">分类 / 频道</h1>
        <p className="mt-1 text-sm text-stone-500">按品类浏览闲置与短租</p>
      </header>

      <div className="grid grid-cols-2 gap-3">
        {channels.map((name) => (
          <button
            key={name}
            type="button"
            className="rounded-2xl bg-white py-6 text-center text-sm font-medium text-stone-700 shadow-sm ring-1 ring-stone-200/80 transition hover:bg-stone-50"
          >
            {name}
          </button>
        ))}
      </div>
    </div>
  );
}
