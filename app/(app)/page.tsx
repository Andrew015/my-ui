import Link from "next/link";
import { SectionTitle } from "@/components/section-title";
import { getItemsByChannel, homeEntries } from "@/data/mock";

export default function HomePage() {
  const [idleEntry, rentEntry, swapEntry, communityEntry] = homeEntries;
  const nearbySale = getItemsByChannel("idle").slice(0, 4);
  const nearbyRent = getItemsByChannel("rent").slice(0, 2);
  const communityFeed = [
    ...getItemsByChannel("give").slice(0, 1),
    ...getItemsByChannel("help").slice(0, 1),
  ];

  return (
    <div className="px-4 pt-2 pb-4">
      <header className="pt-3 pb-5">
        <p className="text-xs font-medium uppercase tracking-widest text-teal-700/80">
          邻里流转
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-stone-800">
          让闲置流动起来
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          淘好物、短租、置换与公益，都在这一个社区里。
        </p>
      </header>

      <section aria-label="核心入口">
        <SectionTitle title="核心入口" subtitle="买卖、租用、置换、公益" />
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={idleEntry.href}
            className={`rounded-2xl bg-gradient-to-br ${idleEntry.accent} p-4 text-white shadow-sm`}
          >
            <p className="text-base font-semibold">{idleEntry.title}</p>
            <p className="mt-2 text-xs text-white/85">{idleEntry.desc}</p>
          </Link>
          <Link
            href={rentEntry.href}
            className={`rounded-2xl bg-gradient-to-br ${rentEntry.accent} p-4 text-white shadow-sm`}
          >
            <p className="text-base font-semibold">{rentEntry.title}</p>
            <p className="mt-2 text-xs text-white/85">{rentEntry.desc}</p>
          </Link>
        </div>

        <div className="mt-3 grid gap-3">
          <Link
            href={swapEntry.href}
            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/80"
          >
            <div>
              <p className="text-base font-semibold text-stone-800">{swapEntry.title}</p>
              <p className="mt-1 text-sm text-stone-500">{swapEntry.desc}</p>
            </div>
            <span className="text-stone-300">›</span>
          </Link>
          <Link
            href={communityEntry.href}
            className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/80"
          >
            <div>
              <p className="text-base font-semibold text-stone-800">{communityEntry.title}</p>
              <p className="mt-1 text-sm text-stone-500">{communityEntry.desc}</p>
            </div>
            <span className="text-stone-300">›</span>
          </Link>
        </div>

      </section>

      <section className="mt-8 grid grid-cols-2 gap-3">
        <Link
          href="/idle"
          className="rounded-2xl bg-white p-4 text-center text-sm font-medium text-stone-700 ring-1 ring-stone-200/80"
        >
          进入淘闲置
        </Link>
        <Link
          href="/publish"
          className="rounded-2xl bg-white p-4 text-center text-sm font-medium text-stone-700 ring-1 ring-stone-200/80"
        >
          去发布
        </Link>
      </section>

      <section className="mt-8">
        <SectionTitle title="附近在售" subtitle="邻里刚上新" />
        <div className="grid grid-cols-2 gap-3">
          {nearbySale.map((item) => (
            <Link
              key={item.id}
              href={`/detail/${item.id}`}
              className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/80 transition hover:shadow-md"
            >
              <div className="h-24 bg-gradient-to-br from-stone-200 to-stone-100" />
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-stone-800">{item.title}</p>
                <p className="mt-1 text-sm font-semibold text-rose-600">{item.priceLabel}</p>
                <p className="mt-1 truncate text-[11px] text-stone-500">{item.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle title="附近可租" subtitle="短租更省心" />
        <div className="space-y-3">
          {nearbyRent.map((item) => (
            <Link
              key={item.id}
              href={`/detail/${item.id}`}
              className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200/80 transition hover:shadow-md"
            >
              <div className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-sky-100 to-cyan-100" />
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-stone-800">{item.title}</p>
                <p className="mt-0.5 text-sm font-semibold text-sky-700">{item.priceLabel}</p>
                <p className="mt-0.5 truncate text-xs text-stone-500">{item.location}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <SectionTitle title="公益动态" subtitle="免费赠送 · 互助服务" />
        <div className="space-y-3">
          {communityFeed.map((item) => (
            <Link
              key={item.id}
              href={`/detail/${item.id}`}
              className="block w-full rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/80 transition hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <p className="min-w-0 flex-1 truncate text-sm font-semibold text-stone-800">
                  {item.title}
                </p>
                <span className="shrink-0 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  {item.priceLabel}
                </span>
              </div>
              <p className="mt-1 truncate text-xs text-stone-500">
                {item.location} · {item.tag}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-4 ring-1 ring-stone-200/80">
        <p className="text-sm font-semibold text-stone-800">社区小提示</p>
        <p className="mt-2 text-sm leading-relaxed text-stone-500">
          优先选择同小区面交，互相说明物品状态与使用方式，让每一次流转都更安心、更友好。
        </p>
      </section>
    </div>
  );
}
