import type { MyPublishedItem } from "@/data/mock";
import { PublishedActions } from "@/components/published-actions";

type PublishedCardProps = {
  item: MyPublishedItem;
  onEdit: (item: MyPublishedItem) => void;
  onToggleShelf: (item: MyPublishedItem) => void;
  onMarkDone: (item: MyPublishedItem) => void;
  onDelete: (item: MyPublishedItem) => void;
};

function getTypeStyle(type: MyPublishedItem["type"]) {
  if (type === "sell") return "bg-orange-50 text-orange-600";
  if (type === "rent") return "bg-amber-50 text-amber-700";
  if (type === "swap") return "bg-yellow-100 text-yellow-800";
  return "bg-emerald-50 text-emerald-700";
}

function getTypeLabel(type: MyPublishedItem["type"]) {
  if (type === "sell") return "出售";
  if (type === "rent") return "出租";
  if (type === "swap") return "置换";
  return "公益";
}

function getStatusStyle(status: MyPublishedItem["status"]) {
  if (status === "active") return "bg-emerald-50 text-emerald-700";
  if (status === "offline") return "bg-stone-100 text-stone-500";
  return "bg-neutral-200 text-neutral-700";
}

function getStatusLabel(status: MyPublishedItem["status"]) {
  if (status === "active") return "展示中";
  if (status === "offline") return "已下架";
  return "已完成";
}

function getMainInfo(item: MyPublishedItem) {
  if (item.type === "sell") return `￥${item.price ?? "-"}`;
  if (item.type === "rent") return `￥${item.rentPrice ?? "-"}/天`;
  if (item.type === "swap") return `想换 ${item.exchangeWish ?? "同类物品"}`;
  return item.communityMode === "help" ? "互助服务" : "免费赠送";
}

export function PublishedCard({ item, onEdit, onToggleShelf, onMarkDone, onDelete }: PublishedCardProps) {
  return (
    <article
      className={`rounded-xl bg-white p-3 shadow-sm ring-1 ring-orange-100/90 ${
        item.status === "done" ? "opacity-80" : ""
      }`}
    >
      <div className="flex gap-3">
        <div className="h-16 w-16 shrink-0 rounded-xl bg-gradient-to-br from-orange-50 to-gray-100 ring-1 ring-orange-100/80" />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="line-clamp-2 flex-1 text-sm font-semibold leading-snug text-stone-800">
              {item.title}
            </h3>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] ${getTypeStyle(item.type)}`}>
              {getTypeLabel(item.type)}
            </span>
          </div>
          <p className="mt-1 text-sm font-semibold text-brand">{getMainInfo(item)}</p>
          <p className="mt-1 truncate text-xs text-stone-500">{item.description}</p>
          <div className="mt-1.5 flex items-center gap-2 text-[11px] text-stone-400">
            <span>{item.createdAt}</span>
            <span>·</span>
            <span>{item.location}</span>
            <span className={`ml-auto rounded-full px-2 py-0.5 ${getStatusStyle(item.status)}`}>
              {getStatusLabel(item.status)}
            </span>
          </div>
        </div>
      </div>

      <PublishedActions
        item={item}
        onEdit={onEdit}
        onToggleShelf={onToggleShelf}
        onMarkDone={onMarkDone}
        onDelete={onDelete}
      />
    </article>
  );
}
