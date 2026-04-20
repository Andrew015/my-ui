import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export default function MePage() {
  const rows = [
    { label: "我的发布", href: "/me/published" },
    { label: "我的收藏", href: "/me/favorites" },
    { label: "浏览历史", href: "/me/history" },
    { label: "消息中心", href: "/messages" },
    { label: "分类浏览", href: "/category" },
  ];

  return (
    <div>
      <PageHeader title="我的" subtitle="个人中心原型" />
      <header className="flex items-center gap-4 px-4 py-5">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand to-orange-700 text-xl font-semibold text-brand-foreground shadow-md">
          邻
        </div>
        <div>
          <p className="text-lg font-semibold text-stone-800">访客用户</p>
          <p className="text-sm text-stone-500">登录 / 资料 · 原型占位</p>
        </div>
      </header>

      <nav className="mx-4 overflow-hidden rounded-2xl bg-white ring-1 ring-orange-100/90">
        {rows.map((row) => (
          <Link
            key={row.label}
            href={row.href}
            className="flex w-full items-center justify-between border-b border-stone-100 px-4 py-4 text-left text-sm font-medium text-stone-700 last:border-0 hover:bg-stone-50"
          >
            {row.label}
            <span className="text-stone-300">›</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
