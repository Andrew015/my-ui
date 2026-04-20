import Link from "next/link";
import type { MarketplaceItem } from "@/data/marketplace-store";
import { formatViewedAt } from "@/lib/format-viewed-time";

type HistoryCardItem = MarketplaceItem & { viewedAt: number };

type HistoryCardProps = {
  item: HistoryCardItem;
  onRemove: (id: string) => void;
};

function getTypeLabel(item: MarketplaceItem) {
  if (item.channel === "idle") return "出售";
  if (item.channel === "rent") return "出租";
  if (item.channel === "swap") return "置换";
  return "公益";
}

function getTypeStyle(item: MarketplaceItem) {
  if (item.channel === "idle") return "bg-orange-50 text-orange-600";
  if (item.channel === "rent") return "bg-amber-50 text-amber-700";
  if (item.channel === "swap") return "bg-yellow-100 text-yellow-800";
  return "bg-emerald-50 text-emerald-700";
}

function getStatusLabel(status: MarketplaceItem["status"]) {
  if (status === "active") return "展示中";
  if (status === "offline") return "已下架";
  return "已完成";
}

function getStatusStyle(status: MarketplaceItem["status"]) {
  if (status === "active") return "bg-emerald-50 text-emerald-700";
  if (status === "offline") return "bg-stone-100 text-stone-500";
  return "bg-neutral-200 text-neutral-700";
}

function getMainText(item: MarketplaceItem) {
  if (item.channel === "swap") return `想换 ${item.expectedSwapType ?? "同类好物"}`;
  if (item.channel === "give") return "免费赠送";
  if (item.channel === "help") return "互助服务";
  return item.priceLabel;
}

export function HistoryCard({ item, onRemove }: HistoryCardProps) {
  const dimmed = item.status !== "active";

  return (
    <article
      className={`rounded-xl bg-white p-3 shadow-sm ring-1 ring-orange-100/90 ${dimmed ? "bg-gray-50 opacity-90" : ""}`}
    >
      <div className="flex gap-3">
        <div className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-orange-50 to-gray-100 ring-1 ring-orange-100/80" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-stone-800">
              {item.title}
            </h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${getTypeStyle(item)}`}>
              {getTypeLabel(item)}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-brand">{getMainText(item)}</p>
          <p className="mt-1 truncate text-xs text-stone-500">{item.location}</p>
          <div className="mt-1.5 flex items-center gap-2">
            <span className="text-xs text-stone-400">{formatViewedAt(item.viewedAt)}</span>
            <span className={`ml-auto rounded-full px-2 py-0.5 text-[11px] ${getStatusStyle(item.status)}`}>
              {getStatusLabel(item.status)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 border-t border-stone-100 pt-3">
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-stone-600 transition hover:border-orange-200"
        >
          删除记录
        </button>
        <Link
          href={`/detail/${item.id}`}
          className="ml-auto rounded-lg bg-brand px-2.5 py-1 text-xs font-medium text-brand-foreground transition hover:bg-brand-hover"
        >
          查看详情
        </Link>
      </div>
    </article>
  );
}
