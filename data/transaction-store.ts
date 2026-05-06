"use client";

import { useSyncExternalStore } from "react";
import { addNotification, markChatUnread } from "@/data/notification-store";
import { getMarketplaceItemById } from "@/data/marketplace-store";
import { buildStatusLogText } from "@/lib/transaction-log-text";
import { formatTransactionTime } from "@/lib/transaction-time-format";

export type TransactionStatus =
  | "pending"
  | "confirmed"
  | "processing"
  | "completed"
  | "cancelled"
  | "rejected";

export type TransactionType = "buy" | "rent" | "swap" | "give";

export type StatusLogEntry = {
  status: TransactionStatus;
  text: string;
  time: string;
};

/**
 * 交易单（前端原型，不接后端）。
 * 互助（help）确认页写入时暂用 type=give，exchangeContent 以「互助申请」前缀区分。
 */
export type Transaction = {
  id: string;
  itemId: string;
  type: TransactionType;
  buyerId: string;
  sellerId: string;
  buyerName?: string;
  buyerAvatar?: string;
  status: TransactionStatus;
  amount?: number;
  rentDays?: number;
  deposit?: number;
  exchangeContent?: string;
  /** 简短摘要，便于列表/成功页展示 */
  note?: string;
  tradeMethod?: string;
  expectedTime?: string;
  createdAt: string;
  updatedAt: string;
  statusLogs: StatusLogEntry[];
};

const listeners = new Set<() => void>();

let transactions: Transaction[] = [];

function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return transactions;
}

export function useTransactionStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getTransactions(): Transaction[] {
  return [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

/** 按交易类型筛选（公益 = give，含互助单） */
export function getTransactionsByType(
  type: "all" | TransactionType | "public",
): Transaction[] {
  const all = getTransactions();
  if (type === "all") return all;
  if (type === "public") return all.filter((t) => t.type === "give");
  return all.filter((t) => t.type === type);
}

export function getTransactionById(id: string): Transaction | undefined {
  return transactions.find((t) => t.id === id);
}

function ensureLogs(tx: Transaction): StatusLogEntry[] {
  if (tx.statusLogs?.length) return tx.statusLogs;
  return [
    {
      status: "pending",
      text: "已发起交易",
      time: formatTransactionTime(tx.createdAt),
    },
  ];
}

export function createTransaction(
  partial: Omit<
    Transaction,
    "id" | "createdAt" | "updatedAt" | "statusLogs" | "status"
  > & {
    id?: string;
    status?: TransactionStatus;
    statusLogs?: StatusLogEntry[];
    updatedAt?: string;
  },
): Transaction {
  const id =
    partial.id ?? `txn_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
  const existed = transactions.find((t) => t.id === id);
  if (existed) return existed;
  const now = new Date().toISOString();
  const time = formatTransactionTime(now);
  const status = partial.status ?? "pending";
  const statusLogs =
    partial.statusLogs ??
    ([
      {
        status: "pending",
        text: "已发起交易",
        time,
      },
    ] satisfies StatusLogEntry[]);
  const tx: Transaction = {
    ...partial,
    id,
    status,
    createdAt: now,
    updatedAt: partial.updatedAt ?? now,
    statusLogs,
  };
  transactions = [tx, ...transactions];
  markChatUnread(tx.id);
  const item = getMarketplaceItemById(tx.itemId);
  addNotification({
    userId: tx.sellerId,
    type: "new_request",
    title: `收到新的${tx.type === "buy" ? "购买" : tx.type === "rent" ? "租用" : tx.type === "swap" ? "置换" : "领取"}申请`,
    content: `${tx.buyerName ?? "有人"}想${tx.type === "buy" ? "购买" : tx.type === "rent" ? "租用" : tx.type === "swap" ? "置换" : "领取"}你的「${item?.title ?? "商品"}」`,
    relatedId: tx.id,
    relatedType: "transaction",
  });
  emit();
  return tx;
}

/** 与 createTransaction 同义，便于语义化调用 */
export const addTransaction = createTransaction;

export function updateTransactionStatus(
  id: string,
  next: TransactionStatus,
  options?: { logText?: string },
): boolean {
  const idx = transactions.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  const prev = transactions[idx];
  const terminal =
    prev.status === "completed" ||
    prev.status === "cancelled" ||
    prev.status === "rejected";
  if (terminal && next !== prev.status) return false;
  if (next === prev.status) return true;

  const now = new Date().toISOString();
  const time = formatTransactionTime(now);
  const logs = ensureLogs(prev);
  const logText =
    options?.logText ??
    buildStatusLogText({
      type: prev.type,
      nextStatus: next,
      exchangeContent: prev.exchangeContent,
    });
  const statusLogs = [...logs, { status: next, text: logText, time }];

  const nextTx: Transaction = {
    ...prev,
    status: next,
    updatedAt: now,
    statusLogs,
  };

  transactions = [
    ...transactions.slice(0, idx),
    nextTx,
    ...transactions.slice(idx + 1),
  ];
  markChatUnread(prev.id);
  const item = getMarketplaceItemById(prev.itemId);
  if (next === "confirmed") {
    addNotification({
      userId: prev.buyerId,
      type: "transaction_confirmed",
      title: "卖家已确认交易",
      content: `「${item?.title ?? "该商品"}」已确认，可继续沟通交易时间与地点`,
      relatedId: prev.id,
      relatedType: "transaction",
    });
  } else if (next === "rejected") {
    addNotification({
      userId: prev.buyerId,
      type: "transaction_rejected",
      title: "申请被拒绝",
      content: `对方暂未接受你关于「${item?.title ?? "该商品"}」的申请`,
      relatedId: prev.id,
      relatedType: "transaction",
    });
  } else if (next === "processing") {
    addNotification({
      userId: prev.buyerId,
      type: "transaction_processing",
      title: "交易已开始",
      content: `「${item?.title ?? "该商品"}」已进入交易中，请按约定完成交接`,
      relatedId: prev.id,
      relatedType: "transaction",
    });
  } else if (next === "completed") {
    addNotification({
      userId: prev.buyerId,
      type: "transaction_completed",
      title: "交易已完成",
      content: `「${item?.title ?? "该商品"}」交易已完成`,
      relatedId: prev.id,
      relatedType: "transaction",
    });
    addNotification({
      userId: prev.sellerId,
      type: "transaction_completed",
      title: "交易已完成",
      content: `「${item?.title ?? "该商品"}」交易已完成`,
      relatedId: prev.id,
      relatedType: "transaction",
    });
  }
  emit();
  return true;
}

export function removeTransaction(id: string): boolean {
  const next = transactions.filter((t) => t.id !== id);
  if (next.length === transactions.length) return false;
  transactions = next;
  emit();
  return true;
}
