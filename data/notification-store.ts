"use client";

import { useSyncExternalStore } from "react";

export type NotificationType =
  | "new_request"
  | "transaction_confirmed"
  | "transaction_rejected"
  | "transaction_processing"
  | "transaction_completed"
  | "item_offline"
  | "item_completed";

export type NotificationRelatedType = "transaction" | "item" | "message";

export type NotificationItem = {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  content: string;
  relatedId: string;
  relatedType: NotificationRelatedType;
  isRead: boolean;
  createdAt: string;
};

type NotificationState = {
  notifications: NotificationItem[];
  unreadChatByTransactionId: Record<string, number>;
};

const listeners = new Set<() => void>();
let state: NotificationState = {
  notifications: [],
  unreadChatByTransactionId: {},
};

function emit() {
  listeners.forEach((fn) => fn());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useNotificationStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function createNotification(
  input: Omit<NotificationItem, "id" | "createdAt" | "isRead"> & { id?: string; createdAt?: string },
) {
  if (
    hasSimilarNotification({
      type: input.type,
      relatedId: input.relatedId,
      relatedType: input.relatedType,
      userId: input.userId,
      withinMs: 5000,
    })
  ) {
    return state.notifications.find(
      (n) =>
        n.userId === input.userId &&
        n.type === input.type &&
        n.relatedId === input.relatedId &&
        n.relatedType === input.relatedType,
    )!;
  }
  const now = input.createdAt ?? new Date().toISOString();
  const item: NotificationItem = {
    ...input,
    id: input.id ?? `notice_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    createdAt: now,
    isRead: false,
  };
  state = { ...state, notifications: [item, ...state.notifications] };
  emit();
  return item;
}

/** 语义别名：与业务层约定保持一致 */
export const addNotification = createNotification;

export function markNotificationRead(id: string) {
  state = {
    ...state,
    notifications: state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
  };
  emit();
}

export function markAllNotificationsRead(userId?: string) {
  state = {
    ...state,
    notifications: state.notifications.map((n) =>
      userId ? (n.userId === userId ? { ...n, isRead: true } : n) : { ...n, isRead: true },
    ),
  };
  emit();
}

export function getNotificationsForUser(userId: string) {
  return state.notifications.filter((n) => n.userId === userId);
}

/** 全量读取（当前前端 mock 场景可直接使用） */
export function getNotifications() {
  return [...state.notifications].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function hasSimilarNotification(args: {
  type: NotificationType;
  relatedId: string;
  relatedType: NotificationRelatedType;
  userId: string;
  withinMs?: number;
}) {
  const { type, relatedId, relatedType, userId, withinMs = 5000 } = args;
  const now = Date.now();
  return state.notifications.some((n) => {
    if (
      n.type !== type ||
      n.relatedId !== relatedId ||
      n.relatedType !== relatedType ||
      n.userId !== userId
    ) {
      return false;
    }
    const dt = Math.abs(now - new Date(n.createdAt).getTime());
    return dt <= withinMs;
  });
}

export function getUnreadNotificationCount(userId?: string) {
  return state.notifications.filter((n) => (userId ? n.userId === userId : true) && !n.isRead).length;
}

export function markChatUnread(transactionId: string) {
  const prev = state.unreadChatByTransactionId[transactionId] ?? 0;
  state = {
    ...state,
    unreadChatByTransactionId: {
      ...state.unreadChatByTransactionId,
      [transactionId]: prev + 1,
    },
  };
  emit();
}

export function markChatRead(transactionId: string) {
  const next = { ...state.unreadChatByTransactionId };
  delete next[transactionId];
  state = { ...state, unreadChatByTransactionId: next };
  emit();
}

export function getUnreadChatCount() {
  return Object.values(state.unreadChatByTransactionId).reduce((acc, cur) => acc + cur, 0);
}

export function isChatUnread(transactionId: string) {
  return (state.unreadChatByTransactionId[transactionId] ?? 0) > 0;
}

export function getChatUnreadCountFor(transactionId: string) {
  return state.unreadChatByTransactionId[transactionId] ?? 0;
}
