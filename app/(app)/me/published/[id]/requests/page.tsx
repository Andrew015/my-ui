"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { currentUser } from "@/data/mock";
import { getMarketplaceItemById } from "@/data/marketplace-store";
import {
  createTransaction,
  removeTransaction,
  updateTransactionStatus,
  useTransactionStore,
  type Transaction,
  type TransactionStatus,
} from "@/data/transaction-store";
import { getItemCoverClass } from "@/lib/item-cover";
import { parseExchangeLine, parseSwapNote, parseSwapWish } from "@/lib/transaction-parse";
import { startTradeButtonLabel, statusToastMessage } from "@/lib/transaction-status-copy";
import { formatTransactionTime } from "@/lib/transaction-time-format";

type FilterTab = "all" | "pending" | "confirmed" | "rejected" | "cancelled";

const FILTER_TABS: { id: FilterTab; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "pending", label: "待处理" },
  { id: "confirmed", label: "已确认" },
  { id: "rejected", label: "已拒绝" },
  { id: "cancelled", label: "已取消" },
];

function statusLabel(status: TransactionStatus): string {
  switch (status) {
    case "pending":
      return "待处理申请";
    case "confirmed":
      return "已确认";
    case "processing":
      return "交易进行中";
    case "completed":
      return "已完成";
    case "cancelled":
      return "已取消";
    case "rejected":
      return "已拒绝";
    default:
      return "—";
  }
}

function statusClass(status: TransactionStatus): string {
  switch (status) {
    case "pending":
      return "bg-orange-50 text-orange-700 ring-1 ring-orange-200/80";
    case "confirmed":
      return "bg-sky-50 text-sky-700 ring-1 ring-sky-200/85";
    case "processing":
      return "bg-orange-50 text-orange-700 ring-1 ring-orange-200/80";
    case "completed":
      return "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/85";
    case "rejected":
      return "bg-rose-50 text-rose-700 ring-1 ring-rose-200/85";
    case "cancelled":
      return "bg-stone-100 text-stone-500 ring-1 ring-stone-200/85";
    default:
      return "bg-stone-100 text-stone-500 ring-1 ring-stone-200/85";
  }
}

function typeLabel(t: Transaction["type"]): string {
  switch (t) {
    case "buy":
      return "购买";
    case "rent":
      return "租用";
    case "swap":
      return "置换";
    case "give":
      return "领取";
    default:
      return "申请";
  }
}

function parseMethod(tx: Transaction): string {
  if (tx.tradeMethod) return tx.tradeMethod;
  return (
    parseExchangeLine(tx.exchangeContent, "交易方式：") ??
    parseExchangeLine(tx.exchangeContent, "交接方式：") ??
    parseExchangeLine(tx.exchangeContent, "是否方便自提：") ??
    "—"
  );
}

function parseExpected(tx: Transaction): string {
  if (tx.expectedTime) return tx.expectedTime;
  return parseExchangeLine(tx.exchangeContent, "期望时间：") ?? parseExchangeLine(tx.exchangeContent, "预计归还：") ?? "—";
}

function ApplicantCard({
  tx,
  onToast,
}: {
  tx: Transaction;
  onToast: (m: string) => void;
}) {
  const chatHref = `/messages/${tx.itemId}?transactionId=${encodeURIComponent(tx.id)}&role=seller`;
  const txnHref = `/transaction/${encodeURIComponent(tx.id)}`;
  const productHref = `/detail/${tx.itemId}`;
  const startLabel = startTradeButtonLabel(tx.type);
  const completeLabel = tx.type === "rent" ? "确认归还" : "确认完成";
  const weakBtn =
    "inline-flex min-h-[36px] items-center justify-center rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium text-stone-500 transition hover:bg-stone-100";
  const mainBtn =
    "inline-flex min-h-[42px] items-center justify-center rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover";
  const subBtn =
    "inline-flex min-h-[42px] items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-stone-800 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80";

  const mutate = (next: TransactionStatus) => {
    if (updateTransactionStatus(tx.id, next)) onToast(statusToastMessage(next));
  };

  const remove = () => {
    removeTransaction(tx.id);
    onToast("已删除记录");
  };

  let actions = null;

  if (tx.status === "pending") {
    actions = (
      <>
        <div className="flex gap-2">
          <button type="button" className={`${mainBtn} flex-1`} onClick={() => mutate("confirmed")}>
            确认交易
          </button>
          <button type="button" className={`${weakBtn} flex-1`} onClick={() => mutate("rejected")}>
            拒绝
          </button>
        </div>
        <Link href={chatHref} className={`${subBtn} w-full`}>
          联系对方
        </Link>
      </>
    );
  } else if (tx.status === "confirmed") {
    actions = (
      <div className="flex gap-2">
        <button type="button" className={`${mainBtn} flex-1`} onClick={() => mutate("processing")}>
          {startLabel}
        </button>
        <Link href={chatHref} className={`${subBtn} flex-1`}>
          联系对方
        </Link>
      </div>
    );
  } else if (tx.status === "processing") {
    actions = (
      <div className="flex gap-2">
        <button type="button" className={`${mainBtn} flex-1`} onClick={() => mutate("completed")}>
          {completeLabel}
        </button>
        <Link href={chatHref} className={`${subBtn} flex-1`}>
          联系对方
        </Link>
      </div>
    );
  } else if (tx.status === "completed") {
    actions = (
      <div className="flex gap-2">
        <Link href={txnHref} className={`${mainBtn} flex-1`}>
          查看交易
        </Link>
        <Link href={chatHref} className={`${subBtn} flex-1`}>
          再次联系
        </Link>
      </div>
    );
  } else {
    actions = (
      <div className="flex gap-2">
        <Link href={productHref} className={`${subBtn} flex-1`}>
          查看商品
        </Link>
        <button type="button" onClick={remove} className={`${weakBtn} flex-1`}>
          删除记录
        </button>
      </div>
    );
  }

  return (
    <li className={`rounded-2xl bg-white p-3 shadow-sm ring-1 ${tx.status === "pending" ? "ring-orange-200/95" : "ring-orange-100/90"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-orange-100 text-sm">🙂</span>
          <div>
            <p className="text-sm font-semibold text-stone-800">{tx.buyerName ?? "小李"}</p>
            <p className="text-[11px] text-stone-400">{typeLabel(tx.type)}申请</p>
          </div>
        </div>
        <span className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${statusClass(tx.status)}`}>
          {statusLabel(tx.status)}
        </span>
      </div>

      <dl className="mt-3 grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-stone-500">
        <dt className="text-stone-400">交易方式</dt>
        <dd className="text-right text-stone-700">{parseMethod(tx)}</dd>
        <dt className="text-stone-400">期望时间</dt>
        <dd className="text-right text-stone-700">{parseExpected(tx)}</dd>
        <dt className="text-stone-400">创建时间</dt>
        <dd className="text-right text-stone-600">{formatTransactionTime(tx.createdAt)}</dd>
      </dl>

      {tx.type === "rent" ? (
        <p className="mt-2 text-xs text-stone-600">租期 {tx.rentDays ?? "—"} 天 · 押金 {tx.deposit != null ? `¥${tx.deposit}` : "—"}</p>
      ) : null}
      {tx.type === "swap" ? (
        <p className="mt-2 text-xs text-stone-600">
          置换：{parseSwapWish(tx.exchangeContent) ?? "—"} / {parseSwapNote(tx.exchangeContent) ?? "—"}
        </p>
      ) : null}
      {tx.note ? <p className="mt-2 text-xs text-stone-500">备注：{tx.note}</p> : null}

      <div className="mt-3 border-t border-stone-100 pt-3">{actions}</div>
    </li>
  );
}

export default function PublishedRequestsPage() {
  const transactions = useTransactionStore();
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(String(params?.id ?? ""));
  const [tab, setTab] = useState<FilterTab>("all");
  const [toast, setToast] = useState<string | null>(null);
  const item = id ? getMarketplaceItemById(id) : null;
  const all = useMemo(
    () => transactions.filter((t) => t.itemId === id).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()),
    [id, transactions],
  );
  const itemOwnerId = item?.ownerId ?? "";
  const itemId = item?.id ?? "";
  const mockId = itemId ? `mock-request-001-${itemId}` : "";
  const hasMock = useMemo(
    () => (mockId ? transactions.some((t) => t.id === mockId) : false),
    [mockId, transactions],
  );

  useEffect(() => {
    if (!itemId) return;
    if (itemOwnerId !== currentUser.id) return;
    if (hasMock) return;
    if (all.length > 0) return;

    createTransaction({
      id: mockId,
      itemId,
      buyerId: "user-001",
      buyerName: "小李",
      buyerAvatar: "🙂",
      sellerId: currentUser.id,
      type: "buy",
      status: "pending",
      tradeMethod: "当面交易",
      expectedTime: "今天",
      note: "今晚可以在小区门口交易",
    });
  }, [all.length, hasMock, itemId, itemOwnerId, mockId]);

  const counters = useMemo(
    () => ({
      all: all.length,
      pending: all.filter((t) => t.status === "pending").length,
      confirmed: all.filter((t) => t.status === "confirmed").length,
      rejected: all.filter((t) => t.status === "rejected").length,
    }),
    [all],
  );

  const filtered = useMemo(() => {
    if (tab === "all") return all;
    return all.filter((t) => t.status === tab);
  }, [all, tab]);

  const onToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <div className="relative min-h-full bg-gray-100">
      <PageHeader title="收到的申请" backHref="/me/published" />

      <div className="space-y-3 px-4 py-4">
        {item ? (
          <section className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-orange-100/90">
            <div className="flex gap-3">
              <div
                className={`h-16 w-16 shrink-0 rounded-xl bg-cover bg-center ${!item.image ? getItemCoverClass(item) : ""}`}
                style={
                  item.image
                    ? {
                        backgroundImage: `url(${item.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }
                    : undefined
                }
              />
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold text-stone-900">{item.title}</p>
                <p className="mt-1 text-sm font-semibold text-brand">{item.priceLabel}</p>
                <p className="mt-1 text-xs text-stone-500">{item.location}</p>
                <p className="mt-1 text-[11px] text-stone-400">当前状态：{item.status === "active" ? "展示中" : item.status === "offline" ? "已下架" : "已完成"}</p>
              </div>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-orange-100/90">
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-base font-semibold text-stone-900">{counters.all}</p>
              <p className="text-[11px] text-stone-400">全部申请</p>
            </div>
            <div>
              <p className="text-base font-semibold text-orange-600">{counters.pending}</p>
              <p className="text-[11px] text-stone-400">待处理</p>
            </div>
            <div>
              <p className="text-base font-semibold text-sky-600">{counters.confirmed}</p>
              <p className="text-[11px] text-stone-400">已确认</p>
            </div>
            <div>
              <p className="text-base font-semibold text-rose-600">{counters.rejected}</p>
              <p className="text-[11px] text-stone-400">已拒绝</p>
            </div>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-2 shadow-sm ring-1 ring-orange-100/90">
          <div className="flex gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {FILTER_TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                  tab === t.id
                    ? "bg-brand text-brand-foreground shadow-sm"
                    : "bg-white text-stone-600 ring-1 ring-orange-100/90 hover:bg-orange-50/80"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {filtered.length ? (
          <ul className="space-y-3">
            {filtered.map((tx) => (
              <ApplicantCard key={tx.id} tx={tx} onToast={onToast} />
            ))}
          </ul>
        ) : (
          <section className="rounded-2xl bg-white p-5 text-center shadow-sm ring-1 ring-orange-100/90">
            <p className="text-sm font-semibold text-stone-800">暂无申请</p>
            <p className="mt-2 text-xs leading-relaxed text-stone-500">
              有人想购买、租用、置换或领取该内容时，会显示在这里。
            </p>
            <Link
              href="/me/published"
              className="mt-4 inline-flex min-h-[40px] items-center justify-center rounded-xl bg-stone-100 px-4 text-xs font-medium text-stone-600"
            >
              返回我的发布
            </Link>
          </section>
        )}
      </div>

      {toast ? (
        <div className="pointer-events-none fixed bottom-24 left-1/2 z-[100] max-w-[min(360px,calc(100%-2rem))] -translate-x-1/2 rounded-xl bg-stone-900/92 px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg">
          {toast}
        </div>
      ) : null}
    </div>
  );
}
