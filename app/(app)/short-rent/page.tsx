import { PageHeader } from "@/components/page-header";

export default function ShortRentPage() {
  return (
    <div>
      <PageHeader title="短租用" backHref="/" />
      <div className="px-4 py-6">
        <p className="text-sm leading-relaxed text-stone-600">
          短期租用工具、设备等，租期与押金流程在此配置（原型占位）。
        </p>
        <div className="mt-6 h-40 rounded-2xl bg-sky-100/70" aria-hidden />
      </div>
    </div>
  );
}
