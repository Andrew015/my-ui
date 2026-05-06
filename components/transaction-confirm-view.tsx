"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { createTransaction } from "@/data/transaction-store";
import type { Item } from "@/data/mock";
import { currentUser, getItemDetailTags } from "@/data/mock";
import {
  distanceLabel,
  getBuyAmount,
  getDailyRentForConfirm,
  getRentDeposit,
} from "@/lib/transaction-item-utils";
import { getItemCoverClass } from "@/lib/item-cover";

type ConfirmTypeParam = "buy" | "rent" | "swap" | "give" | "help";

type Props = {
  item: Item;
  confirmType: ConfirmTypeParam;
};

const CARD = "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90";

function topHint(confirmType: ConfirmTypeParam): string {
  switch (confirmType) {
    case "buy":
      return "提交后将通知卖家确认，双方确认后可线下交易。";
    case "rent":
      return "确认后将进入租用流程，归还后需双方确认完成。";
    case "swap":
      return "发起后需双方确认交换内容，确认后进入交换流程。";
    case "give":
      return "提交后将通知发布者确认，确认后可约定领取方式。";
    case "help":
      return "提交后将通知对方确认，确认后进入互助流程。";
    default:
      return "";
  }
}

function submitLabel(confirmType: ConfirmTypeParam): string {
  switch (confirmType) {
    case "buy":
      return "提交购买请求";
    case "rent":
      return "发起租用请求";
    case "swap":
      return "发起置换请求";
    case "give":
      return "申请领取";
    case "help":
      return "提交互助申请";
    default:
      return "提交";
  }
}

function RadioRow({
  name,
  value,
  options,
  onChange,
}: {
  name: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {options.map((opt) => (
        <label
          key={opt.value}
          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2.5 transition ${
            value === opt.value
              ? "border-brand bg-orange-50/90 ring-1 ring-orange-200/80"
              : "border-stone-100 bg-stone-50/50 hover:bg-stone-50"
          }`}
        >
          <input
            type="radio"
            name={name}
            value={opt.value}
            checked={value === opt.value}
            onChange={() => onChange(opt.value)}
            className="h-4 w-4 shrink-0 accent-brand"
          />
          <span className="text-sm font-medium text-stone-800">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-sm font-medium text-stone-700">{children}</p>;
}

function ProductSummaryCard({ item }: { item: Item }) {
  const tags = getItemDetailTags(item);
  const coverClass = getItemCoverClass(item);
  const style = item.image
    ? {
        backgroundImage: `url(${item.image})`,
        backgroundSize: "cover" as const,
        backgroundPosition: "center" as const,
      }
    : undefined;

  return (
    <section className={`${CARD} ring-2 ring-orange-100/70`}>
      <p className="mb-3 text-center text-[11px] font-semibold uppercase tracking-wide text-orange-600/90">
        交易商品
      </p>
      <div className="flex gap-3">
        <div
          className={`h-[88px] w-[88px] shrink-0 rounded-xl bg-cover bg-center ${!item.image ? coverClass : ""}`}
          style={style}
          role="img"
          aria-hidden
        />
        <div className="min-w-0 flex-1">
          <h2 className="line-clamp-2 text-base font-semibold leading-snug text-stone-900">{item.title}</h2>
          <p className="mt-1 text-lg font-semibold text-brand">{item.priceLabel}</p>
          <p className="mt-0.5 text-xs text-stone-400">
            {distanceLabel(item)} · {item.owner}
          </p>
          <div className="mt-2 flex flex-wrap gap-1">
            {tags.slice(0, 4).map((t) => (
              <span
                key={t}
                className="rounded-full bg-orange-50 px-2 py-0.5 text-[11px] font-medium text-orange-600"
              >
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function SummaryRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex gap-3 border-b border-stone-100 py-2.5 text-sm last:border-0 last:pb-0 first:pt-0">
      <span className="w-[7rem] shrink-0 text-stone-500">{label}</span>
      <span className="min-w-0 flex-1 font-medium text-stone-800">{value}</span>
    </div>
  );
}

export function TransactionConfirmView({ item, confirmType }: Props) {
  const router = useRouter();
  const backHref = `/detail/${item.id}`;
  const [toast, setToast] = useState<string | null>(null);

  const dailyRent = useMemo(() => getDailyRentForConfirm(item), [item]);
  const deposit = useMemo(() => getRentDeposit(item), [item]);
  const buyAmount = useMemo(() => getBuyAmount(item), [item]);

  const [rentDays, setRentDays] = useState<1 | 3 | 7>(3);

  const [buyTradeMethod, setBuyTradeMethod] = useState("face");
  const [buyTradeTime, setBuyTradeTime] = useState("today");
  const [buyNotes, setBuyNotes] = useState("");

  const [rentTradeMethod, setRentTradeMethod] = useState("face");
  const [rentNotes, setRentNotes] = useState("");

  const [swapWish, setSwapWish] = useState("");
  const [swapMore, setSwapMore] = useState("");
  const [swapTradeMethod, setSwapTradeMethod] = useState("face");

  const [giveClaim, setGiveClaim] = useState("");
  const [givePickup, setGivePickup] = useState(true);
  const [giveRemark, setGiveRemark] = useState("");

  const [helpMain, setHelpMain] = useState("");
  const [helpRemark, setHelpRemark] = useState("");

  const rentTotal = dailyRent * rentDays;

  const buyMethodLabel = buyTradeMethod === "face" ? "当面交易" : "小区自提";
  const buyTimeLabel =
    buyTradeTime === "today" ? "今天" : buyTradeTime === "weekend" ? "周末" : "另约时间";

  const rentMethodLabel = rentTradeMethod === "face" ? "当面交接" : "小区门口";
  const swapMethodLabel = swapTradeMethod === "face" ? "当面交换" : "小区门口";

  const summaryCard = useMemo(() => {
    if (confirmType === "buy") {
      return (
        <>
          <SummaryRow label="交易金额" value={`¥${buyAmount}`} />
          <SummaryRow label="交易方式" value={buyMethodLabel} />
          <SummaryRow label="交易时间" value={buyTimeLabel} />
          {buyNotes.trim() ? <SummaryRow label="备注" value={buyNotes.trim()} /> : null}
        </>
      );
    }
    if (confirmType === "rent") {
      return (
        <>
          <SummaryRow label="日租金" value={`¥${dailyRent}/天`} />
          <SummaryRow label="租期" value={`${rentDays} 天`} />
          <SummaryRow label="租金小计" value={`¥${rentTotal}`} />
          <SummaryRow label="押金" value={`¥${deposit}`} />
          <SummaryRow label="预计归还时间" value="待双方确认" />
          <SummaryRow label="交易方式" value={rentMethodLabel} />
          {rentNotes.trim() ? <SummaryRow label="备注" value={rentNotes.trim()} /> : null}
        </>
      );
    }
    if (confirmType === "swap") {
      return (
        <>
          <SummaryRow label="交换内容" value={swapWish.trim() || "—"} />
          <SummaryRow label="交易方式" value={swapMethodLabel} />
          <SummaryRow label="补充说明" value={swapMore.trim() || "—"} />
        </>
      );
    }
    if (confirmType === "give") {
      return (
        <>
          <SummaryRow label="领取说明" value={giveClaim.trim() || "—"} />
          <SummaryRow label="是否自提" value={givePickup ? "可自提" : "需协商"} />
          <SummaryRow label="备注" value={giveRemark.trim() || "—"} />
        </>
      );
    }
    return (
      <>
        <SummaryRow label="互助说明" value={helpMain.trim() || "—"} />
        <SummaryRow label="备注" value={helpRemark.trim() || "—"} />
      </>
    );
  }, [
    confirmType,
    buyAmount,
    buyMethodLabel,
    buyTimeLabel,
    buyNotes,
    dailyRent,
    rentDays,
    rentTotal,
    deposit,
    rentMethodLabel,
    rentNotes,
    swapWish,
    swapMethodLabel,
    swapMore,
    giveClaim,
    givePickup,
    giveRemark,
    helpMain,
    helpRemark,
  ]);

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  }

  function handleSubmit() {
    if (item.ownerId === currentUser.id) {
      showToast("不能购买自己发布的商品");
      return;
    }

    let note = "";

    if (confirmType === "buy") {
      note = `${buyMethodLabel} · ${buyTimeLabel}`;
      const tx = createTransaction({
        itemId: item.id,
        type: "buy",
        buyerId: currentUser.id,
        sellerId: item.ownerId ?? "user-seller-mock",
        buyerName: "小李",
        buyerAvatar: "🙂",
        amount: buyAmount,
        note,
        tradeMethod: buyMethodLabel,
        expectedTime: buyTimeLabel,
        exchangeContent: [
          `交易方式：${buyMethodLabel}`,
          `期望时间：${buyTimeLabel}`,
          buyNotes.trim() ? `备注：${buyNotes.trim()}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      });
      router.push(`/transaction/success?id=${encodeURIComponent(tx.id)}`);
      return;
    }

    if (confirmType === "rent") {
      note = `租${rentDays}天 · 租金¥${rentTotal}`;
      const tx = createTransaction({
        itemId: item.id,
        type: "rent",
        buyerId: currentUser.id,
        sellerId: item.ownerId ?? "user-seller-mock",
        buyerName: "小李",
        buyerAvatar: "🙂",
        amount: rentTotal,
        rentDays,
        deposit,
        note,
        tradeMethod: rentMethodLabel,
        expectedTime: "待双方确认",
        exchangeContent: [
          `交易方式：${rentMethodLabel}`,
          `预计归还：待双方确认`,
          rentNotes.trim() ? `备注：${rentNotes.trim()}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      });
      router.push(`/transaction/success?id=${encodeURIComponent(tx.id)}`);
      return;
    }

    if (confirmType === "swap") {
      note = swapWish.trim() || "置换请求";
      const tx = createTransaction({
        itemId: item.id,
        type: "swap",
        buyerId: currentUser.id,
        sellerId: item.ownerId ?? "user-seller-mock",
        buyerName: "小李",
        buyerAvatar: "🙂",
        note,
        tradeMethod: swapMethodLabel,
        expectedTime: "待双方确认",
        exchangeContent: [
          swapWish.trim() ? `我想交换：${swapWish.trim()}` : "",
          swapMore.trim() ? `补充说明：${swapMore.trim()}` : "",
          `交易方式：${swapMethodLabel}`,
        ]
          .filter(Boolean)
          .join("\n\n"),
      });
      router.push(`/transaction/success?id=${encodeURIComponent(tx.id)}`);
      return;
    }

    if (confirmType === "give") {
      note = giveClaim.trim() || "领取申请";
      const tx = createTransaction({
        itemId: item.id,
        type: "give",
        buyerId: currentUser.id,
        sellerId: item.ownerId ?? "user-seller-mock",
        buyerName: "小李",
        buyerAvatar: "🙂",
        note,
        tradeMethod: givePickup ? "可自提" : "需协商",
        expectedTime: "待双方确认",
        exchangeContent: [
          giveClaim.trim() ? `领取说明：${giveClaim.trim()}` : "",
          `是否方便自提：${givePickup ? "可自提" : "需协商"}`,
          giveRemark.trim() ? `备注：${giveRemark.trim()}` : "",
        ]
          .filter(Boolean)
          .join("\n"),
      });
      router.push(`/transaction/success?id=${encodeURIComponent(tx.id)}`);
      return;
    }

    note = helpMain.trim() || "互助申请";
    const tx = createTransaction({
      itemId: item.id,
      type: "give",
      buyerId: currentUser.id,
      sellerId: item.ownerId ?? "user-seller-mock",
      buyerName: "小李",
      buyerAvatar: "🙂",
      note,
      tradeMethod: "协商互助",
      expectedTime: "待双方确认",
      exchangeContent: [
        "互助申请",
        helpMain.trim() ? `说明：${helpMain.trim()}` : "",
        helpRemark.trim() ? `备注：${helpRemark.trim()}` : "",
      ]
        .filter(Boolean)
        .join("\n"),
    });
    router.push(`/transaction/success?id=${encodeURIComponent(tx.id)}`);
  }

  return (
    <div className="flex min-h-full flex-col bg-gray-100">
      <PageHeader title="确认交易" backHref={backHref} subtitle="发起交易请求，非最终成交" />

      <div className="flex-1 space-y-4 px-4 pb-44 pt-3">
        <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-white px-4 py-3 ring-1 ring-orange-200/60">
          <div className="mb-2 flex justify-center gap-4 text-[11px] font-medium text-stone-500">
            <span className="text-brand">① 填写信息</span>
            <span>② 对方确认</span>
          </div>
          <p className="text-center text-xs leading-relaxed text-stone-600">{topHint(confirmType)}</p>
          <p className="mt-2 text-center text-[11px] text-stone-400">未支付 · 双方确认后再线下交割</p>
        </div>

        <ProductSummaryCard item={item} />

        <p className="px-1 text-sm font-semibold text-stone-800">填写交易信息</p>

        {confirmType === "buy" ? (
          <>
            <section className={CARD}>
              <FieldLabel>交易方式</FieldLabel>
              <RadioRow
                name="buy-method"
                value={buyTradeMethod}
                onChange={setBuyTradeMethod}
                options={[
                  { value: "face", label: "当面交易" },
                  { value: "pickup", label: "小区自提" },
                ]}
              />
            </section>
            <section className={CARD}>
              <FieldLabel>交易时间</FieldLabel>
              <RadioRow
                name="buy-time"
                value={buyTradeTime}
                onChange={setBuyTradeTime}
                options={[
                  { value: "today", label: "今天" },
                  { value: "weekend", label: "周末" },
                  { value: "other", label: "另约时间" },
                ]}
              />
            </section>
            <section className={CARD}>
              <FieldLabel>备注</FieldLabel>
              <input
                type="text"
                value={buyNotes}
                onChange={(e) => setBuyNotes(e.target.value)}
                placeholder="可选：与卖家协商的细节"
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm text-stone-800 outline-none placeholder:text-stone-400 focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
            </section>
          </>
        ) : null}

        {confirmType === "rent" ? (
          <>
            <section className={CARD}>
              <div className="flex justify-between gap-4 text-sm">
                <span className="text-stone-500">日租金</span>
                <span className="font-semibold text-stone-800">¥{dailyRent}/天</span>
              </div>
              <div className="mt-3 flex justify-between gap-4 border-t border-stone-100 pt-3 text-sm">
                <span className="text-stone-500">押金</span>
                <span className="font-semibold text-stone-800">¥{deposit}</span>
              </div>
            </section>
            <section className={CARD}>
              <FieldLabel>选择租期</FieldLabel>
              <div className="flex gap-2">
                {([1, 3, 7] as const).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setRentDays(d)}
                    className={`flex-1 rounded-xl py-2.5 text-sm font-semibold transition ${
                      rentDays === d
                        ? "bg-brand text-brand-foreground shadow-sm ring-2 ring-orange-300/80"
                        : "bg-stone-50 text-stone-700 ring-1 ring-stone-200 hover:bg-stone-100"
                    }`}
                  >
                    {d}天
                  </button>
                ))}
              </div>
            </section>
            <section className={CARD}>
              <FieldLabel>交易方式</FieldLabel>
              <RadioRow
                name="rent-method"
                value={rentTradeMethod}
                onChange={setRentTradeMethod}
                options={[
                  { value: "face", label: "当面交接" },
                  { value: "gate", label: "小区门口" },
                ]}
              />
            </section>
            <section className={CARD}>
              <FieldLabel>备注</FieldLabel>
              <input
                type="text"
                value={rentNotes}
                onChange={(e) => setRentNotes(e.target.value)}
                placeholder="可选"
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
            </section>
          </>
        ) : null}

        {confirmType === "swap" ? (
          <>
            <section className={CARD}>
              <FieldLabel>我想交换</FieldLabel>
              <input
                type="text"
                value={swapWish}
                onChange={(e) => setSwapWish(e.target.value)}
                placeholder="描述你希望用来置换的物品或条件"
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
            </section>
            <section className={CARD}>
              <FieldLabel>补充说明</FieldLabel>
              <textarea
                value={swapMore}
                onChange={(e) => setSwapMore(e.target.value)}
                rows={4}
                placeholder="成色、交接方式等"
                className="w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm leading-relaxed outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
            </section>
            <section className={CARD}>
              <FieldLabel>交易方式</FieldLabel>
              <RadioRow
                name="swap-method"
                value={swapTradeMethod}
                onChange={setSwapTradeMethod}
                options={[
                  { value: "face", label: "当面交换" },
                  { value: "gate", label: "小区门口" },
                ]}
              />
            </section>
          </>
        ) : null}

        {confirmType === "give" ? (
          <>
            <section className={CARD}>
              <FieldLabel>领取说明</FieldLabel>
              <input
                type="text"
                value={giveClaim}
                onChange={(e) => setGiveClaim(e.target.value)}
                placeholder="例如领取时间、联系方式约定"
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
            </section>
            <section className={CARD}>
              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-stone-100 bg-stone-50/80 px-3 py-3">
                <input
                  type="checkbox"
                  checked={givePickup}
                  onChange={(e) => setGivePickup(e.target.checked)}
                  className="h-4 w-4 shrink-0 rounded accent-brand"
                />
                <span className="text-sm font-medium text-stone-800">可自提</span>
              </label>
            </section>
            <section className={CARD}>
              <FieldLabel>备注</FieldLabel>
              <textarea
                value={giveRemark}
                onChange={(e) => setGiveRemark(e.target.value)}
                rows={3}
                placeholder="其他需要说明的内容"
                className="w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
            </section>
          </>
        ) : null}

        {confirmType === "help" ? (
          <>
            <section className={CARD}>
              <FieldLabel>互助说明</FieldLabel>
              <input
                type="text"
                value={helpMain}
                onChange={(e) => setHelpMain(e.target.value)}
                placeholder="你需要怎样的帮助"
                className="w-full rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
            </section>
            <section className={CARD}>
              <FieldLabel>备注</FieldLabel>
              <textarea
                value={helpRemark}
                onChange={(e) => setHelpRemark(e.target.value)}
                rows={3}
                className="w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand focus:ring-2 focus:ring-brand/25"
              />
            </section>
          </>
        ) : null}

        <section className={`${CARD} border-t-4 border-t-brand/90`}>
          <p className="mb-3 text-center text-sm font-semibold text-stone-800">交易摘要</p>
          <div>{summaryCard}</div>
        </section>

        <Link
          href={backHref}
          className="flex min-h-[44px] w-full items-center justify-center rounded-xl bg-white text-sm font-semibold text-stone-700 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80"
        >
          返回商品详情
        </Link>
      </div>

      <div className="sticky bottom-0 z-20 border-t border-orange-100/90 bg-white/98 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex min-h-[48px] w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-brand-foreground shadow-md transition hover:bg-brand-hover active:scale-[0.99]"
        >
          {submitLabel(confirmType)}
        </button>
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
