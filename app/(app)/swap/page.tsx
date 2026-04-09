import { PageHeader } from "@/components/page-header";

export default function SwapPage() {
  return (
    <div>
      <PageHeader title="来置换" backHref="/" />
      <div className="px-4 py-6">
        <p className="text-sm leading-relaxed text-stone-600">
          发布想换出的与想换入的，匹配邻里置换意向（原型占位）。
        </p>
        <div className="mt-6 h-40 rounded-2xl bg-amber-100/70" aria-hidden />
      </div>
    </div>
  );
}
