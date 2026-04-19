import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export default function CategoryPage() {
  const channels = [
    { name: "淘闲置", href: "/idle" },
    { name: "短租用", href: "/rent" },
    { name: "来置换", href: "/swap" },
    { name: "邻里公益", href: "/community" },
    { name: "免费赠送", href: "/community/give" },
    { name: "互助服务", href: "/community/help" },
  ];

  return (
    <div>
      <PageHeader title="分类" subtitle="快速进入不同频道" />

      <div className="grid grid-cols-2 gap-3 px-4 py-4">
        {channels.map((row) => (
          <Link
            key={row.href}
            href={row.href}
            className="rounded-2xl bg-white py-6 text-center text-sm font-medium text-stone-700 shadow-sm ring-1 ring-orange-100/90 transition hover:bg-stone-50"
          >
            {row.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
