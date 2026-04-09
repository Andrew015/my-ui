import { PageHeader } from "@/components/page-header";

export default function CommunityHelpPage() {
  return (
    <div>
      <PageHeader title="互助服务" backHref="/community" />
      <div className="px-4 py-6">
        <p className="text-sm leading-relaxed text-stone-600">
          邻里互助需求与响应（原型占位）。
        </p>
        <div className="mt-6 h-36 rounded-2xl bg-pink-100/60" aria-hidden />
      </div>
    </div>
  );
}
