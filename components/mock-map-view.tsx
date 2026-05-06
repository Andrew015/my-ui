"use client";

import type { MarketplaceItem } from "@/data/marketplace-store";
import { MapMarkerBubble } from "@/components/map-marker-bubble";

type MockMapViewProps = {
  items: MarketplaceItem[];
  selectedId?: string;
  locationLabel: string;
  mapSeed: string;
  onMarkerClick: (item: MarketplaceItem) => void;
};

function hashCode(text: string) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function getMarkerPoint(item: MarketplaceItem, seed: string) {
  if (item.mapX != null && item.mapY != null) {
    return { x: item.mapX, y: item.mapY };
  }
  const h = hashCode(`${seed}-${item.id}`);
  const x = 14 + (h % 72);
  const y = 18 + ((Math.floor(h / 7) % 62));
  return { x, y };
}

export function MockMapView({
  items,
  selectedId,
  locationLabel,
  mapSeed,
  onMarkerClick,
}: MockMapViewProps) {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-2xl bg-[#EEF1EE] ring-1 ring-orange-100/90">
      <div className="absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.45)_20%,transparent_20%,transparent_80%,rgba(255,255,255,0.4)_80%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(255,255,255,0.8),transparent_35%),radial-gradient(circle_at_75%_70%,rgba(255,255,255,0.7),transparent_30%)]" />
      <div className="absolute left-8 top-8 rounded-lg bg-white/85 px-2 py-1 text-[11px] text-stone-500">
        锦绣路
      </div>
      <div className="absolute right-8 top-24 rounded-lg bg-white/85 px-2 py-1 text-[11px] text-stone-500">
        朝阳北街
      </div>

      <div className="absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
        <div className="h-4 w-4 rounded-full bg-blue-500 ring-4 ring-blue-200/80" />
        <p className="mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-2 py-0.5 text-[11px] text-stone-600 shadow-sm">
          {locationLabel}
        </p>
      </div>

      {items.map((item) => {
        const point = getMarkerPoint(item, mapSeed);
        return (
          <MapMarkerBubble
            key={item.id}
            item={item}
            mapX={point.x}
            mapY={point.y}
            active={selectedId === item.id}
            onClick={() => onMarkerClick(item)}
          />
        );
      })}
    </div>
  );
}
