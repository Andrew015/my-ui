type FavoritesStatsProps = {
  total: number;
  active: number;
  invalid: number;
};

export function FavoritesStats({ total, active, invalid }: FavoritesStatsProps) {
  const cards = [
    { label: "全部收藏", value: total },
    { label: "在售/可浏览", value: active },
    { label: "已失效", value: invalid },
  ];

  return (
    <section className="grid grid-cols-3 gap-2 px-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl bg-white px-3 py-3 text-center shadow-sm ring-1 ring-orange-100/90"
        >
          <p className="text-lg font-semibold text-brand">{card.value}</p>
          <p className="mt-1 text-[11px] text-stone-500">{card.label}</p>
        </div>
      ))}
    </section>
  );
}
