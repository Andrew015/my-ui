import type { TransactionStatus, TransactionType } from "@/data/transaction-store";

/** 写入 statusLogs 的文案（与 UI toast 可略有区分） */
export function buildStatusLogText(args: {
  type: TransactionType;
  nextStatus: TransactionStatus;
  exchangeContent?: string;
}): string {
  const { type, nextStatus, exchangeContent } = args;
  const isHelp = type === "give" && Boolean(exchangeContent?.startsWith("互助申请"));

  switch (nextStatus) {
    case "pending":
      return "已发起交易";
    case "confirmed":
      if (type === "buy") return "对方已确认";
      if (type === "rent") return "租用已确认";
      if (type === "swap") return "置换已确认";
      return isHelp ? "发布者已确认" : "对方已确认领取";
    case "processing":
      return "已进入交易中";
    case "completed":
      if (type === "rent") return "租用已完成";
      if (type === "swap") return "置换已完成";
      if (type === "give") return "领取已完成";
      return "交易已完成";
    case "cancelled":
      if (type === "rent") return "租用已取消";
      if (type === "swap") return "置换已取消";
      if (type === "give") return "申请已取消";
      return "交易已取消";
    case "rejected":
      return "申请已被拒绝";
    default:
      return "状态更新";
  }
}
