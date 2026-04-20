import Link from "next/link";
import type { MyPublishedItem } from "@/data/mock";

type PublishedActionsProps = {
  item: MyPublishedItem;
  onEdit: (item: MyPublishedItem) => void;
  onToggleShelf: (item: MyPublishedItem) => void;
  onMarkDone: (item: MyPublishedItem) => void;
  onDelete: (item: MyPublishedItem) => void;
};

export function PublishedActions({
  item,
  onEdit,
  onToggleShelf,
  onMarkDone,
  onDelete,
}: PublishedActionsProps) {
  return (
    <div className="mt-3 flex items-center gap-2 border-t border-stone-100 pt-3">
      {item.status !== "done" ? (
        <button
          type="button"
          onClick={() => onEdit(item)}
          className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-stone-600 transition hover:border-orange-200"
        >
          编辑
        </button>
      ) : null}

      {item.status === "active" ? (
        <>
          <button
            type="button"
            onClick={() => onToggleShelf(item)}
            className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 transition hover:bg-orange-100/70"
          >
            下架
          </button>
          <button
            type="button"
            onClick={() => onMarkDone(item)}
            className="rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700 transition hover:bg-amber-100/70"
          >
            标记完成
          </button>
        </>
      ) : null}

      {item.status === "offline" ? (
        <>
          <button
            type="button"
            onClick={() => onToggleShelf(item)}
            className="rounded-lg bg-orange-50 px-2.5 py-1 text-xs font-medium text-orange-600 transition hover:bg-orange-100/70"
          >
            上架
          </button>
          <button
            type="button"
            onClick={() => onDelete(item)}
            className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-stone-500 transition hover:border-stone-300"
          >
            删除
          </button>
        </>
      ) : null}

      {item.status === "done" ? (
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-stone-500 transition hover:border-stone-300"
        >
          删除
        </button>
      ) : null}

      {item.status === "active" ? (
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="rounded-lg border border-stone-200 px-2.5 py-1 text-xs text-stone-500 transition hover:border-stone-300"
        >
          删除
        </button>
      ) : null}
      <Link
        href={`/detail/${item.detailId ?? item.id}`}
        className="ml-auto rounded-lg bg-brand px-2.5 py-1 text-xs font-medium text-brand-foreground transition hover:bg-brand-hover"
      >
        查看详情
      </Link>
    </div>
  );
}
