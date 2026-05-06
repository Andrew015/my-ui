import type { TransactionStatus } from "@/data/transaction-store";

export function getStatusPresentation(status: TransactionStatus): {
  label: string;
  className: string;
} {
  switch (status) {
    case "pending":
      return {
        label: "等待对方确认",
        className: "bg-orange-50 text-orange-700 ring-1 ring-orange-200/90",
      };
    case "confirmed":
      return {
        label: "对方已确认",
        className: "bg-sky-50 text-sky-700 ring-1 ring-sky-200/90",
      };
    case "processing":
      return {
        label: "进行中",
        className: "bg-orange-50 text-orange-800 ring-1 ring-orange-200/85",
      };
    case "completed":
      return {
        label: "已完成",
        className: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200/90",
      };
    case "cancelled":
      return {
        label: "已取消",
        className: "bg-stone-100 text-stone-500 ring-1 ring-stone-200/80",
      };
    case "rejected":
      return {
        label: "已拒绝",
        className: "bg-rose-50 text-rose-700 ring-1 ring-rose-200/90",
      };
    default:
      return {
        label: "未知",
        className: "bg-stone-100 text-stone-600",
      };
  }
}
