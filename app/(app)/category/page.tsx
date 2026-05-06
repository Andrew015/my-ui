import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { homeEntries } from "@/data/mock";

export default function CategoryPage() {
  const channels = homeEntries.map((entry) => ({
    name: entry.title,
    desc: entry.desc,
    href: entry.href,
  }));
  const recommendTags = [
    { label: "附近低价好物", href: "/idle" },
    { label: "临时工具租用", href: "/rent" },
    { label: "免费可领", href: "/community/give" },
    { label: "邻里帮忙", href: "/community/help" },
  ];

  return (
    <div className="pb-8">
      <PageHeader title="分类" subtitle="快速进入不同邻里流转方式" />

      <div className="px-4">
        <p className="-mt-1 text-xs leading-relaxed text-stone-500">
          在你身边 1-3 公里内，找到最合适的交易方式
        </p>

        <section className="mt-4 grid grid-cols-2 gap-3" aria-label="主入口">
          {channels.map((row) => (
            <Link
              key={row.href}
              href={row.href}
              className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90 transition active:scale-[0.99] hover:shadow-md"
            >
              <p className="text-sm font-semibold text-stone-800">{row.name}</p>
              <p className="mt-1 text-xs leading-snug text-stone-500">{row.desc}</p>
            </Link>
          ))}
        </section>

        <section className="mt-6 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-emphasis">推荐浏览</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {recommendTags.map((tag) => (
              <Link
                key={tag.href}
                href={tag.href}
                className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-medium text-emphasis ring-1 ring-orange-200/80 transition active:scale-[0.98]"
              >
                {tag.label}
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-emphasis">使用说明</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            发布闲置 / 出租 / 置换 / 公益
          </p>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">
            浏览附近 1-3 公里内容
          </p>
          <p className="mt-1 text-sm leading-relaxed text-stone-600">联系对方完成流转</p>
        </section>

        <section className="mt-6 rounded-2xl bg-gradient-to-r from-orange-100 to-amber-50 p-4 shadow-sm ring-1 ring-orange-200/90">
          <p className="text-base font-semibold text-emphasis">发布我的闲置 / 服务</p>
          <p className="mt-1 text-xs text-stone-600">让身边的人看到你的闲置</p>
          <Link
            href="/publish"
            className="mt-3 inline-flex rounded-full bg-brand px-4 py-2 text-sm font-medium text-white shadow-sm transition active:scale-[0.98]"
          >
            立即发布
          </Link>
        </section>
      </div>
    </div>
  );
}
