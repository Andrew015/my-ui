import type { Transaction } from "@/data/transaction-store";

export type TimelineRenderMode = "normal" | "all-complete" | "cancelled" | "rejected";

export type TimelineResult = {
  steps: string[];
  /** 当前高亮步骤下标（normal 模式；cancelled 时仅用于展示全部步骤） */
  activeIndex: number;
  mode: TimelineRenderMode;
};

/** 购买 */
const BUY_STEPS = ["已发起交易", "等待确认", "待见面交易", "进行中", "已完成"];

/** 租用 */
const RENT_STEPS = ["已发起租用", "等待确认", "待交接", "租用中", "已完成"];

/** 置换 */
const SWAP_STEPS = ["已发起置换", "等待确认", "待交换", "交换中", "已完成"];

/** 公益 / 领取 */
const GIVE_STEPS = ["已提交申请", "等待确认", "待领取", "领取中", "已完成"];

export function getTransactionTimeline(tx: Transaction): TimelineResult {
  if (tx.status === "rejected") {
    return {
      steps: ["已发起交易", "申请被拒绝"],
      activeIndex: 1,
      mode: "rejected",
    };
  }

  if (tx.status === "cancelled") {
    const steps = pickSteps(tx.type);
    return { steps, activeIndex: 0, mode: "cancelled" };
  }

  if (tx.status === "completed") {
    const steps = pickSteps(tx.type);
    return { steps, activeIndex: steps.length - 1, mode: "all-complete" };
  }

  const steps = pickSteps(tx.type);
  let activeIndex = 1;

  if (tx.status === "pending") {
    activeIndex = 1;
  } else if (tx.status === "confirmed") {
    activeIndex = 2;
  } else if (tx.status === "processing") {
    activeIndex = 3;
  } else {
    activeIndex = 1;
  }

  return { steps, activeIndex, mode: "normal" };
}

function pickSteps(type: Transaction["type"]): string[] {
  switch (type) {
    case "buy":
      return BUY_STEPS;
    case "rent":
      return RENT_STEPS;
    case "swap":
      return SWAP_STEPS;
    case "give":
      return GIVE_STEPS;
    default:
      return BUY_STEPS;
  }
}
