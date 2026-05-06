"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { getMarketplaceItemById, useMarketplaceStore } from "@/data/marketplace-store";
import { getTransactionById, type Transaction } from "@/data/transaction-store";
import { getStatusPresentation } from "@/lib/transaction-status";
import { getItemCoverClass } from "@/lib/item-cover";
import { distanceLabel } from "@/lib/transaction-item-utils";

function isHelpTx(tx: Transaction): boolean {
  return tx.type === "give" && Boolean(tx.exchangeContent?.startsWith("互助申请"));
}

function successHeadline(tx: Transaction): string {
  if (isHelpTx(tx)) return "已提交互助申请";
  switch (tx.type) {
    case "buy":
      return "已发起购买请求";
    case "rent":
      return "已发起租用请求";
    case "swap":
      return "已发起置换请求";
    case "give":
      return "已提交领取申请";
    default:
      return "交易已更新";
  }
}

function priceSubtitle(tx: Transaction, itemTitle: string): string {
  if (tx.type === "buy" && tx.amount != null) return `¥${tx.amount} · ${itemTitle}`;
  if (tx.type === "rent") {
    const parts = [
      tx.amount != null ? `租金 ¥${tx.amount}` : "",
      tx.rentDays != null ? `租期 ${tx.rentDays} 天` : "",
    ].filter(Boolean);
    return parts.length ? `${parts.join(" · ")} · ${itemTitle}` : itemTitle;
  }
  if (tx.type === "swap") return tx.note ? `${tx.note} · ${itemTitle}` : itemTitle;
  return tx.note ? `${tx.note} · ${itemTitle}` : itemTitle;
}

function TransactionSuccessContent() {
  useMarketplaceStore();
  const sp = useSearchParams();
  const id = sp.get("id") ?? "";
  const view = sp.get("view") ?? "";

  const tx = id ? getTransactionById(id) : undefined;
  const item = tx ? getMarketplaceItemById(tx.itemId) : null;

  const isDetail = view === "detail";

  if (!id || !tx) {
    return (
      <div className="flex min-h-full flex-col bg-gray-100">
        <PageHeader title="交易" backHref="/me/orders" />
        <div className="px-4 py-8 text-center text-sm text-stone-500">未找到该交易单</div>
        <Link href="/me/orders" className="mx-auto text-sm font-medium text-brand">
          返回我的交易
        </Link>
      </div>
    );
  }

  const statusUi = getStatusPresentation(tx.status);
  const coverClass = item ? getItemCoverClass(item) : "";
  const imgStyle = item?.image
    ? {
        backgroundImage: `url(${item.image})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : undefined;

  const headline = successHeadline(tx);

  return (
    <div className="flex min-h-full flex-col bg-gray-100">
      <PageHeader
        title={isDetail ? "交易详情" : "交易已发起"}
        backHref={isDetail ? "/me/orders" : item ? `/detail/${tx.itemId}` : "/me/orders"}
      />

      <div className="flex-1 space-y-4 px-4 pb-8 pt-4">
        {!isDetail ? (
          <div className="flex flex-col items-center pt-2">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-lg shadow-emerald-500/25">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-white" aria-hidden>
                <path
                  d="M20 6L9 17l-5-5"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h2 className="mt-4 text-center text-lg font-bold text-stone-900">{headline}</h2>
            <p className="mt-2 text-center text-sm text-stone-500">已通知对方，请等待确认。</p>
          </div>
        ) : (
          <div className="pt-1">
            <h2 className="text-center text-lg font-bold text-stone-900">{headline}</h2>
            <p className="mt-2 text-center text-sm text-stone-500">当前交易状态如下</p>
          </div>
        )}

        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <p className="text-xs font-medium text-stone-500">当前状态</p>
          <div className="mt-3">
            <span className={`inline-flex rounded-full px-3 py-1.5 text-sm font-semibold ${statusUi.className}`}>
              {statusUi.label}
            </span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-stone-500">
            {tx.status === "pending"
              ? "对方确认后会进入下一步流程（线下沟通 / 交接）。当前未支付、未成交。"
              : "此为原型状态展示，后续可接双方确认与进度节点。"}
          </p>
        </section>

        {item ? (
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
            <p className="mb-3 text-xs font-medium text-stone-500">商品信息</p>
            <div className="flex gap-3">
              <div
                className={`h-20 w-20 shrink-0 rounded-xl bg-cover bg-center ${!item.image ? coverClass : ""}`}
                style={imgStyle}
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug text-stone-900">{item.title}</p>
                <p className="mt-1 text-sm text-stone-600">{priceSubtitle(tx, item.title)}</p>
                <p className="mt-1 text-xs text-stone-400">
                  {distanceLabel(item)} · 发布者 {item.owner}
                </p>
              </div>
            </div>
          </section>
        ) : (
          <section className="rounded-2xl bg-white p-4 text-sm text-stone-500 shadow-sm ring-1 ring-orange-100/90">
            商品信息暂不可用（可能已下架）
          </section>
        )}

        <div className="flex flex-col gap-3 pt-2">
          <Link
            href={`/messages/${tx.itemId}?transactionId=${encodeURIComponent(tx.id)}&role=buyer`}
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-stone-800 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80"
          >
            联系对方
          </Link>
          <Link
            href="/me/orders"
            className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
          >
            查看我的交易
          </Link>
        </div>
      </div>
    </div>
  );
}

function Fallback() {
  return (
    <div className="min-h-full bg-gray-100">
      <PageHeader title="交易已发起" backHref="/" />
      <div className="px-4 py-8">
        <div className="h-48 animate-pulse rounded-2xl bg-white ring-1 ring-orange-100/90" />
      </div>
    </div>
  );
}

export default function TransactionSuccessPage() {
  return (
    <Suspense fallback={<Fallback />}>
      <TransactionSuccessContent />
    </Suspense>
  );
}
