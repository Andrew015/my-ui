"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { ChatRoom } from "@/components/chat-room";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@/data/mock";
import { getMarketplaceItemById, useMarketplaceStore } from "@/data/marketplace-store";
import { markChatRead } from "@/data/notification-store";
import { getTransactionById, getTransactions } from "@/data/transaction-store";

export default function MessageDetailPage() {
  const params = useParams<{ id: string }>();
  const sp = useSearchParams();
  const id = String(params?.id ?? "");
  const marketplace = useMarketplaceStore();
  const item = getMarketplaceItemById(id);
  const txId = sp.get("transactionId");
  const roleParam = sp.get("role");
  const txFromId = txId ? getTransactionById(txId) : undefined;
  const txFromItem = getTransactions().find((t) => t.itemId === id);
  const tx = txFromId ?? txFromItem;

  const role: "buyer" | "seller" =
    roleParam === "seller" || roleParam === "buyer"
      ? roleParam
      : tx
        ? tx.sellerId === currentUser.id
          ? "seller"
          : "buyer"
        : "buyer";

  useEffect(() => {
    if (!tx?.id) return;
    markChatRead(tx.id);
  }, [tx?.id]);

  if (!item) {
    return (
      <div className="min-h-full bg-[#F5F5F5]">
        <PageHeader title="会话详情" backHref="/messages" />
        <div className="py-6">
          <EmptyState message="内容不存在" actionHref="/messages" actionLabel="返回消息列表" />
        </div>
      </div>
    );
  }
  const statusLabel = item.distanceKm
    ? `刚刚活跃 · 距离 ${item.distanceKm.toFixed(1)}km`
    : "1小时前活跃";
  const thumbStyle = item.image
    ? { backgroundImage: `url(${item.image})`, backgroundSize: "cover" as const, backgroundPosition: "center" as const }
    : undefined;
  const statusText = item.status === "active" ? "展示中" : item.status === "offline" ? "已下架" : "已完成";
  const statusClass =
    item.status === "active"
      ? "bg-emerald-50 text-emerald-700"
      : item.status === "offline"
        ? "bg-stone-100 text-stone-500"
        : "bg-neutral-200 text-neutral-700";

  return (
    <div className="flex min-h-full flex-col bg-[#F5F5F5]" key={marketplace.statusById[item.id] ?? "active"}>
      <PageHeader title={item.owner} backHref="/messages" subtitle={statusLabel} />

      <div className="px-4 pt-3">
        <Link
          href={`/detail/${item.id}`}
          className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-orange-100/90"
        >
          <div
            className={`relative h-12 w-12 shrink-0 overflow-hidden rounded-xl ${
              !item.image ? "bg-gradient-to-br from-orange-50 to-gray-100" : "bg-neutral-100"
            }`}
            style={thumbStyle}
          >
            {!item.image ? (
              <span className="absolute inset-0 flex items-center justify-center text-base" aria-hidden>
                📦
              </span>
            ) : null}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="truncate text-sm font-semibold text-stone-800">{item.title}</p>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] ${statusClass}`}>
                {statusText}
              </span>
            </div>
            <p className="mt-1 text-sm font-semibold text-brand">{item.priceLabel}</p>
            <p className="mt-1 truncate text-xs text-stone-500">
              {item.location} · {item.tag}
            </p>
          </div>
        </Link>
      </div>

      <ChatRoom ownerName={item.owner} itemStatus={item.status} role={role} transactionStatus={tx?.status} />
    </div>
  );
}
