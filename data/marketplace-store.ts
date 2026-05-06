"use client";

import { useSyncExternalStore } from "react";
import { createNotification } from "@/data/notification-store";
import {
  currentUser,
  getMyPublishedItems,
  items,
  type Channel,
  type Item,
  type PublishedStatus,
} from "@/data/mock";

type MarketplaceState = {
  statusById: Record<string, PublishedStatus>;
  deletedIds: Record<string, true>;
  favoriteById: Record<string, true>;
  history: Array<{ id: string; viewedAt: number }>;
  currentLocation: string;
};

export type MarketplaceItem = Item & {
  status: PublishedStatus;
};

const listeners = new Set<() => void>();

function createInitialState(): MarketplaceState {
  const statusById: Record<string, PublishedStatus> = {};
  getMyPublishedItems().forEach((item) => {
    statusById[item.id] = item.status;
  });
  return {
    statusById,
    deletedIds: {},
    favoriteById: {},
    history: [],
    currentLocation: "北京市朝阳区 · 锦绣里",
  };
}

let state: MarketplaceState = createInitialState();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

export function useMarketplaceStore() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}

export function getMarketplaceItemStatus(id: string): PublishedStatus {
  return state.statusById[id] ?? "active";
}

export function updateItemStatus(id: string, status: PublishedStatus) {
  state = {
    ...state,
    statusById: {
      ...state.statusById,
      [id]: status,
    },
  };
  const item = items.find((x) => x.id === id);
  if (item && item.ownerId !== currentUser.id) {
    if (status === "offline") {
      createNotification({
        userId: currentUser.id,
        type: "item_offline",
        title: "商品已下架",
        content: `你关注的「${item.title}」已下架`,
        relatedId: item.id,
        relatedType: "item",
      });
    } else if (status === "done") {
      createNotification({
        userId: currentUser.id,
        type: "item_completed",
        title: "商品已完成",
        content: `你关注的「${item.title}」已完成`,
        relatedId: item.id,
        relatedType: "item",
      });
    }
  }
  emit();
}

/** Backward compatibility */
export const setMarketplaceItemStatus = updateItemStatus;

export function removeMarketplaceItem(id: string) {
  const { [id]: _, ...restFavorite } = state.favoriteById;
  state = {
    ...state,
    deletedIds: {
      ...state.deletedIds,
      [id]: true,
    },
    favoriteById: restFavorite,
    history: state.history.filter((entry) => entry.id !== id),
  };
  emit();
}

export function isMarketplaceItemDeleted(id: string) {
  return Boolean(state.deletedIds[id]);
}

export function getMarketplaceItemById(id: string): MarketplaceItem | null {
  const found = items.find((item) => item.id === id);
  if (!found || isMarketplaceItemDeleted(id)) return null;
  return { ...found, status: getMarketplaceItemStatus(found.id) };
}

export function isFavorite(id: string) {
  return Boolean(state.favoriteById[id]);
}

/** @returns next favorite status */
export function toggleFavorite(id: string): boolean {
  if (isMarketplaceItemDeleted(id)) return false;
  if (isFavorite(id)) {
    const { [id]: _, ...rest } = state.favoriteById;
    state = { ...state, favoriteById: rest };
    emit();
    return false;
  }
  state = {
    ...state,
    favoriteById: {
      ...state.favoriteById,
      [id]: true,
    },
  };
  emit();
  return true;
}

export function getMarketplaceItemsByChannel(channel: Channel): MarketplaceItem[] {
  return items
    .filter((item) => item.channel === channel && !isMarketplaceItemDeleted(item.id))
    .map((item) => ({ ...item, status: getMarketplaceItemStatus(item.id) }));
}

export function getAllMarketplaceItems(): MarketplaceItem[] {
  return items
    .filter((item) => !isMarketplaceItemDeleted(item.id))
    .map((item) => ({ ...item, status: getMarketplaceItemStatus(item.id) }));
}

export function getActiveMarketplaceItemsByChannel(channel: Channel): MarketplaceItem[] {
  return getMarketplaceItemsByChannel(channel).filter((item) => item.status === "active");
}

export function getActiveMarketplaceItems(): MarketplaceItem[] {
  return getAllMarketplaceItems().filter((item) => item.status === "active");
}

export function getFavoriteItems(): MarketplaceItem[] {
  return items
    .filter((item) => !isMarketplaceItemDeleted(item.id) && isFavorite(item.id))
    .map((item) => ({ ...item, status: getMarketplaceItemStatus(item.id) }));
}

export function getFavoriteItemsByType(type: "sell" | "rent" | "swap" | "community") {
  const all = getFavoriteItems();
  if (type === "sell") return all.filter((item) => item.channel === "idle");
  if (type === "rent") return all.filter((item) => item.channel === "rent");
  if (type === "swap") return all.filter((item) => item.channel === "swap");
  return all.filter((item) => item.channel === "give" || item.channel === "help");
}

export function addToHistory(id: string) {
  if (isMarketplaceItemDeleted(id)) return;
  const now = Date.now();
  const next = [{ id, viewedAt: now }, ...state.history.filter((entry) => entry.id !== id)];
  state = {
    ...state,
    history: next.slice(0, 50),
  };
  emit();
}

export function removeFromHistory(id: string) {
  state = {
    ...state,
    history: state.history.filter((entry) => entry.id !== id),
  };
  emit();
}

export function clearHistory() {
  state = {
    ...state,
    history: [],
  };
  emit();
}

export function getHistoryItems() {
  return state.history
    .map((entry) => {
      const item = getMarketplaceItemById(entry.id);
      if (!item) return null;
      return { ...item, viewedAt: entry.viewedAt };
    })
    .filter((item): item is MarketplaceItem & { viewedAt: number } => Boolean(item));
}

export function getHistoryItemsByType(type: "sell" | "rent" | "swap" | "community") {
  const all = getHistoryItems();
  if (type === "sell") return all.filter((item) => item.channel === "idle");
  if (type === "rent") return all.filter((item) => item.channel === "rent");
  if (type === "swap") return all.filter((item) => item.channel === "swap");
  return all.filter((item) => item.channel === "give" || item.channel === "help");
}

export function getActiveSellItems() {
  return getActiveMarketplaceItemsByChannel("idle");
}

export function getActiveRentItems() {
  return getActiveMarketplaceItemsByChannel("rent");
}

export function getActiveSwapItems() {
  return getActiveMarketplaceItemsByChannel("swap");
}

export function getActiveCommunityItems() {
  return [
    ...getActiveMarketplaceItemsByChannel("give"),
    ...getActiveMarketplaceItemsByChannel("help"),
  ];
}

export function getCurrentLocation() {
  return state.currentLocation;
}

export function setCurrentLocation(next: string) {
  if (!next.trim()) return;
  state = {
    ...state,
    currentLocation: next.trim(),
  };
  emit();
}
