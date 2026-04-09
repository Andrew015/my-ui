import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { channelMap, getItemById } from "@/data/mock";

export default async function DetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <div>
      <PageHeader title="详情" backHref="/" subtitle={channelMap[item.channel]} />
      <div className="space-y-4 px-4 py-4">
        <div className="h-44 rounded-2xl bg-gradient-to-br from-stone-200 to-stone-100" />
        <div className="rounded-2xl bg-white p-4 ring-1 ring-stone-200/80">
          <p className="text-lg font-semibold text-stone-800">{item.title}</p>
          <p className="mt-2 text-base font-semibold text-teal-700">{item.priceLabel}</p>
          <p className="mt-1 text-xs text-stone-500">
            {item.location} · 发布者 {item.owner}
          </p>
          <p className="mt-3 text-sm leading-relaxed text-stone-600">{item.desc}</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href={`/messages/${item.id}`}
            className="rounded-xl bg-white py-3 text-center text-sm font-medium text-stone-700 ring-1 ring-stone-200/80"
          >
            联系对方
          </Link>
          <Link
            href="/publish"
            className="rounded-xl bg-teal-600 py-3 text-center text-sm font-medium text-white"
          >
            我也发布
          </Link>
        </div>
      </div>
    </div>
  );
}
