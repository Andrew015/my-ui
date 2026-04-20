import type { Item } from "@/data/mock";

const GRADIENTS: string[] = [
  "bg-gradient-to-br from-orange-50 via-orange-100/95 to-stone-200/90",
  "bg-gradient-to-br from-stone-100 via-orange-50/90 to-stone-200",
  "bg-gradient-to-br from-amber-50 via-orange-100 to-stone-100",
  "bg-gradient-to-br from-neutral-100 via-stone-50 to-orange-50/80",
  "bg-gradient-to-br from-orange-100 to-amber-100/70",
  "bg-gradient-to-br from-stone-100 to-orange-50/95",
];

function hashId(id: string) {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h << 5) - h + id.charCodeAt(i);
  return h;
}

export function getItemCoverClass(item: Item) {
  const i = item.imageTint ?? Math.abs(hashId(item.id)) % GRADIENTS.length;
  return GRADIENTS[i % GRADIENTS.length];
}
