"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { getItemDetailTags } from "@/data/mock";
import { getMarketplaceItemById, useMarketplaceStore } from "@/data/marketplace-store";
import {
  getTransactionById,
  removeTransaction,
  updateTransactionStatus,
  useTransactionStore,
  type Transaction,
  type TransactionStatus,
} from "@/data/transaction-store";
import { parseSwapNote, parseSwapWish, parseExchangeLine } from "@/lib/transaction-parse";
import { getItemCoverClass } from "@/lib/item-cover";
import { distanceLabel } from "@/lib/transaction-item-utils";
import { getStatusLogTime } from "@/lib/transaction-log-utils";
import {
  detailStatusStrip,
  startTradeButtonLabel,
  statusToastMessage,
} from "@/lib/transaction-status-copy";
import { formatTransactionTime } from "@/lib/transaction-time-format";
import { getTransactionTimeline, type TimelineResult } from "@/lib/transaction-timeline";

function tradeTypeLabel(tx: Transaction): string {
  if (tx.type === "give" && tx.exchangeContent?.startsWith("互助申请")) return "互助";
  if (tx.type === "give") return "公益";
  const m: Record<string, string> = { buy: "购买", rent: "租用", swap: "置换" };
  return m[tx.type] ?? "—";
}

function formatOrderNo(id: string): string {
  const short = id.replace(/^txn_/, "").slice(0, 10).toUpperCase();
  return `NO.${short}`;
}

function timelineStepMeta(tl: TimelineResult, stepIndex: number, tx: Transaction): ReactNode {
  if (tl.mode === "cancelled" || tl.mode === "rejected") return null;

  const createdFmt = formatTransactionTime(tx.createdAt);

  if (tl.mode === "all-complete") {
    if (stepIndex === 0) {
      return (
        <p className="mt-0.5 text-xs text-stone-400">
          {getStatusLogTime(tx, "pending") ?? createdFmt}
        </p>
      );
    }
    if (stepIndex === 1) {
      const t = getStatusLogTime(tx, "confirmed");
      return t ? <p className="mt-0.5 text-xs text-stone-400">{t}</p> : null;
    }
    if (stepIndex === 2) {
      const t = getStatusLogTime(tx, "processing");
      return t ? <p className="mt-0.5 text-xs text-stone-400">{t}</p> : null;
    }
    if (stepIndex === 3) {
      const t = getStatusLogTime(tx, "processing");
      return t ? <p className="mt-0.5 text-xs text-stone-400">{t}</p> : null;
    }
    if (stepIndex === tl.steps.length - 1) {
      const t = getStatusLogTime(tx, "completed");
      return t ? <p className="mt-0.5 text-xs text-stone-400">{t}</p> : null;
    }
    return null;
  }

  const done = stepIndex < tl.activeIndex;
  const current = stepIndex === tl.activeIndex;

  if (done) {
    if (stepIndex === 0) {
      return (
        <p className="mt-0.5 text-xs text-stone-400">
          {getStatusLogTime(tx, "pending") ?? createdFmt}
        </p>
      );
    }
    if (stepIndex === 1) {
      const t = getStatusLogTime(tx, "confirmed");
      return t ? <p className="mt-0.5 text-xs text-stone-400">{t}</p> : null;
    }
    if (stepIndex === 2) {
      const t = getStatusLogTime(tx, "processing");
      return t ? <p className="mt-0.5 text-xs text-stone-400">{t}</p> : null;
    }
    return null;
  }
  if (current) {
    if (tx.status === "pending" && stepIndex === 1) {
      return <p className="mt-0.5 text-xs text-stone-400">等待对方确认中</p>;
    }
    if (tx.status === "confirmed" && stepIndex === 2) {
      return <p className="mt-0.5 text-xs text-stone-400">待见面 / 待交接</p>;
    }
    if (tx.status === "processing" && stepIndex === 3) {
      return <p className="mt-0.5 text-xs text-stone-400">进行中</p>;
    }
    return null;
  }
  return null;
}

function TimelineBlock({ tx }: { tx: Transaction }) {
  const tl = useMemo(
    () => getTransactionTimeline(tx),
    [tx.id, tx.status, tx.type, tx.statusLogs],
  );

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <h2 className="text-sm font-semibold text-stone-800">交易进度</h2>
      <p className="mt-0.5 text-[11px] text-stone-400">当前进度仅供参考，以双方实际沟通为准</p>
      <ul className="relative mt-3 space-y-0 pl-1">
        {tl.steps.map((label, i) => {
          const isLast = i === tl.steps.length - 1;
          let ring = "bg-stone-200 ring-stone-300";
          let inner: ReactNode = <span className="h-2 w-2 rounded-full bg-stone-300" />;
          let titleClass = "text-stone-400";

          if (tl.mode === "all-complete") {
            ring = "bg-emerald-500 ring-emerald-400";
            inner = (
              <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            );
            titleClass = "font-semibold text-emerald-800";
          } else if (tl.mode === "cancelled" || tl.mode === "rejected") {
            ring = "bg-stone-300 ring-stone-200";
            inner = <span className="h-2 w-2 rounded-full bg-stone-400" />;
            titleClass = "text-stone-400";
          } else {
            const done = i < tl.activeIndex;
            const current = i === tl.activeIndex;
            if (done) {
              ring = "bg-emerald-500 ring-emerald-400";
              inner = (
                <svg className="h-3.5 w-3.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              );
              titleClass = "font-medium text-emerald-800";
            } else if (current) {
              ring = "bg-brand ring-orange-300 shadow-md shadow-orange-200/60";
              inner = <span className="h-2.5 w-2.5 rounded-full bg-white" />;
              titleClass = "font-semibold text-brand";
            } else {
              titleClass = "text-stone-400";
            }
          }

          const lineBg =
            tl.mode === "all-complete" ? "bg-emerald-200" : tl.mode === "cancelled" || tl.mode === "rejected" ? "bg-stone-200" : "bg-stone-200";

          return (
            <li key={`${label}-${i}`} className="relative flex gap-3 pb-5 last:pb-0">
              {!isLast ? (
                <span className={`absolute left-[11px] top-7 h-[calc(100%-0.5rem)] w-0.5 ${lineBg}`} aria-hidden />
              ) : null}
              <div
                className={`relative z-[1] flex h-6 w-6 shrink-0 items-center justify-center rounded-full ring-2 ${ring}`}
              >
                {inner}
              </div>
              <div className="min-w-0 pt-0.5">
                <p className={`text-sm leading-snug ${titleClass}`}>{label}</p>
                {timelineStepMeta(tl, i, tx)}
              </div>
            </li>
          );
        })}
      </ul>
      {tl.mode === "cancelled" || tl.mode === "rejected" ? (
        <div className="mt-4 rounded-xl border border-dashed border-stone-200 bg-stone-50/90 px-3 py-2.5 text-center">
          <p className="text-xs font-medium text-stone-500">{tl.mode === "rejected" ? "申请已被拒绝" : "交易已取消"}</p>
          <p className="mt-0.5 text-[11px] text-stone-400">仅可查看记录，不可继续推进</p>
        </div>
      ) : null}
    </section>
  );
}

export default function TransactionDetailPage() {
  useMarketplaceStore();
  useTransactionStore();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = decodeURIComponent(String(params?.id ?? ""));
  const [cancelOpen, setCancelOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const tx = id ? getTransactionById(id) : undefined;
  const item = tx ? getMarketplaceItemById(tx.itemId) : null;

  const parsed = useMemo(() => {
    if (!tx) return null;
    const c = tx.exchangeContent;
    const method =
      parseExchangeLine(c, "交易方式：") ??
      parseExchangeLine(c, "交接方式：") ??
      (tx.type === "give" ? parseExchangeLine(c, "是否方便自提：") : undefined);
    const expectTime =
      parseExchangeLine(c, "期望时间：") ?? parseExchangeLine(c, "预计归还：");
    const dailyRent =
      tx.type === "rent" && tx.amount != null && tx.rentDays != null && tx.rentDays > 0
        ? Math.round(tx.amount / tx.rentDays)
        : undefined;
    return {
      method: method ?? "—",
      expectTime: expectTime ?? "—",
      swapWish: parseSwapWish(c),
      swapNote: parseSwapNote(c),
      dailyRent,
    };
  }, [tx]);

  const hero = tx ? detailStatusStrip(tx) : null;
  const coverClass = item ? getItemCoverClass(item) : "";
  const imgStyle = item?.image
    ? {
        backgroundImage: `url(${item.image})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : undefined;
  const tags = item ? getItemDetailTags(item) : [];

  const chatHref = tx ? `/messages/${tx.itemId}?transactionId=${encodeURIComponent(tx.id)}&role=buyer` : "#";
  const productHref = tx ? `/detail/${tx.itemId}` : "#";

  const showToast = (msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 2600);
  };

  const transitionTo = (next: TransactionStatus) => {
    if (!tx) return;
    if (updateTransactionStatus(tx.id, next)) {
      showToast(statusToastMessage(next));
    }
  };

  const handleCancel = () => {
    if (!tx) return;
    if (updateTransactionStatus(tx.id, "cancelled")) {
      showToast(statusToastMessage("cancelled"));
    }
    setCancelOpen(false);
  };

  const handleDelete = () => {
    if (!tx) return;
    removeTransaction(tx.id);
    router.push("/me/orders");
  };

  if (!tx || !hero || !parsed) {
    return (
      <div className="flex min-h-full flex-col bg-gray-100">
        <PageHeader title="交易详情" backHref="/me/orders" />
        <div className="px-4 py-8 text-center">
          <p className="text-sm text-stone-500">未找到该交易单</p>
          <Link href="/me/orders" className="mt-4 inline-block text-sm font-medium text-brand">
            返回我的交易
          </Link>
        </div>
      </div>
    );
  }

  const btnOrange =
    "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover";
  const btnOutline =
    "inline-flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-white text-sm font-semibold text-stone-800 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80";
  const btnWeak =
    "inline-flex min-h-[40px] flex-1 items-center justify-center rounded-lg border border-stone-200 bg-stone-50 px-3 text-xs font-medium text-stone-500 transition hover:bg-stone-100";

  const st = tx.status;
  const isRent = tx.type === "rent";
  const completeLabel = isRent ? "确认归还" : "确认完成";
  const startLabel = startTradeButtonLabel(tx.type);

  let footerRows: ReactNode = null;

  if (st === "pending") {
    footerRows = (
      <>
        <div className="flex gap-2">
          <Link href={chatHref} className={btnOutline}>
            联系对方
          </Link>
          <button type="button" className={btnOrange} onClick={() => transitionTo("confirmed")}>
            模拟对方确认
          </button>
        </div>
        <button type="button" className={`${btnWeak} w-full max-w-none flex-none`} onClick={() => setCancelOpen(true)}>
          取消交易
        </button>
      </>
    );
  } else if (st === "confirmed") {
    footerRows = (
      <>
        <div className="flex gap-2">
          <Link href={chatHref} className={btnOutline}>
            联系对方
          </Link>
          <button type="button" className={btnOrange} onClick={() => transitionTo("processing")}>
            {startLabel}
          </button>
        </div>
        <button type="button" className={`${btnWeak} w-full max-w-none flex-none`} onClick={() => setCancelOpen(true)}>
          取消交易
        </button>
      </>
    );
  } else if (st === "processing") {
    footerRows = (
      <div className="flex gap-2">
        <Link href={chatHref} className={btnOutline}>
          联系对方
        </Link>
        <button type="button" className={btnOrange} onClick={() => transitionTo("completed")}>
          {completeLabel}
        </button>
      </div>
    );
  } else if (st === "completed") {
    footerRows = (
      <div className="flex gap-2">
        <Link href={productHref} className={btnOrange}>
          查看商品
        </Link>
        <Link href={chatHref} className={btnOutline}>
          再次联系
        </Link>
      </div>
    );
  } else if (st === "cancelled" || st === "rejected") {
    footerRows = (
      <>
        <div className="flex gap-2">
          <Link href={productHref} className={btnOrange}>
            查看商品
          </Link>
          <Link href={chatHref} className={btnOutline}>
            联系对方
          </Link>
        </div>
        <button type="button" className={`${btnWeak} w-full max-w-none flex-none`} onClick={handleDelete}>
          删除记录
        </button>
      </>
    );
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-100">
      <PageHeader title="交易详情" backHref="/me/orders" />

      <div className="flex-1 space-y-3 px-4 pb-[calc(8.25rem+env(safe-area-inset-bottom))] pt-4">
        {/* 1. 商品信息 */}
        {item ? (
          <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
            <h2 className="text-sm font-semibold text-stone-800">商品信息</h2>
            <Link href={productHref} className="mt-3 flex gap-3 rounded-xl transition hover:bg-orange-50/50">
              <div
                className={`h-[88px] w-[88px] shrink-0 rounded-xl bg-cover bg-center ${!item.image ? coverClass : ""}`}
                style={imgStyle}
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold leading-snug text-stone-900">{item.title}</p>
                <p className="mt-1 text-base font-semibold text-brand">{item.priceLabel}</p>
                <p className="mt-1 text-xs text-stone-500">
                  {distanceLabel(item)} · 发布者 {item.owner}
                </p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {tags.slice(0, 5).map((t) => (
                    <span
                      key={t}
                      className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-700"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </section>
        ) : (
          <section className="rounded-2xl bg-white p-4 text-sm text-stone-500 shadow-sm ring-1 ring-orange-100/90">
            商品已下架或不可用
          </section>
        )}

        {/* 2. 当前状态（轻量条） */}
        <section className={`rounded-xl px-3 py-2.5 ${hero.wrap}`}>
          <p className="text-sm font-semibold text-stone-900">{hero.title}</p>
          <p className="mt-0.5 text-xs leading-snug text-stone-500">{hero.desc}</p>
        </section>

        {/* 3. 交易进度 */}
        <TimelineBlock tx={tx} />

        {/* 交易信息 */}
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-stone-800">交易信息</h2>
          <dl className="mt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
            <dt className="text-stone-400">交易类型</dt>
            <dd className="text-right font-medium text-stone-800">{tradeTypeLabel(tx)}</dd>
            <dt className="text-stone-400">交易方式</dt>
            <dd className="text-right text-stone-700">{parsed.method}</dd>
            {!isRent ? (
              <>
                <dt className="text-stone-400">期望时间</dt>
                <dd className="text-right text-stone-700">{parsed.expectTime}</dd>
              </>
            ) : null}
            <dt className="text-stone-400">创建时间</dt>
            <dd className="text-right text-stone-700">{formatTransactionTime(tx.createdAt)}</dd>
            <dt className="text-stone-400">最近更新</dt>
            <dd className="text-right text-stone-700">{formatTransactionTime(tx.updatedAt)}</dd>
            <dt className="text-stone-400">订单编号</dt>
            <dd className="text-right font-mono text-[11px] text-stone-600">{formatOrderNo(tx.id)}</dd>
          </dl>

          {isRent ? (
            <dl className="mt-4 border-t border-dashed border-stone-100 pt-3 grid grid-cols-[auto_1fr] gap-x-3 gap-y-2 text-xs">
              <dt className="text-stone-400">租期</dt>
              <dd className="text-right text-stone-800">{tx.rentDays != null ? `${tx.rentDays} 天` : "—"}</dd>
              <dt className="text-stone-400">日租金</dt>
              <dd className="text-right text-stone-800">
                {parsed.dailyRent != null ? `¥${parsed.dailyRent}/天` : "—"}
              </dd>
              <dt className="text-stone-400">押金</dt>
              <dd className="text-right text-stone-800">{tx.deposit != null ? `¥${tx.deposit}` : "—"}</dd>
              <dt className="text-stone-400">租金小计</dt>
              <dd className="text-right font-semibold text-brand">{tx.amount != null ? `¥${tx.amount}` : "—"}</dd>
              <dt className="text-stone-400">预计归还时间</dt>
              <dd className="text-right text-stone-700">{parsed.expectTime}</dd>
            </dl>
          ) : null}

          {tx.type === "swap" ? (
            <div className="mt-4 border-t border-dashed border-stone-100 pt-3 space-y-2 text-xs">
              <div>
                <p className="text-stone-400">交换内容</p>
                <p className="mt-1 text-stone-800">{parsed.swapWish ?? "—"}</p>
              </div>
              <div>
                <p className="text-stone-400">补充说明</p>
                <p className="mt-1 text-stone-700">{parsed.swapNote ?? "—"}</p>
              </div>
            </div>
          ) : null}
        </section>

        {/* 辅助：聊天入口 */}
        <div className="rounded-xl bg-white/80 px-3 py-2 text-center ring-1 ring-orange-100/60">
          <Link href={chatHref} className="text-xs font-medium text-stone-500 hover:text-brand">
            打开聊天与对方沟通 →
          </Link>
        </div>
      </div>

      {/* 底部操作 */}
      <div className="sticky bottom-0 z-20 border-t border-orange-100/90 bg-white/98 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
        <div className="flex flex-col gap-2">{footerRows}</div>
      </div>

      {toast ? (
        <div
          role="status"
          className="pointer-events-none fixed bottom-24 left-1/2 z-[100] max-w-[min(360px,calc(100%-2rem))] -translate-x-1/2 rounded-xl bg-stone-900/92 px-4 py-2.5 text-center text-sm font-medium text-white shadow-lg"
        >
          {toast}
        </div>
      ) : null}

      {cancelOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[200] flex items-end justify-center bg-black/45 p-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:items-center"
          onClick={() => setCancelOpen(false)}
        >
          <div
            className="w-full max-w-sm rounded-2xl bg-white p-5 shadow-xl ring-1 ring-stone-200/80"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-center text-base font-semibold text-stone-900">确认取消这笔交易吗？</p>
            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl border border-stone-200 bg-white text-sm font-semibold text-stone-700"
                onClick={() => setCancelOpen(false)}
              >
                暂不取消
              </button>
              <button
                type="button"
                className="flex min-h-[44px] flex-1 items-center justify-center rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-sm"
                onClick={handleCancel}
              >
                确认取消
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
