"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import { OrderTransactionCard } from "@/components/order-transaction-card";
import { PageHeader } from "@/components/page-header";
import { getMarketplaceItemById, useMarketplaceStore } from "@/data/marketplace-store";
import {
  getTransactions,
  useTransactionStore,
  type Transaction,
  type TransactionType,
} from "@/data/transaction-store";

type TypeTabId = "all" | TransactionType | "public";

const TYPE_TABS: { id: TypeTabId; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "buy", label: "购买" },
  { id: "rent", label: "租用" },
  { id: "swap", label: "置换" },
  { id: "public", label: "公益" },
];

type StatusTabId = "all" | "pending" | "progress" | "completed" | "cancelled" | "rejected";

const STATUS_TABS: { id: StatusTabId; label: string }[] = [
  { id: "all", label: "全部状态" },
  { id: "pending", label: "待确认" },
  { id: "progress", label: "进行中" },
  { id: "completed", label: "已完成" },
  { id: "cancelled", label: "已取消" },
  { id: "rejected", label: "已拒绝" },
];

function matchesTypeTab(tx: Transaction, tab: TypeTabId): boolean {
  if (tab === "all") return true;
  if (tab === "public") return tx.type === "give";
  return tx.type === tab;
}

function matchesStatusTab(tx: Transaction, tab: StatusTabId): boolean {
  if (tab === "all") return true;
  if (tab === "pending") return tx.status === "pending";
  if (tab === "progress") return tx.status === "confirmed" || tx.status === "processing";
  if (tab === "completed") return tx.status === "completed";
  if (tab === "cancelled") return tx.status === "cancelled";
  if (tab === "rejected") return tx.status === "rejected";
  return true;
}

export default function OrdersPage() {
  useMarketplaceStore();
  useTransactionStore();

  const [typeTab, setTypeTab] = useState<TypeTabId>("all");
  const [statusTab, setStatusTab] = useState<StatusTabId>("all");
  const [toast, setToast] = useState<string | null>(null);

  const onToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  }, []);

  const all = getTransactions();

  const filtered = useMemo(
    () =>
      all.filter(
        (tx) => matchesTypeTab(tx, typeTab) && matchesStatusTab(tx, statusTab),
      ),
    [all, typeTab, statusTab],
  );

  const emptySection = (
    <section className="rounded-2xl bg-white p-8 text-center shadow-sm ring-1 ring-orange-100/90">
      <p className="text-base font-semibold text-stone-800">暂无相关交易</p>
      <p className="mt-2 text-sm leading-relaxed text-stone-500">
        你发起的购买、租用、置换或领取申请会显示在这里。
      </p>
      <Link
        href="/idle"
        className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-brand px-8 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
      >
        去逛逛
      </Link>
    </section>
  );

  return (
    <div className="relative flex min-h-full flex-col bg-gray-100">
      <PageHeader title="我的交易" backHref="/me" />

      <div className="border-b border-orange-100/80 bg-gray-100 px-3 py-2">
        <div className="flex items-center gap-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {TYPE_TABS.map((t) => (
            <button
              key={`t-${t.id}`}
              type="button"
              onClick={() => setTypeTab(t.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                typeTab === t.id
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "bg-white text-stone-600 ring-1 ring-orange-100/90 hover:bg-orange-50/80"
              }`}
            >
              {t.label}
            </button>
          ))}
          <span
            className="mx-0.5 h-7 w-px shrink-0 select-none bg-orange-200/90"
            aria-hidden
          />
          {STATUS_TABS.map((t) => (
            <button
              key={`s-${t.id}`}
              type="button"
              onClick={() => setStatusTab(t.id)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                statusTab === t.id
                  ? "bg-brand text-brand-foreground shadow-sm"
                  : "bg-white text-stone-600 ring-1 ring-orange-100/90 hover:bg-orange-50/80"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 px-4 py-4">
        {all.length === 0 ? (
          emptySection
        ) : filtered.length === 0 ? (
          emptySection
        ) : (
          <ul className="flex flex-col gap-3">
            {filtered.map((tx) => (
              <OrderTransactionCard
                key={tx.id}
                tx={tx}
                item={getMarketplaceItemById(tx.itemId)}
                onToast={onToast}
              />
            ))}
          </ul>
        )}
      </div>

      {toast ? (
        <div
          role="status"
          className="pointer-events-none fixed bottom-24 left-1/2 z-[100] max-w-[min(360px,calc(100%-2rem))] -translate-x-1/2 rounded-xl bg-stone-900/92 px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
