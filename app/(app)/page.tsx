import Link from "next/link";

const primaryEntries = [
  { href: "/idle", title: "淘闲置", desc: "附近好物，轻松淘", badge: "热门" },
  { href: "/short-rent", title: "短租用", desc: "短期用得上，不必买", badge: "实用" },
] as const;

const secondaryEntries = [
  { href: "/swap", title: "来置换", desc: "以物换物，各取所需" },
  { href: "/community", title: "邻里公益", desc: "免费赠送 · 互助服务" },
] as const;

const nearbySale = [
  { title: "九成新咖啡机", meta: "步行 8 分钟 · 128元" },
  { title: "婴儿推车", meta: "同小区 · 220元" },
  { title: "显示器 24寸", meta: "骑行 6 分钟 · 360元" },
] as const;

const nearbyRent = [
  { title: "露营天幕套装", meta: "2天起租 · 35元/天" },
  { title: "家用投影仪", meta: "周末可租 · 42元/天" },
  { title: "电钻工具箱", meta: "押金可免 · 20元/天" },
] as const;

const communityFeed = [
  { type: "免费赠送", title: "儿童绘本一套", meta: "1小时前 · 阳光花园" },
  { type: "互助服务", title: "周末可帮遛狗", meta: "3小时前 · 河畔社区" },
  { type: "免费赠送", title: "办公椅自提", meta: "今天 · 邻里中心" },
] as const;

export default function HomePage() {
  return (
    <div className="relative px-4 pt-2 pb-24">
      <header className="pt-3 pb-4">
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
        <p className="mb-3 text-xs font-medium text-stone-400">核心入口</p>
        <div className="grid grid-cols-2 gap-3">
          {primaryEntries.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-3xl bg-gradient-to-br from-teal-500 to-emerald-600 p-4 text-white shadow-md shadow-teal-600/20 transition hover:shadow-lg active:scale-[0.99]"
            >
              <p className="inline-flex rounded-full bg-white/20 px-2 py-0.5 text-[11px] font-medium">
                {item.badge}
              </p>
              <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-white/85">{item.desc}</p>
            </Link>
          ))}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          {secondaryEntries.map((item) => (
            <div key={item.href}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-2xl bg-white/90 p-3.5 shadow-sm ring-1 ring-stone-200/80 transition hover:bg-white"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-stone-100 text-sm font-semibold text-stone-500">
                  {item.title.slice(0, 1)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-semibold text-stone-700">{item.title}</h3>
                  <p className="mt-0.5 text-xs text-stone-500">{item.desc}</p>
                </div>
                <span className="text-stone-300">›</span>
              </Link>

              {item.href === "/community" && (
                <div className="mt-2 flex gap-2 pl-2">
                  <Link
                    href="/community/give"
                    className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-rose-700 ring-1 ring-rose-200/80 transition hover:bg-rose-50"
                  >
                    免费赠送
                  </Link>
                  <Link
                    href="/community/help"
                    className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-medium text-pink-700 ring-1 ring-pink-200/80 transition hover:bg-pink-50"
                  >
                    互助服务
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">附近在售</h2>
          <Link href="/idle" className="text-xs text-teal-700">
            查看更多
          </Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {nearbySale.map((item) => (
            <Link
              key={item.title}
              href="/idle"
              className="min-w-[180px] rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-stone-200/80"
            >
              <div className="h-20 rounded-xl bg-teal-100/70" />
              <p className="mt-2 text-sm font-medium text-stone-800">{item.title}</p>
              <p className="mt-0.5 text-xs text-stone-500">{item.meta}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/80">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">附近可租</h2>
          <Link href="/short-rent" className="text-xs text-sky-700">
            全部可租
          </Link>
        </div>
        <div className="space-y-3">
          {nearbyRent.map((item) => (
            <Link
              key={item.title}
              href="/short-rent"
              className="flex items-center justify-between rounded-xl bg-sky-50/70 px-3 py-2.5"
            >
              <div>
                <p className="text-sm font-medium text-stone-800">{item.title}</p>
                <p className="text-xs text-stone-500">{item.meta}</p>
              </div>
              <span className="text-stone-300">›</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/80">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-700">公益动态</h2>
          <Link href="/community" className="text-xs text-rose-700">
            进入公益
          </Link>
        </div>
        <div className="space-y-2.5">
          {communityFeed.map((item) => (
            <Link
              key={`${item.type}-${item.title}`}
              href={item.type === "免费赠送" ? "/community/give" : "/community/help"}
              className="block rounded-xl bg-rose-50/40 px-3 py-2.5"
            >
              <p className="text-xs font-medium text-rose-700">{item.type}</p>
              <p className="mt-0.5 text-sm font-medium text-stone-800">{item.title}</p>
              <p className="mt-0.5 text-xs text-stone-500">{item.meta}</p>
            </Link>
          ))}
        </div>
      </section>

      <Link
        href="/publish"
        className="absolute right-5 bottom-6 z-10 inline-flex h-12 items-center gap-2 rounded-full bg-teal-600 px-4 text-sm font-semibold text-white shadow-lg shadow-teal-600/30 transition hover:bg-teal-700"
      >
        <span className="text-base leading-none">＋</span>
        发布
      </Link>
    </div>
  );
}
