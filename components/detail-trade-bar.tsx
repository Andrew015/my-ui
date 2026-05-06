"use client";

import Link from "next/link";
import type { Item } from "@/data/mock";
import type { MarketplaceItem } from "@/data/marketplace-store";

function listingKind(channel: Item["channel"]) {
  if (channel === "idle") return "sell" as const;
  if (channel === "rent") return "rent" as const;
  if (channel === "swap") return "swap" as const;
  return "community" as const;
}

/** 与详情展示一致的附加交易方式（对应历史上的 supportModes） */
export function getDetailSupportModes(item: Item) {
  return {
    rent: Boolean(item.supportRent),
    swap: Boolean(item.supportSwap),
    give: Boolean(item.supportGive),
  };
}

const LAYER1_H = "min-h-[52px] h-[52px]";

/** 第一层：次按钮（白底描边） */
function LayerOutlineButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex flex-1 ${LAYER1_H} shrink-0 items-center justify-center rounded-xl bg-white px-3 text-sm font-semibold text-stone-800 ring-2 ring-orange-100/90 transition hover:bg-orange-50/80 active:scale-[0.99]`}
    >
      {label}
    </Link>
  );
}

/** 第一层：主按钮（橙色） */
function LayerPrimaryButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-w-[42%] flex-[1.12] ${LAYER1_H} shrink-0 items-center justify-center rounded-xl bg-brand px-3 text-sm font-semibold text-brand-foreground shadow-sm transition hover:bg-brand-hover active:scale-[0.99]`}
    >
      {label}
    </Link>
  );
}

/** 第二层：辅助交易方式（轻量） */
function AuxTradeButton({ label, href }: { label: string; href: string }) {
  return (
    <Link
      href={href}
      className="inline-flex min-h-[34px] items-center justify-center rounded-lg bg-stone-50 px-2.5 py-1.5 text-xs font-medium text-stone-600 ring-1 ring-stone-200/90 transition hover:bg-stone-100 active:scale-[0.99]"
    >
      {label}
    </Link>
  );
}

export function DetailTradeBar({ item }: { item: MarketplaceItem }) {
  const kind = listingKind(item.channel);
  const sm = getDetailSupportModes(item);
  const id = item.id;
  const messagesHref = `/messages/${id}?role=buyer`;
  const confirm = (type: string) =>
    `/transaction/confirm?type=${encodeURIComponent(type)}&itemId=${encodeURIComponent(id)}`;

  type AuxItem = { label: string; href: string };
  const auxRow: AuxItem[] = [];

  let primaryLabel = "";
  let primaryHref = "";

  if (kind === "sell") {
    primaryLabel = "立即购买";
    primaryHref = confirm("buy");
    if (sm.rent) auxRow.push({ label: "租一下", href: confirm("rent") });
    if (sm.swap) auxRow.push({ label: "发起置换", href: confirm("swap") });
    if (sm.give) auxRow.push({ label: "申请赠送", href: confirm("give") });
  } else if (kind === "rent") {
    primaryLabel = "租一下";
    primaryHref = confirm("rent");
    if (sm.swap) auxRow.push({ label: "发起置换", href: confirm("swap") });
    if (sm.give) auxRow.push({ label: "申请赠送", href: confirm("give") });
  } else if (kind === "swap") {
    primaryLabel = "发起置换";
    primaryHref = confirm("swap");
    if (sm.rent) auxRow.push({ label: "租一下", href: confirm("rent") });
    if (sm.give) auxRow.push({ label: "申请赠送", href: confirm("give") });
  } else {
    const isGive = item.channel === "give";
    if (isGive) {
      primaryLabel = "申请领取";
      primaryHref = confirm("give");
    } else {
      primaryLabel = "申请互助";
      primaryHref = confirm("help");
    }
    if (sm.rent) auxRow.push({ label: "租一下", href: confirm("rent") });
    if (sm.swap) auxRow.push({ label: "发起置换", href: confirm("swap") });
    if (sm.give && !isGive) auxRow.push({ label: "申请赠送", href: confirm("give") });
  }

  const showAuxSection = auxRow.length > 0;

  return (
    <div className="sticky bottom-[-1.5rem] z-30 border-t border-orange-100/90 bg-white/98 px-4 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2.5 shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
      <div className="flex flex-col gap-0">
        {/* 第一层：固定高度，主路径 + 联系对方 */}
        <div className="flex gap-2.5">
          <LayerOutlineButton label="联系对方" href={messagesHref} />
          <LayerPrimaryButton label={primaryLabel} href={primaryHref} />
        </div>

        {/* 第二层：辅助交易方式 */}
        {showAuxSection ? (
          <div className="mt-2 border-t border-orange-100/60 pt-2">
            <p className="mb-1.5 text-[11px] leading-tight text-stone-400">也支持以下方式</p>
            <div className="flex flex-wrap gap-1.5">
              {auxRow.map((b, i) => (
                <AuxTradeButton key={`${b.href}-${i}`} label={b.label} href={b.href} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
