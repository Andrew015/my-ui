"use client";

import { useState } from "react";
import { PublishToast } from "@/components/publish-toast";
import { isFavorite, toggleFavorite, useMarketplaceStore } from "@/data/marketplace-store";

type FavoriteButtonProps = {
  itemId: string;
  className?: string;
};

export function FavoriteButton({ itemId, className = "" }: FavoriteButtonProps) {
  const marketplace = useMarketplaceStore();
  void marketplace;
  const favored = isFavorite(itemId);
  const [toast, setToast] = useState<string | null>(null);

  return (
    <>
      <PublishToast message={toast} />
      <button
        type="button"
        aria-label={favored ? "取消收藏" : "收藏"}
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          const next = toggleFavorite(itemId);
          setToast(next ? "已加入收藏" : "已取消收藏");
          setTimeout(() => setToast(null), 1200);
        }}
        className={`z-10 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/90 ring-1 ring-stone-200 transition hover:bg-white ${className}`}
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={favored ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="2"
          className={favored ? "text-orange-500" : "text-stone-400"}
        >
          <path d="M12 21s-7.2-4.35-9.5-8.2A5.5 5.5 0 0 1 12 5.2a5.5 5.5 0 0 1 9.5 7.6C19.2 16.65 12 21 12 21Z" />
        </svg>
      </button>
    </>
  );
}
