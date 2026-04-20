import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { publishTypes } from "@/data/mock";

export default function PublishPage() {
  return (
    <div className="min-h-full bg-gray-100">
      <PageHeader title="发布信息" backHref="/" />

      <div className="space-y-3 px-4 py-4">
        {publishTypes.map((type) => (
          <Link
            key={type.key}
            href={type.href}
            className="block rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90 transition active:scale-[0.99] hover:shadow-md"
          >
            <h2 className="text-base font-semibold text-stone-800">{type.title}</h2>
            <p className="mt-1 text-sm text-stone-500">{type.desc}</p>
            <p className="mt-3 text-xs font-medium text-brand">立即发布 ›</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
