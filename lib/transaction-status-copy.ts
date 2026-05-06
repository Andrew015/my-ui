import type { Transaction, TransactionStatus, TransactionType } from "@/data/transaction-store";

function isHelp(tx: Transaction): boolean {
  return tx.type === "give" && Boolean(tx.exchangeContent?.startsWith("互助申请"));
}

/** 交易详情页顶部轻量状态条 */
export function detailStatusStrip(tx: Transaction): { title: string; desc: string; wrap: string } {
  const t = tx.type;
  const s = tx.status;

  const wrap = {
    pending: "bg-orange-50/95 ring-1 ring-orange-100/90",
    confirmed: "bg-sky-50/90 ring-1 ring-sky-100/85",
    processing: "bg-orange-50/85 ring-1 ring-orange-100/85",
    completed: "bg-emerald-50/90 ring-1 ring-emerald-100/80",
    cancelled: "bg-stone-100/95 ring-1 ring-stone-200/85",
    rejected: "bg-rose-50/90 ring-1 ring-rose-100/90",
  } as const;

  if (s === "rejected") {
    return {
      title: "申请已被拒绝",
      desc: "对方暂未接受本次交易申请",
      wrap: wrap.rejected,
    };
  }

  if (s === "cancelled") {
    const cancelTitle =
      t === "rent"
        ? "租用已取消"
        : t === "swap"
          ? "置换已取消"
          : t === "give"
            ? isHelp(tx)
              ? "申请已取消"
              : "申请已取消"
            : "交易已取消";
    return { title: cancelTitle, desc: "该交易已取消", wrap: wrap.cancelled };
  }

  if (s === "completed") {
    const title =
      t === "rent" ? "已归还完成" : t === "swap" ? "置换已完成" : t === "give" ? "领取完成" : "交易已完成";
    const desc =
      t === "rent" ? "租用已结束" : t === "swap" ? "置换已结束" : t === "give" ? "领取已完成" : "本次交易已结束";
    return { title, desc, wrap: wrap.completed };
  }

  if (t === "buy") {
    if (s === "pending") return { title: "等待卖家确认", desc: "请等待卖家处理", wrap: wrap.pending };
    if (s === "confirmed")
      return { title: "卖家已确认，待见面交易", desc: "可约定时间与地点见面", wrap: wrap.confirmed };
    if (s === "processing") return { title: "交易进行中", desc: "请按约定完成当面交易", wrap: wrap.processing };
  }

  if (t === "rent") {
    if (s === "pending") return { title: "等待对方确认租用", desc: "已通知对方", wrap: wrap.pending };
    if (s === "confirmed") return { title: "已确认租用，待交接", desc: "请约定交接时间与地点", wrap: wrap.confirmed };
    if (s === "processing") return { title: "租用中", desc: "请按约定使用并按时归还", wrap: wrap.processing };
  }

  if (t === "swap") {
    if (s === "pending") return { title: "等待对方确认置换", desc: "已通知对方", wrap: wrap.pending };
    if (s === "confirmed") return { title: "已确认置换，待交换", desc: "请约定交换时间与地点", wrap: wrap.confirmed };
    if (s === "processing") return { title: "交换中", desc: "请按约定完成物品交换", wrap: wrap.processing };
  }

  if (t === "give") {
    if (s === "pending")
      return { title: "等待发布者确认", desc: isHelp(tx) ? "已通知对方" : "已通知发布者", wrap: wrap.pending };
    if (s === "confirmed") return { title: "已确认领取，待领取", desc: "请约定领取方式与时间", wrap: wrap.confirmed };
    if (s === "processing") return { title: "领取中", desc: "请按约定完成领取", wrap: wrap.processing };
  }

  return { title: "—", desc: "", wrap: "bg-stone-50 ring-1 ring-stone-200" };
}

/** 列表卡片状态条（稍短） */
export function listStatusStrip(tx: Transaction): { title: string; desc: string; wrap: string } {
  return detailStatusStrip(tx);
}

/** Toast 提示（与 store 内日志文案可略有不同） */
export function statusToastMessage(newStatus: TransactionStatus): string {
  switch (newStatus) {
    case "confirmed":
      return "已确认交易";
    case "processing":
      return "已进入交易中";
    case "completed":
      return "交易已完成";
    case "cancelled":
      return "交易已取消";
    case "rejected":
      return "已拒绝申请";
    default:
      return "已更新";
  }
}

export function sellerStatusText(status: TransactionStatus): string {
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

/** confirmed 态「开始交易」按钮文案 */
export function startTradeButtonLabel(type: TransactionType): string {
  switch (type) {
    case "rent":
      return "开始租用";
    case "swap":
      return "开始交换";
    case "give":
      return "确认领取";
    default:
      return "开始交易";
  }
}
