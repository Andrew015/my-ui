import Link from "next/link";
import { notFound } from "next/navigation";
import { ChatRoom } from "@/components/chat-room";
import { PageHeader } from "@/components/page-header";
import { getItemById } from "@/data/mock";

export default async function MessageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = getItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <div className="flex min-h-full flex-col">
      <PageHeader title={item.owner} backHref="/messages" subtitle="在线沟通中" />

      <div className="px-4 pt-3">
        <Link
          href={`/detail/${item.id}`}
          className="block rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200/80"
        >
          <p className="text-sm font-semibold text-stone-800">{item.title}</p>
          <p className="mt-1 text-sm font-semibold text-teal-700">{item.priceLabel}</p>
          <p className="mt-1 text-xs text-stone-500">
            {item.location} · {item.tag}
          </p>
        </Link>
      </div>

      <ChatRoom ownerName={item.owner} />
    </div>
  );
}
