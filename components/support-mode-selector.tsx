"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { FormInput } from "@/components/form-input";
import { FormTextarea } from "@/components/form-textarea";
import { PriceInput } from "@/components/price-input";
import {
  createEmptyTradeModule,
  type TradeModule,
  type TradeModuleKind,
} from "@/data/additional-trade";
import { MAX_PUBLISH_PRICE } from "@/data/mock";

type PrimaryMode = "sell" | "rent" | "swap" | "community";

function isConflict(primaryMode: PrimaryMode, key: TradeModuleKind) {
  if (primaryMode === "rent") return key === "rent";
  if (primaryMode === "swap") return key === "swap";
  if (primaryMode === "community") return key === "give";
  return false;
}

function clampMoneyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return { value: "", capped: false };
  const num = Number(digits);
  if (num > MAX_PUBLISH_PRICE) return { value: String(MAX_PUBLISH_PRICE), capped: true };
  return { value: String(num), capped: false };
}

type SupportModeSelectorProps = {
  primaryMode: PrimaryMode;
  modules: TradeModule[];
  onChange: (next: TradeModule[]) => void;
  onMoneyCap?: () => void;
};

const SHEET_OPTIONS: { kind: TradeModuleKind; title: string; subtitle: string }[] = [
  { kind: "rent", title: "支持租用", subtitle: "按日计价、押金与租期说明" },
  { kind: "swap", title: "支持置换", subtitle: "写出想换的物品与补充说明" },
  { kind: "give", title: "支持赠送", subtitle: "赠送说明与优先对象" },
];

const ALL_KINDS: TradeModuleKind[] = ["rent", "swap", "give"];

function canStillAddKind(primaryMode: PrimaryMode, activeKinds: Set<TradeModuleKind>) {
  return ALL_KINDS.some((k) => !isConflict(primaryMode, k) && !activeKinds.has(k));
}

export function SupportModeSelector({
  primaryMode,
  modules,
  onChange,
  onMoneyCap,
}: SupportModeSelectorProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!sheetOpen || typeof document === "undefined") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [sheetOpen]);

  const activeKinds = new Set(modules.map((m) => m.kind));
  const canAddMore = canStillAddKind(primaryMode, activeKinds);

  const addKind = (kind: TradeModuleKind) => {
    if (isConflict(primaryMode, kind)) return;
    if (activeKinds.has(kind)) return;
    onChange([...modules, createEmptyTradeModule(kind)]);
    setSheetOpen(false);
  };

  const remove = (id: string) => {
    onChange(modules.filter((m) => m.id !== id));
  };

  const sheet =
    sheetOpen && mounted
      ? createPortal(
          <div className="fixed inset-0 z-[100] flex flex-col justify-end">
            <button
              type="button"
              className="absolute inset-0 bg-black/45 backdrop-blur-[1px]"
              aria-label="关闭"
              onClick={() => setSheetOpen(false)}
            />
            <div className="relative max-h-[min(78vh,560px)] overflow-hidden rounded-t-3xl bg-white shadow-[0_-12px_40px_rgba(0,0,0,0.12)]">
              <div className="flex justify-center pt-2 pb-1">
                <span className="h-1 w-10 rounded-full bg-stone-200" aria-hidden />
              </div>
              <div className="border-b border-orange-100/80 px-4 pb-3 pt-1">
                <p className="text-center text-base font-semibold text-stone-800">选择交易方式</p>
                <p className="mt-1 text-center text-xs text-stone-500">已添加的类型可在下方填写详情</p>
              </div>
              <div className="max-h-[52vh] overflow-y-auto px-3 pb-[max(1rem,env(safe-area-inset-bottom))] pt-2">
                {SHEET_OPTIONS.map((opt) => {
                  const conflict = isConflict(primaryMode, opt.kind);
                  const taken = activeKinds.has(opt.kind);
                  const disabled = conflict || taken;
                  return (
                    <button
                      key={opt.kind}
                      type="button"
                      disabled={disabled}
                      onClick={() => addKind(opt.kind)}
                      className={`mb-2 flex w-full flex-col rounded-2xl border px-4 py-3.5 text-left transition active:scale-[0.99] ${
                        disabled
                          ? "cursor-not-allowed border-stone-100 bg-stone-50 text-stone-400"
                          : "border-orange-100 bg-white shadow-sm ring-1 ring-orange-100/70 hover:bg-orange-50/40"
                      }`}
                    >
                      <span className="text-sm font-semibold text-stone-800">{opt.title}</span>
                      <span className="mt-0.5 text-xs text-stone-500">{opt.subtitle}</span>
                      {conflict ? (
                        <span className="mt-2 text-[11px] text-stone-400">与当前发布类型重复</span>
                      ) : taken ? (
                        <span className="mt-2 text-[11px] text-stone-400">已添加，请先删除后再选</span>
                      ) : null}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-orange-100/90 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setSheetOpen(false)}
                  className="w-full rounded-xl bg-stone-100 py-3 text-sm font-medium text-stone-700"
                >
                  取消
                </button>
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-stone-800">附加交易方式</h2>
          <p className="mt-1 text-xs leading-relaxed text-stone-500">
            新模块会插入在下方；添加按钮固定在模块列表末尾，填写长表单时也便于继续追加。
          </p>
        </div>
      </div>

      {modules.length ? (
        <div className="mt-5 space-y-5">
          {modules.map((mod) => (
            <div key={mod.id}>
              {mod.kind === "rent" ? (
                <article className="overflow-hidden rounded-2xl border border-orange-100/90 bg-gradient-to-b from-white to-orange-50/30 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-orange-100/80 bg-white/80 px-4 py-3">
                    <h3 className="text-sm font-semibold text-emphasis">支持租用</h3>
                    <button
                      type="button"
                      onClick={() => remove(mod.id)}
                      className="shrink-0 text-xs font-medium text-stone-400 underline-offset-2 hover:text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </div>
                  <div className="space-y-3 px-4 py-4">
                    <PriceInput
                      label="日租金（元）"
                      value={mod.supportRentPrice}
                      onChange={(v) => {
                        const next = clampMoneyInput(v);
                        onChange(
                          modules.map((m) =>
                            m.id === mod.id && m.kind === "rent"
                              ? { ...m, supportRentPrice: next.value }
                              : m,
                          ),
                        );
                        if (next.capped) onMoneyCap?.();
                      }}
                      placeholder={`≤${MAX_PUBLISH_PRICE} 元/天`}
                    />
                    <PriceInput
                      label="押金（可选）"
                      value={mod.supportRentDeposit}
                      onChange={(v) => {
                        const next = clampMoneyInput(v);
                        onChange(
                          modules.map((m) =>
                            m.id === mod.id && m.kind === "rent"
                              ? { ...m, supportRentDeposit: next.value }
                              : m,
                          ),
                        );
                        if (next.capped) onMoneyCap?.();
                      }}
                      placeholder="留空表示商议"
                    />
                    <FormInput
                      label="租期"
                      value={mod.supportRentDuration}
                      onChange={(v) =>
                        onChange(
                          modules.map((m) =>
                            m.id === mod.id && m.kind === "rent" ? { ...m, supportRentDuration: v } : m,
                          ),
                        )
                      }
                      placeholder="例如：最短 3 天"
                    />
                    <FormTextarea
                      label="补充说明"
                      value={mod.supportRentDescription}
                      onChange={(v) =>
                        onChange(
                          modules.map((m) =>
                            m.id === mod.id && m.kind === "rent"
                              ? { ...m, supportRentDescription: v }
                              : m,
                          ),
                        )
                      }
                      placeholder="取还方式、可租时段等"
                      rows={3}
                    />
                  </div>
                </article>
              ) : mod.kind === "swap" ? (
                <article className="overflow-hidden rounded-2xl border border-orange-100/90 bg-gradient-to-b from-white to-orange-50/30 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-orange-100/80 bg-white/80 px-4 py-3">
                    <h3 className="text-sm font-semibold text-emphasis">支持置换</h3>
                    <button
                      type="button"
                      onClick={() => remove(mod.id)}
                      className="shrink-0 text-xs font-medium text-stone-400 underline-offset-2 hover:text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </div>
                  <div className="space-y-3 px-4 py-4">
                    <FormInput
                      label="想换什么"
                      value={mod.supportExchangeWish}
                      onChange={(v) =>
                        onChange(
                          modules.map((m) =>
                            m.id === mod.id && m.kind === "swap" ? { ...m, supportExchangeWish: v } : m,
                          ),
                        )
                      }
                      placeholder="描述希望交换的物品或范围"
                    />
                    <FormTextarea
                      label="补充说明"
                      value={mod.supportExchangeDescription}
                      onChange={(v) =>
                        onChange(
                          modules.map((m) =>
                            m.id === mod.id && m.kind === "swap"
                              ? { ...m, supportExchangeDescription: v }
                              : m,
                          ),
                        )
                      }
                      placeholder="成色、品牌偏好等"
                      rows={3}
                    />
                  </div>
                </article>
              ) : (
                <article className="overflow-hidden rounded-2xl border border-orange-100/90 bg-gradient-to-b from-white to-orange-50/30 shadow-sm">
                  <div className="flex items-center justify-between gap-2 border-b border-orange-100/80 bg-white/80 px-4 py-3">
                    <h3 className="text-sm font-semibold text-emphasis">支持赠送</h3>
                    <button
                      type="button"
                      onClick={() => remove(mod.id)}
                      className="shrink-0 text-xs font-medium text-stone-400 underline-offset-2 hover:text-red-500 hover:underline"
                    >
                      删除
                    </button>
                  </div>
                  <div className="space-y-3 px-4 py-4">
                    <FormTextarea
                      label="赠送说明"
                      value={mod.giveCondition}
                      onChange={(v) =>
                        onChange(
                          modules.map((m) =>
                            m.id === mod.id && m.kind === "give" ? { ...m, giveCondition: v } : m,
                          ),
                        )
                      }
                      placeholder="物品状态、领取要求等"
                      rows={3}
                    />
                    <FormInput
                      label="优先对象"
                      value={mod.giveTarget}
                      onChange={(v) =>
                        onChange(
                          modules.map((m) =>
                            m.id === mod.id && m.kind === "give" ? { ...m, giveTarget: v } : m,
                          ),
                        )
                      }
                      placeholder="例如：同小区邻居优先"
                    />
                  </div>
                </article>
              )}
            </div>
          ))}
        </div>
      ) : null}

      <div
        className={
          modules.length
            ? "mt-6 border-t border-orange-100/90 pt-6"
            : "mt-4 border-t-0 pt-0"
        }
      >
        {modules.length === 0 ? (
          <p className="mb-4 text-center text-xs text-stone-400">可选：为物品增加租/换/赠等成交方式</p>
        ) : null}
        <button
          type="button"
          disabled={!canAddMore}
          onClick={() => canAddMore && setSheetOpen(true)}
          className={`flex w-full items-center justify-center gap-2 rounded-xl border border-dashed py-3.5 text-sm font-semibold transition ${
            canAddMore
              ? "border-orange-200 bg-orange-50/50 text-emphasis hover:bg-orange-50 active:scale-[0.99]"
              : "cursor-not-allowed border-dashed border-stone-200 bg-stone-100/80 text-stone-400"
          }`}
        >
          {canAddMore ? (
            <>
              <span className="text-lg leading-none">+</span>
              添加交易方式
            </>
          ) : (
            <>已添加全部交易方式</>
          )}
        </button>
      </div>

      {sheet}
    </section>
  );
}
