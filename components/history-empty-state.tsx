import Link from "next/link";

export function HistoryEmptyState() {
  return (
    <section className="mx-4 rounded-xl bg-white px-4 py-8 text-center shadow-sm ring-1 ring-orange-100/90">
      <div className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50 text-2xl">
        🕒
      </div>
      <p className="text-sm text-stone-500">你还没有浏览过任何内容</p>
      <Link
        href="/"
        className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
      >
        去逛一逛
      </Link>
    </section>
  );
}
