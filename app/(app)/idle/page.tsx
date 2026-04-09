import { PageHeader } from "@/components/page-header";

export default function IdlePage() {
  return (
    <div>
      <PageHeader title="淘闲置" backHref="/" />
      <div className="px-4 py-6">
        <p className="text-sm leading-relaxed text-stone-600">
          浏览附近闲置好物，列表与筛选在此展开（原型占位）。
        </p>
        <div className="mt-6 h-40 rounded-2xl bg-stone-200/60" aria-hidden />
      </div>
    </div>
  );
}
