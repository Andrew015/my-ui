import { PageHeader } from "@/components/page-header";

export default function CommunityGivePage() {
  return (
    <div>
      <PageHeader title="免费赠送" backHref="/community" />
      <div className="px-4 py-6">
        <p className="text-sm leading-relaxed text-stone-600">
          赠送物品列表与发布入口（原型占位）。
        </p>
        <div className="mt-6 h-36 rounded-2xl bg-rose-100/60" aria-hidden />
      </div>
    </div>
  );
}
