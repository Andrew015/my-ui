"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import type { Item } from "@/data/mock";
import type { MarketplaceItem } from "@/data/marketplace-store";
import {
  removeTransaction,
  updateTransactionStatus,
  type Transaction,
  type TransactionStatus,
} from "@/data/transaction-store";
import { getItemCoverClass } from "@/lib/item-cover";
import { distanceLabel } from "@/lib/transaction-item-utils";
import {
  listStatusStrip,
  startTradeButtonLabel,
  statusToastMessage,
} from "@/lib/transaction-status-copy";

const TYPE_LABEL: Record<Transaction["type"], string> = {
  buy: "购买",
  rent: "租用",
  swap: "置换",
  give: "公益",
};

function isHelpIntent(tx: Transaction): boolean {
  return tx.type === "give" && Boolean(tx.exchangeContent?.startsWith("互助申请"));
}

function tradeTypeLabel(tx: Transaction): string {
  if (isHelpIntent(tx)) return "互助";
  if (tx.type === "give") return "领取 / 赠送";
  return TYPE_LABEL[tx.type];
}

const FALLBACK_ITEM: Item = {
  id: "_",
  channel: "idle",
  title: "",
  priceLabel: "",
  location: "",
  owner: "",
  tag: "",
  desc: "",
};

function lineAfterPrefix(content: string | undefined, prefix: string): string | undefined {
  if (!content) return undefined;
  for (const line of content.split(/\r?\n/)) {
    const t = line.trim();
    if (t.startsWith(prefix)) return t.slice(prefix.length).trim() || undefined;
  }
  return undefined;
}

function priceSummary(tx: Transaction, item: MarketplaceItem | Item | null): string {
  if (!item) return tx.note ?? "—";
  if (tx.type === "buy") return tx.amount != null ? `¥${tx.amount}` : item.priceLabel;
  if (tx.type === "rent") return tx.amount != null ? `租金小计 ¥${tx.amount}` : item.priceLabel;
  if (tx.type === "swap") return tx.note ? `置换说明：${tx.note}` : item.priceLabel;
  return tx.note ?? item.priceLabel;
}

type Props = {
  tx: Transaction;
  item: MarketplaceItem | Item | null;
  onToast: (msg: string) => void;
};

function tryUpdate(tx: Transaction, next: TransactionStatus, onToast: (m: string) => void) {
  if (updateTransactionStatus(tx.id, next)) {
    onToast(statusToastMessage(next));
  }
}

export function OrderTransactionCard({ tx, item, onToast }: Props) {
  const [cancelOpen, setCancelOpen] = useState(false);
  const coverClass = getItemCoverClass(item ?? { ...FALLBACK_ITEM, id: tx.itemId });
  const imgStyle = item?.image
    ? {
        backgroundImage: `url(${item.image})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : undefined;

  const productDetailHref = `/detail/${tx.itemId}`;
  const chatHref = `/messages/${tx.itemId}?transactionId=${encodeURIComponent(tx.id)}&role=buyer`;
  const txnDetailHref = `/transaction/${encodeURIComponent(tx.id)}`;

  const strip = listStatusStrip(tx);

  const parsed = useMemo(() => {
    const c = tx.exchangeContent;
    const method =
      lineAfterPrefix(c, "交易方式：") ??
      lineAfterPrefix(c, "交接方式：");
    const expectTime =
      lineAfterPrefix(c, "期望时间：") ?? lineAfterPrefix(c, "预计归还：");
    return { method: method ?? "—", expectTime: expectTime ?? "—" };
  }, [tx.exchangeContent]);

  const runCancel = () => {
    tryUpdate(tx, "cancelled", onToast);
    setCancelOpen(false);
  };

  const simulateConfirm = () => tryUpdate(tx, "confirmed", onToast);
  const startTrade = () => tryUpdate(tx, "processing", onToast);
  const confirmFinish = () => tryUpdate(tx, "completed", onToast);

  const deleteRecord = () => {
    removeTransaction(tx.id);
    onToast("已删除记录");
  };

  const btnMain =
    "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover";
  const btnSub =
    "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-stone-800 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80";
  const btnWeak =
    "inline-flex min-h-[38px] items-center justify-center rounded-lg border border-stone-200 bg-stone-50 px-4 text-xs font-medium text-stone-500 transition hover:bg-stone-100";
  const btnRowConfirm =
    "w-full min-h-[42px] rounded-xl border-2 border-brand/90 bg-orange-50/40 text-sm font-semibold text-brand transition hover:bg-orange-50/80";

  const isRent = tx.type === "rent";
  const st = tx.status;
  const completeLabel = isRent ? "确认归还" : "确认完成";
  const startLabel = startTradeButtonLabel(tx.type);

  let actions: ReactNode = null;

  if (st === "pending") {
    actions = (
      <>
        <div className="flex gap-2">
          <Link href={txnDetailHref} className={btnMain}>
            查看详情
          </Link>
          <Link href={chatHref} className={btnSub}>
            联系对方
          </Link>
        </div>
        <button type="button" className={btnRowConfirm} onClick={simulateConfirm}>
          模拟对方确认
        </button>
        <div className="flex justify-end pt-0.5">
          <button type="button" className={btnWeak} onClick={() => setCancelOpen(true)}>
            取消交易
          </button>
        </div>
      </>
    );
  } else if (st === "confirmed") {
    actions = (
      <>
        <div className="flex gap-2">
          <Link href={txnDetailHref} className={btnMain}>
            查看详情
          </Link>
          <Link href={chatHref} className={btnSub}>
            联系对方
          </Link>
        </div>
        <button type="button" className={btnRowConfirm} onClick={startTrade}>
          {startLabel}
        </button>
        <div className="flex justify-end pt-0.5">
          <button type="button" className={btnWeak} onClick={() => setCancelOpen(true)}>
            取消交易
          </button>
        </div>
      </>
    );
  } else if (st === "processing") {
    actions = (
      <>
        <div className="flex gap-2">
          <Link href={txnDetailHref} className={btnMain}>
            查看详情
          </Link>
          <Link href={chatHref} className={btnSub}>
            联系对方
          </Link>
        </div>
        <button type="button" className={btnRowConfirm} onClick={confirmFinish}>
          {completeLabel}
        </button>
      </>
    );
  } else if (st === "completed") {
    actions = (
      <div className="flex gap-2">
        <Link href={productDetailHref} className={btnMain}>
          查看商品
        </Link>
        <Link href={chatHref} className={btnSub}>
          再次联系
        </Link>
      </div>
    );
  } else if (st === "cancelled" || st === "rejected") {
    actions = (
      <>
        <Link
          href={productDetailHref}
          className="inline-flex min-h-[44px] w-full items-center justify-center rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
        >
          查看商品
        </Link>
        <div className="flex justify-end gap-2 pt-0.5">
          <Link href={chatHref} className={btnWeak}>
            再次联系
          </Link>
          <button type="button" className={btnWeak} onClick={deleteRecord}>
            删除记录
          </button>
        </div>
      </>
    );
  }

  return (
    <li className="relative rounded-2xl bg-white p-3 shadow-sm ring-1 ring-orange-100/90">
      {/* 1. 商品信息 */}
      <div className="flex gap-3">
        <Link
          href={productDetailHref}
          className={`relative block h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl bg-cover bg-center ${!item?.image ? coverClass : ""}`}
          style={imgStyle}
        />
        <div className="min-w-0 flex-1">
          <Link href={productDetailHref} className="line-clamp-2 text-[15px] font-semibold leading-snug text-stone-900 hover:text-brand">
            {item?.title ?? "商品已不可用"}
          </Link>
          <p className="mt-0.5 text-sm font-semibold text-brand">{priceSummary(tx, item)}</p>
          <p className="mt-0.5 text-xs text-stone-500">
            {item ? (
              <>
                {item.owner} · {distanceLabel(item)}
              </>
            ) : (
              "—"
            )}
          </p>
        </div>
      </div>

      {/* 2. 轻量状态条 */}
      <div className={`mt-3 rounded-xl px-3 py-2 ${strip.wrap}`}>
        <p className="text-[13px] font-semibold text-stone-800">{strip.title}</p>
        {strip.desc ? <p className="mt-0.5 text-[11px] leading-snug text-stone-500">{strip.desc}</p> : null}
      </div>

      {/* 3. 交易信息 */}
      <div className="mt-3 border-t border-stone-100 pt-3">
        <dl className="grid grid-cols-2 gap-x-2 gap-y-1.5 text-[11px] text-stone-500">
          <dt className="text-stone-400">交易类型</dt>
          <dd className="text-right font-medium text-stone-700">{tradeTypeLabel(tx)}</dd>
          <dt className="text-stone-400">交易方式</dt>
          <dd className="text-right text-stone-600">{parsed.method}</dd>
          <dt className="text-stone-400">{isRent ? "归还说明" : "期望时间"}</dt>
          <dd className="text-right text-stone-600">{parsed.expectTime}</dd>
          <dt className="text-stone-400">创建时间</dt>
          <dd className="break-words text-right text-stone-600">{new Date(tx.createdAt).toLocaleString("zh-CN")}</dd>
        </dl>

        {isRent ? (
          <dl className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1 border-t border-dashed border-stone-100 pt-2 text-[11px] text-stone-500">
            <dt className="text-stone-400">租期</dt>
            <dd className="text-right font-medium text-stone-700">{tx.rentDays != null ? `${tx.rentDays} 天` : "—"}</dd>
            <dt className="text-stone-400">押金</dt>
            <dd className="text-right text-stone-700">{tx.deposit != null ? `¥${tx.deposit}` : "—"}</dd>
            <dt className="text-stone-400">租金小计</dt>
            <dd className="text-right font-semibold text-brand">{tx.amount != null ? `¥${tx.amount}` : "—"}</dd>
          </dl>
        ) : null}
      </div>

      {actions ? <div className="mt-3 flex flex-col gap-2 border-t border-stone-100 pt-3">{actions}</div> : null}

      {cancelOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cancel-dialog-title"
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/45 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center"
          onClick={() => setCancelOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-stone-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            <p id="cancel-dialog-title" className="text-center text-base font-semibold text-stone-900">
              确认取消这笔交易吗？
            </p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-stone-200 bg-white text-sm font-semibold text-stone-700 transition hover:bg-stone-50"
                onClick={() => setCancelOpen(false)}
              >
                暂不取消
              </button>
              <button
                type="button"
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover"
                onClick={runCancel}
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </li>
  );
}
