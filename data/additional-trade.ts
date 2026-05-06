import { MAX_PUBLISH_PRICE, type MyPublishedItem } from "@/data/mock";

export type TradeModuleKind = "rent" | "swap" | "give";

export type RentTradeModule = {
  id: string;
  kind: "rent";
  supportRentPrice: string;
  supportRentDeposit: string;
  supportRentDuration: string;
  supportRentDescription: string;
};

export type SwapTradeModule = {
  id: string;
  kind: "swap";
  supportExchangeWish: string;
  supportExchangeDescription: string;
  /** 兼容旧数据回填；新 UI 不单独展示 */
  supportExchangeType?: string;
};

export type GiveTradeModule = {
  id: string;
  kind: "give";
  giveCondition: string;
  giveTarget: string;
};

export type TradeModule = RentTradeModule | SwapTradeModule | GiveTradeModule;

export function newTradeModuleId() {
  return `tm-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function createEmptyTradeModule(kind: TradeModuleKind): TradeModule {
  const id = newTradeModuleId();
  if (kind === "rent") {
    return {
      id,
      kind: "rent",
      supportRentPrice: "",
      supportRentDeposit: "",
      supportRentDuration: "",
      supportRentDescription: "",
    };
  }
  if (kind === "swap") {
    return { id, kind: "swap", supportExchangeWish: "", supportExchangeDescription: "" };
  }
  return { id, kind: "give", giveCondition: "", giveTarget: "" };
}

export function tradeModulesFromPublished(item: MyPublishedItem): TradeModule[] {
  const out: TradeModule[] = [];
  if (item.supportRent) {
    out.push({
      id: newTradeModuleId(),
      kind: "rent",
      supportRentPrice: item.supportRentPrice != null ? String(item.supportRentPrice) : "",
      supportRentDeposit: item.supportRentDeposit != null ? String(item.supportRentDeposit) : "",
      supportRentDuration: item.supportRentDuration ?? "",
      supportRentDescription: item.supportRentDescription ?? "",
    });
  }
  if (item.supportSwap) {
    out.push({
      id: newTradeModuleId(),
      kind: "swap",
      supportExchangeWish: item.supportExchangeWish ?? "",
      supportExchangeDescription: item.supportExchangeDescription ?? "",
      supportExchangeType: item.supportExchangeType ?? "",
    });
  }
  if (item.supportGive) {
    out.push({
      id: newTradeModuleId(),
      kind: "give",
      giveCondition: item.giveCondition ?? "",
      giveTarget: item.giveTarget ?? "",
    });
  }
  return out;
}

/** 发布页：附加交易方式表单状态（字符串便于输入） */
export type AdditionalTradeFormState = {
  supportRent: boolean;
  supportRentPrice: string;
  supportRentDeposit: string;
  supportRentDuration: string;
  supportRentDescription: string;
  supportSwap: boolean;
  supportExchangeWish: string;
  supportExchangeType: string;
  supportExchangeDescription: string;
  supportGive: boolean;
  giveCondition: string;
  giveTarget: string;
  giveDescription: string;
};

/** 写入 PublishedPost / MyPublishedItem 的附加字段 */
export type AdditionalTradeStoredFields = {
  supportRent?: boolean;
  supportRentPrice?: number;
  supportRentDeposit?: number;
  supportRentDuration?: string;
  supportRentDescription?: string;
  supportSwap?: boolean;
  supportExchangeWish?: string;
  supportExchangeType?: string;
  supportExchangeDescription?: string;
  supportGive?: boolean;
  giveCondition?: string;
  giveTarget?: string;
  giveDescription?: string;
};

export function emptyAdditionalTradeForm(): AdditionalTradeFormState {
  return {
    supportRent: false,
    supportRentPrice: "",
    supportRentDeposit: "",
    supportRentDuration: "",
    supportRentDescription: "",
    supportSwap: false,
    supportExchangeWish: "",
    supportExchangeType: "",
    supportExchangeDescription: "",
    supportGive: false,
    giveCondition: "",
    giveTarget: "",
    giveDescription: "",
  };
}

/** 将模块化列表合并为扁平表单，供校验与提交（每种最多一条） */
export function modulesToFormState(modules: TradeModule[]): AdditionalTradeFormState {
  const base = emptyAdditionalTradeForm();
  for (const m of modules) {
    if (m.kind === "rent") {
      base.supportRent = true;
      base.supportRentPrice = m.supportRentPrice;
      base.supportRentDeposit = m.supportRentDeposit;
      base.supportRentDuration = m.supportRentDuration;
      base.supportRentDescription = m.supportRentDescription;
    } else if (m.kind === "swap") {
      base.supportSwap = true;
      base.supportExchangeWish = m.supportExchangeWish;
      base.supportExchangeType = m.supportExchangeType ?? "";
      base.supportExchangeDescription = m.supportExchangeDescription;
    } else {
      base.supportGive = true;
      base.giveCondition = m.giveCondition;
      base.giveTarget = m.giveTarget;
      base.giveDescription = "";
    }
  }
  return base;
}

export function additionalTradeFormFromPublished(item: MyPublishedItem): AdditionalTradeFormState {
  return {
    supportRent: Boolean(item.supportRent),
    supportRentPrice: item.supportRentPrice != null ? String(item.supportRentPrice) : "",
    supportRentDeposit: item.supportRentDeposit != null ? String(item.supportRentDeposit) : "",
    supportRentDuration: item.supportRentDuration ?? "",
    supportRentDescription: item.supportRentDescription ?? "",
    supportSwap: Boolean(item.supportSwap),
    supportExchangeWish: item.supportExchangeWish ?? "",
    supportExchangeType: item.supportExchangeType ?? "",
    supportExchangeDescription: item.supportExchangeDescription ?? "",
    supportGive: Boolean(item.supportGive),
    giveCondition: item.giveCondition ?? "",
    giveTarget: item.giveTarget ?? "",
    giveDescription: item.giveDescription ?? "",
  };
}

function clampMoneyString(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (!digits) return "";
  const num = Number(digits);
  if (num > MAX_PUBLISH_PRICE) return String(MAX_PUBLISH_PRICE);
  return String(num);
}

export function publishedAdditionalTradePayload(form: AdditionalTradeFormState): AdditionalTradeStoredFields {
  const out: AdditionalTradeStoredFields = {};

  if (form.supportRent) {
    out.supportRent = true;
    const p = form.supportRentPrice.trim() ? Number(clampMoneyString(form.supportRentPrice)) : undefined;
    if (p != null && !Number.isNaN(p)) out.supportRentPrice = p;
    const d = form.supportRentDeposit.trim() ? Number(clampMoneyString(form.supportRentDeposit)) : undefined;
    if (d != null && !Number.isNaN(d)) out.supportRentDeposit = d;
    if (form.supportRentDuration.trim()) out.supportRentDuration = form.supportRentDuration.trim();
    if (form.supportRentDescription.trim()) out.supportRentDescription = form.supportRentDescription.trim();
  }
  if (form.supportSwap) {
    out.supportSwap = true;
    if (form.supportExchangeWish.trim()) out.supportExchangeWish = form.supportExchangeWish.trim();
    if (form.supportExchangeType.trim()) out.supportExchangeType = form.supportExchangeType.trim();
    if (form.supportExchangeDescription.trim())
      out.supportExchangeDescription = form.supportExchangeDescription.trim();
  }
  if (form.supportGive) {
    out.supportGive = true;
    if (form.giveCondition.trim()) out.giveCondition = form.giveCondition.trim();
    if (form.giveTarget.trim()) out.giveTarget = form.giveTarget.trim();
    if (form.giveDescription.trim()) out.giveDescription = form.giveDescription.trim();
  }

  return out;
}

export type ValidateAdditionalTradeResult = { ok: true } | { ok: false; message: string };

/** 勾选附加方式时的必填校验（不影响未勾选的主流程） */
/** 写入「我的发布」合并字段；取消勾选时会清空对应列 */
export function additionalTradePatchForSave(form: AdditionalTradeFormState): Partial<MyPublishedItem> {
  const p: Partial<MyPublishedItem> = {};
  if (form.supportRent) {
    p.supportRent = true;
    const price = form.supportRentPrice.trim() ? Number(clampMoneyString(form.supportRentPrice)) : undefined;
    if (price != null && !Number.isNaN(price)) p.supportRentPrice = price;
    const dep = form.supportRentDeposit.trim() ? Number(clampMoneyString(form.supportRentDeposit)) : undefined;
    if (dep != null && !Number.isNaN(dep)) p.supportRentDeposit = dep;
    p.supportRentDuration = form.supportRentDuration.trim() || undefined;
    p.supportRentDescription = form.supportRentDescription.trim() || undefined;
  } else {
    p.supportRent = undefined;
    p.supportRentPrice = undefined;
    p.supportRentDeposit = undefined;
    p.supportRentDuration = undefined;
    p.supportRentDescription = undefined;
  }

  if (form.supportSwap) {
    p.supportSwap = true;
    p.supportExchangeWish = form.supportExchangeWish.trim() || undefined;
    p.supportExchangeType = form.supportExchangeType.trim() || undefined;
    p.supportExchangeDescription = form.supportExchangeDescription.trim() || undefined;
  } else {
    p.supportSwap = undefined;
    p.supportExchangeWish = undefined;
    p.supportExchangeType = undefined;
    p.supportExchangeDescription = undefined;
  }

  if (form.supportGive) {
    p.supportGive = true;
    p.giveCondition = form.giveCondition.trim() || undefined;
    p.giveTarget = form.giveTarget.trim() || undefined;
    p.giveDescription = form.giveDescription.trim() || undefined;
  } else {
    p.supportGive = undefined;
    p.giveCondition = undefined;
    p.giveTarget = undefined;
    p.giveDescription = undefined;
  }

  return p;
}

export function validateAdditionalTradeForm(form: AdditionalTradeFormState): ValidateAdditionalTradeResult {
  if (form.supportRent) {
    if (!form.supportRentPrice.trim()) return { ok: false, message: "请填写附加「可租」的日租金" };
    const p = Number(clampMoneyString(form.supportRentPrice));
    if (Number.isNaN(p) || p <= 0) return { ok: false, message: "请填写有效的日租金" };
    if (p > MAX_PUBLISH_PRICE) return { ok: false, message: "日租金不能超过 1000 元" };
    if (form.supportRentDeposit.trim()) {
      const d = Number(clampMoneyString(form.supportRentDeposit));
      if (Number.isNaN(d) || d > MAX_PUBLISH_PRICE)
        return { ok: false, message: "押金不能超过 1000 元" };
    }
    if (!form.supportRentDuration.trim()) return { ok: false, message: "请填写最短租期" };
  }
  if (form.supportSwap) {
    if (!form.supportExchangeWish.trim()) return { ok: false, message: "请填写附加「可换」的想换什么" };
  }
  if (form.supportGive) {
    if (!form.giveCondition.trim()) return { ok: false, message: "请填写附加「可赠送」的赠送说明" };
  }
  return { ok: true };
}
