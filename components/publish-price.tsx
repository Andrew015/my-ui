"use client";

type PublishPriceProps = {
  value: string;
  onChange: (value: string) => void;
};

export function PublishPrice({ value, onChange }: PublishPriceProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <label className="text-sm font-semibold text-stone-800">价格</label>
      <div className="mt-3 flex items-center gap-2 rounded-xl border border-stone-200 bg-white px-3 py-3 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
        <span className="text-base font-semibold text-orange-500">￥</span>
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          inputMode="decimal"
          placeholder="请输入价格"
          className="min-w-0 flex-1 bg-transparent text-sm text-stone-700 outline-none placeholder:text-stone-400"
        />
      </div>
    </section>
  );
}
