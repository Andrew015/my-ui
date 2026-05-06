"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LocationFilterTabs, type LocationFilterType } from "@/components/location-filter-tabs";
import { MapItemCard } from "@/components/map-item-card";
import { MapSearchBar } from "@/components/map-search-bar";
import { MockMapView } from "@/components/mock-map-view";
import { PageHeader } from "@/components/page-header";
import {
  getActiveMarketplaceItems,
  getCurrentLocation,
  setCurrentLocation,
  type MarketplaceItem,
  useMarketplaceStore,
} from "@/data/marketplace-store";

function matchType(item: MarketplaceItem, type: LocationFilterType) {
  if (type === "all") return true;
  if (type === "sell") return item.channel === "idle";
  if (type === "rent") return item.channel === "rent";
  if (type === "swap") return item.channel === "swap";
  return item.channel === "give" || item.channel === "help";
}

function normalizeLocation(keyword: string) {
  const text = keyword.trim();
  if (!text) return "";
  if (text.includes("望京")) return "北京市朝阳区 · 望京西园";
  if (text.includes("锦绣")) return "北京市朝阳区 · 锦绣里";
  if (text.includes("朝阳")) return "北京市朝阳区 · 朝阳门";
  return `${text}附近`;
}

export default function LocationPage() {
  const router = useRouter();
  const marketplace = useMarketplaceStore();
  const [keyword, setKeyword] = useState("");
  const [filter, setFilter] = useState<LocationFilterType>("all");
  const [locationLabel, setLocationLabel] = useState(getCurrentLocation());
  const [mapSeed, setMapSeed] = useState("锦绣里");
  const allActiveItems = useMemo(
    () => getActiveMarketplaceItems(),
    [marketplace.statusById, marketplace.deletedIds],
  );
  const markers = useMemo(
    () => allActiveItems.filter((item) => matchType(item, filter)),
    [allActiveItems, filter],
  );
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selectedItem = markers.find((item) => item.id === selectedId) ?? markers[0] ?? null;

  return (
    <div className="flex min-h-full flex-col bg-gray-100">
      <PageHeader title="附近位置" backHref="/" subtitle="地图浏览附近内容" />

      <div className="space-y-3 px-4 py-3">
        <MapSearchBar
          value={keyword}
          onChange={setKeyword}
          onSubmit={() => {
            const next = normalizeLocation(keyword);
            if (!next) return;
            setLocationLabel(next);
            setMapSeed(next);
            setSelectedId(null);
          }}
        />
        <LocationFilterTabs value={filter} onChange={setFilter} />

        <div className="cursor-grab active:cursor-grabbing">
          <MockMapView
            items={markers}
            selectedId={selectedItem?.id}
            locationLabel={locationLabel}
            mapSeed={mapSeed}
            onMarkerClick={(item) => setSelectedId(item.id)}
          />
        </div>
      </div>

      <div className="mt-auto space-y-2 px-4 pb-4">
        {selectedItem ? <MapItemCard item={selectedItem} /> : null}
        <button
          type="button"
          onClick={() => {
            setCurrentLocation(locationLabel);
            router.push("/");
          }}
          className="w-full rounded-xl bg-brand py-3 text-sm font-semibold text-brand-foreground shadow-sm"
        >
          使用当前位置
        </button>
      </div>
    </div>
  );
}
