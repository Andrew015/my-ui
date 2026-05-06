"use client";

import type { MarketplaceItem } from "@/data/marketplace-store";

type MapMarkerBubbleProps = {
  item: MarketplaceItem;
  mapX: number;
  mapY: number;
  active: boolean;
  onClick: () => void;
};

function getTypeColor(item: MarketplaceItem) {
  if (item.channel === "idle") return "bg-orange-500";
  if (item.channel === "rent") return "bg-amber-500";
  if (item.channel === "swap") return "bg-yellow-600";
  return "bg-emerald-500";
}

export function MapMarkerBubble({ item, mapX, mapY, active, onClick }: MapMarkerBubbleProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 transition ${
        active ? "ring-2 ring-orange-400" : ""
      }`}
      style={{ left: `${mapX}%`, top: `${mapY}%` }}
    >
      <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md ring-2 ring-white">
        <span className="text-sm" aria-hidden>
          📦
        </span>
        <span className={`absolute right-0 top-0 h-2.5 w-2.5 rounded-full ${getTypeColor(item)}`} />
      </div>
    </button>
  );
}
