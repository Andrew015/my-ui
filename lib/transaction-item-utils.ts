import type { Item } from "@/data/mock";

/** 从 priceLabel 解析数字，如「￥120」「￥18/天」 */
export function parsePriceNumber(priceLabel: string): number {
  const m = priceLabel.match(/(\d+(?:\.\d+)?)/);
  return m ? parseFloat(m[1]) : 0;
}

/** 购买价：优先 item.price */
export function getBuyAmount(item: Item): number {
  if (item.price != null && item.price > 0) return item.price;
  return parsePriceNumber(item.priceLabel);
}

/**
 * 租用：日租金。闲置页的「附加租用」用 supportRentPrice；租赁频道用 price 或解析 priceLabel。
 */
export function getDailyRentForConfirm(item: Item): number {
  if (item.channel === "idle" && item.supportRent && item.supportRentPrice != null) {
    return item.supportRentPrice;
  }
  if (item.price != null && item.price > 0) return item.price;
  return parsePriceNumber(item.priceLabel);
}

/** 押金：解析 tag「押金100」或附加字段 */
export function getRentDeposit(item: Item): number {
  if (item.channel === "idle" && item.supportRent && item.supportRentDeposit != null) {
    return item.supportRentDeposit;
  }
  const tagMatch = item.tag.match(/押金\s*(\d+)/);
  if (tagMatch) return parseInt(tagMatch[1], 10);
  return 80;
}

export function distanceLabel(item: Item): string {
  if (item.distanceKm != null) return `${item.distanceKm.toFixed(1)}km`;
  return "—";
}
