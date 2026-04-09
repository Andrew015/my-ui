import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { publishTypes } from "@/data/mock";

export default function PublishPage() {
  return (
    <div>
      <PageHeader title="发布" subtitle="选择你要发布的类型" />

      <div className="space-y-3 px-4 py-4">
        {publishTypes.map((type) => (
          <Link
            key={type.key}
            href={type.href}
            className="block rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/80 transition hover:shadow-md"
          >
            <h2 className="text-base font-semibold text-stone-800">{type.title}</h2>
            <p className="mt-1 text-sm text-stone-500">{type.desc}</p>
          </Link>
        ))}

        <div className="rounded-2xl border border-dashed border-stone-300 bg-white/60 p-4 text-xs text-stone-500">
          下一步将进入表单页面（当前为原型骨架）。
        </div>
      </div>
    </div>
  );
}
