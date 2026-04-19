import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export default function MessagesPage() {
  const placeholders = [
    { name: "李阿姨", preview: "你好，椅子还在，欢迎来看看", href: "/messages/idle-chair-001" },
    { name: "王师傅", preview: "冲击钻可以按天租，今天可取", href: "/messages/rent-drill-101" },
  ];

  return (
    <div>
      <PageHeader title="消息" subtitle="最近联系人" />

      <ul className="mx-4 my-4 divide-y divide-orange-100/90 rounded-2xl bg-white ring-1 ring-orange-100/90">
        {placeholders.map((row) => (
          <li key={row.name}>
            <Link
              href={row.href}
              className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-stone-50"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-200/80 text-sm font-medium text-stone-600">
                {row.name.slice(0, 1)}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-medium text-stone-800">{row.name}</span>
                  <span className="text-xs text-stone-400">刚刚</span>
                </div>
                <p className="mt-0.5 truncate text-sm text-stone-500">
                  {row.preview}
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
