"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { TransactionConfirmView } from "@/components/transaction-confirm-view";
import { PageHeader } from "@/components/page-header";
import { getMarketplaceItemById } from "@/data/marketplace-store";

const VALID = new Set(["buy", "rent", "swap", "give", "help"]);

function TransactionConfirmContent() {
  const sp = useSearchParams();
  const rawType = sp.get("type") ?? "";
  const itemId = sp.get("itemId") ?? "";

  const confirmType = VALID.has(rawType) ? (rawType as "buy" | "rent" | "swap" | "give" | "help") : null;
  const item = itemId ? getMarketplaceItemById(itemId) : null;

  if (!itemId || !confirmType) {
    return (
      <div className="flex min-h-full flex-col bg-gray-100">
        <PageHeader title="确认交易" backHref="/" />
        <div className="px-4 py-6">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
            <p className="text-sm text-stone-500">链接无效或缺少参数（需要 type 与 itemId）。</p>
            <Link
              href="/"
              className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground"
            >
              返回首页
            </Link>
          </section>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="flex min-h-full flex-col bg-gray-100">
        <PageHeader title="确认交易" backHref="/" />
        <div className="px-4 py-6">
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
            <p className="text-sm text-stone-500">商品不存在或已下架。</p>
            <Link href="/idle" className="mt-4 inline-flex rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-brand-foreground">
              去逛逛
            </Link>
          </section>
        </div>
      </div>
    );
  }

  return <TransactionConfirmView item={item} confirmType={confirmType} />;
}

function TransactionConfirmFallback() {
  return (
    <div className="flex min-h-full flex-col bg-gray-100">
      <PageHeader title="确认交易" backHref="/" />
      <div className="px-4 py-6">
        <div className="h-56 animate-pulse rounded-2xl bg-white shadow-sm ring-1 ring-orange-100/90" />
      </div>
    </div>
  );
}

export default function TransactionConfirmPage() {
  return (
    <Suspense fallback={<TransactionConfirmFallback />}>
      <TransactionConfirmContent />
    </Suspense>
  );
}
