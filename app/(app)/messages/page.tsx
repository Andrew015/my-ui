"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@/data/mock";
import {
  getChatUnreadCountFor,
  getNotifications,
  getUnreadNotificationCount,
  markAllNotificationsRead,
  markNotificationRead,
  useNotificationStore,
  type NotificationItem,
} from "@/data/notification-store";
import { getMarketplaceItemById } from "@/data/marketplace-store";
import { getTransactions, useTransactionStore, type TransactionStatus } from "@/data/transaction-store";

export default function MessagesPage() {
  const router = useRouter();
  useTransactionStore();
  useNotificationStore();
  const [tab, setTab] = useState<"chat" | "notice">("chat");
  const [pressedNoticeId, setPressedNoticeId] = useState<string | null>(null);
  const allTx = getTransactions().filter(
    (tx) => tx.buyerId === currentUser.id || tx.sellerId === currentUser.id,
  );
  const notices = getNotifications();

  const chatRows = useMemo(
    () =>
      allTx
        .map((tx) => {
        const item = getMarketplaceItemById(tx.itemId);
        const sellerView = tx.sellerId === currentUser.id;
        const otherName = sellerView ? tx.buyerName ?? "买家" : item?.owner ?? "卖家";
        const href = `/messages/${tx.itemId}?transactionId=${encodeURIComponent(tx.id)}&role=${sellerView ? "seller" : "buyer"}`;
        const preview =
          tx.status === "pending"
            ? "已发起申请，等待确认"
            : tx.status === "confirmed"
              ? "交易已确认，可继续沟通交接"
              : tx.status === "processing"
                ? "交易进行中，注意按约定时间完成"
                : tx.status === "completed"
                  ? "交易已完成"
                  : tx.status === "rejected"
                    ? "申请已被拒绝"
                    : "交易已取消";
        return {
          id: tx.id,
          name: otherName,
          itemTitle: item?.title ?? "商品",
          href,
          lastMessageAt: tx.updatedAt,
          time: new Date(tx.updatedAt).toLocaleTimeString("zh-CN", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          preview,
          status: tx.status,
          unreadCount: getChatUnreadCountFor(tx.id),
        };
        })
        .sort((a, b) => {
          const ta = a.lastMessageAt ? new Date(a.lastMessageAt).getTime() : 0;
          const tb = b.lastMessageAt ? new Date(b.lastMessageAt).getTime() : 0;
          return tb - ta;
        }),
    [allTx],
  );

  const unreadNoticeCount = getUnreadNotificationCount();

  return (
    <div className="bg-[#F5F5F5]">
      <PageHeader title="消息" subtitle="聊天与系统通知" />

      <div className="mx-4 mt-3 flex rounded-xl bg-white p-1 ring-1 ring-orange-100/90">
        <button
          type="button"
          onClick={() => setTab("chat")}
          className={`relative flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${tab === "chat" ? "bg-brand text-brand-foreground" : "text-stone-600"}`}
        >
          聊天
          {chatRows.some((r) => r.unreadCount > 0) ? <span className="absolute right-3 top-2 h-2 w-2 rounded-full bg-red-500" /> : null}
        </button>
        <button
          type="button"
          onClick={() => setTab("notice")}
          className={`relative flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${tab === "notice" ? "bg-brand text-brand-foreground" : "text-stone-600"}`}
        >
          通知
          {unreadNoticeCount > 0 ? (
            <span className="absolute right-3 top-1.5 min-w-4 rounded-full bg-red-500 px-1 text-[10px] text-white">
              {unreadNoticeCount}
            </span>
          ) : null}
        </button>
      </div>

      {tab === "chat" ? (
        chatRows.length ? (
          <ul className="mx-4 my-4 divide-y divide-orange-100/90 rounded-2xl bg-white ring-1 ring-orange-100/90">
            {chatRows.map((row) => (
              <li key={row.id} className="relative">
                <Link href={row.href} className="flex w-full items-start gap-3 px-4 py-4 text-left transition hover:bg-stone-50">
                  <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-stone-200/80 text-sm font-medium text-stone-600">
                    {row.name.slice(0, 1)}
                    {row.unreadCount > 0 ? <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium text-stone-800">{row.name}</span>
                      <span className="text-xs text-stone-400">{row.time}</span>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-stone-500">{row.preview}</p>
                    <p className="mt-1 truncate text-xs text-stone-400">
                      {row.itemTitle} · {statusText(row.status)}
                    </p>
                  </div>
                </Link>
                {row.unreadCount > 0 ? (
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                    {row.unreadCount > 99 ? "99+" : row.unreadCount}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <div className="mx-4 my-4 rounded-2xl bg-white p-6 text-center ring-1 ring-orange-100/90">
            <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-lg">💬</div>
            <p className="text-sm font-semibold text-stone-800">暂无聊天</p>
            <p className="mt-2 text-xs text-stone-500">交易沟通会显示在这里</p>
          </div>
        )
      ) : notices.length ? (
        <div className="mx-4 my-4">
          <div className="mb-2 flex items-center justify-end">
            <button
              type="button"
              onClick={() => markAllNotificationsRead()}
              className="rounded-lg bg-stone-100 px-3 py-1.5 text-xs font-medium text-stone-600 transition hover:bg-stone-200"
            >
              全部已读
            </button>
          </div>
          <ul className="space-y-2">
            {groupNotifications(notices).map((group) => (
              <li key={group.title}>
                <p className="mb-1 px-1 text-xs font-medium text-stone-400">{group.title}</p>
                <ul className="space-y-2">
                  {group.items.map((n) => (
                    <li key={n.id}>
                      <button
                        type="button"
                        onClick={() => {
                          markNotificationRead(n.id);
                          setPressedNoticeId(n.id);
                          window.setTimeout(() => {
                            router.push(noticeHref(n));
                            setPressedNoticeId(null);
                          }, 150);
                        }}
                        className={`flex w-full items-start gap-3 rounded-xl p-3 text-left ring-1 transition ${
                          n.isRead
                            ? "bg-stone-50 text-stone-400 ring-stone-200/90"
                            : "bg-white text-stone-700 ring-orange-100/90"
                        } ${pressedNoticeId === n.id ? "scale-[0.99] bg-orange-50/80" : ""}`}
                      >
                        <span className="mt-0.5 text-sm">{noticeIcon(n.type)}</span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className={`text-sm font-semibold ${n.isRead ? "text-stone-500" : "text-stone-800"}`}>{n.title}</p>
                            {!n.isRead ? <span className="h-2 w-2 rounded-full bg-red-500" /> : null}
                          </div>
                          <p className={`mt-1 text-xs ${n.isRead ? "text-stone-400" : "text-stone-600"}`}>{n.content}</p>
                          <p className="mt-1 text-[11px] text-stone-400">{new Date(n.createdAt).toLocaleString("zh-CN")}</p>
                        </div>
                      </button>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="mx-4 my-4 rounded-2xl bg-white p-6 text-center ring-1 ring-orange-100/90">
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-lg">🔔</div>
          <p className="text-sm font-semibold text-stone-800">暂无通知</p>
          <p className="mt-2 text-xs text-stone-500">交易申请、状态变化、系统提醒会显示在这里。</p>
        </div>
      )}
    </div>
  );
}

function statusText(status: TransactionStatus) {
  switch (status) {
    case "pending":
      return "待确认";
    case "confirmed":
      return "已确认";
    case "processing":
      return "交易中";
    case "completed":
      return "已完成";
    case "rejected":
      return "已拒绝";
    case "cancelled":
      return "已取消";
    default:
      return "—";
  }
}

function noticeIcon(type: NotificationItem["type"]) {
  switch (type) {
    case "new_request":
      return "📩";
    case "transaction_confirmed":
      return "✅";
    case "transaction_rejected":
      return "❌";
    case "transaction_processing":
      return "⏳";
    case "transaction_completed":
      return "🎉";
    case "item_offline":
      return "📦";
    case "item_completed":
      return "🏁";
    default:
      return "🔔";
  }
}

function noticeHref(n: NotificationItem) {
  if (n.relatedType === "transaction") return `/transaction/${encodeURIComponent(n.relatedId)}`;
  if (n.relatedType === "message") return `/messages/${encodeURIComponent(n.relatedId)}`;
  return `/detail/${encodeURIComponent(n.relatedId)}`;
}

function groupNotifications(notices: NotificationItem[]) {
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startYesterday = startToday - 24 * 60 * 60 * 1000;
  const today: NotificationItem[] = [];
  const yesterday: NotificationItem[] = [];
  const earlier: NotificationItem[] = [];

  for (const n of notices) {
    const t = new Date(n.createdAt).getTime();
    if (t >= startToday) today.push(n);
    else if (t >= startYesterday) yesterday.push(n);
    else earlier.push(n);
  }

  const groups = [
    { title: "今天", items: today },
    { title: "昨天", items: yesterday },
    { title: "更早", items: earlier },
  ];
  return groups.filter((g) => g.items.length > 0);
}
