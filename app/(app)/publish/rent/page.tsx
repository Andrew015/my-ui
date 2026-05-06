"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategorySelector } from "@/components/category-selector";
import { FormInput } from "@/components/form-input";
import { FormTextarea } from "@/components/form-textarea";
import { ImageUploader } from "@/components/image-uploader";
import { PageHeader } from "@/components/page-header";
import { PriceInput } from "@/components/price-input";
import { PublishToast } from "@/components/publish-toast";
import { SubmitFooter } from "@/components/submit-footer";
import { SupportModeSelector } from "@/components/support-mode-selector";
import { TagSelector } from "@/components/tag-selector";
import {
  modulesToFormState,
  publishedAdditionalTradePayload,
  type TradeModule,
  validateAdditionalTradeForm,
} from "@/data/additional-trade";
import {
  createPublishedMockItem,
  MAX_PUBLISH_PRICE,
  publishCategories,
  rentTagOptions,
  rentTermOptions,
} from "@/data/mock";

function clampMoneyInput(value: string) {
  const digits = value.replace(/\D/g, "");
  if (!digits) return { value: "", capped: false };
  const num = Number(digits);
  if (num > MAX_PUBLISH_PRICE) return { value: String(MAX_PUBLISH_PRICE), capped: true };
  return { value: String(num), capped: false };
}

export default function PublishRentPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [rent, setRent] = useState("");
  const [deposit, setDeposit] = useState("");
  const [rentTerm, setRentTerm] = useState<(typeof rentTermOptions)[number]>("按天");
  const [category, setCategory] = useState<(typeof publishCategories)[number]>("数码");
  const [tags, setTags] = useState<string[]>(["可面交"]);
  const [images, setImages] = useState<string[]>([]);
  const [tradeModules, setTradeModules] = useState<TradeModule[]>([]);
  const [location] = useState("锦绣里 · 距离 3.8km");
  const [toast, setToast] = useState<string | null>(null);

  const onAddImage = () => {
    setImages((prev) => (prev.length >= 6 ? prev : [...prev, `rent-${Date.now()}-${prev.length}`]));
  };
  const onToggleTag = (tag: string) => {
    setTags((prev) => (prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag]));
  };

  const onSubmit = () => {
    if (!title.trim()) {
      setToast("请先填写标题");
      setTimeout(() => setToast(null), 1500);
      return;
    }
    if (!rent.trim()) {
      setToast("请先填写租金");
      setTimeout(() => setToast(null), 1500);
      return;
    }
    if (Number(rent) > MAX_PUBLISH_PRICE) {
      setToast("当前仅支持发布 1000 元以内的商品或服务");
      setTimeout(() => setToast(null), 1800);
      return;
    }
    if (Number(deposit || 0) > MAX_PUBLISH_PRICE) {
      setToast("当前仅支持发布 1000 元以内的商品或服务");
      setTimeout(() => setToast(null), 1800);
      return;
    }
    if (Number(rent) > MAX_PUBLISH_PRICE || Number(deposit || 0) > MAX_PUBLISH_PRICE) return;

    const tradeCheck = validateAdditionalTradeForm(modulesToFormState(tradeModules));
    if (!tradeCheck.ok) {
      setToast(tradeCheck.message);
      setTimeout(() => setToast(null), 1800);
      return;
    }

    const payload = {
      type: "rent" as const,
      title: title.trim(),
      description: desc.trim(),
      rent: Number(rent),
      deposit: deposit ? Number(deposit) : 0,
      rentTerm,
      category,
      tags,
      ...publishedAdditionalTradePayload(modulesToFormState(tradeModules)),
      location,
      images,
    };
    console.log("publish-rent", payload);
    createPublishedMockItem(payload);
    setToast("发布成功");
    setTimeout(() => router.push("/"), 700);
  };

  return (
    <div className="min-h-full bg-gray-100">
      <PublishToast message={toast} />
      <PageHeader title="发布出租" backHref="/publish" />

      <div className="space-y-3 px-4 py-4 pb-28">
        <section className="space-y-3" aria-label="基础信息">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400">基础信息</h2>
          <ImageUploader images={images} onAddImage={onAddImage} />
          <FormInput
            label="标题"
            value={title}
            onChange={setTitle}
            placeholder="给你的租赁信息起个标题"
            maxLength={30}
          />
          <FormTextarea
            label="描述"
            value={desc}
            onChange={setDesc}
            placeholder="描述一下可租时段、设备情况、取还方式…"
          />
          <CategorySelector
            categories={publishCategories}
            selectedCategory={category}
            onSelect={(value) => setCategory(value as (typeof publishCategories)[number])}
          />
          <PriceInput
            label="租金"
            value={rent}
            onChange={(value) => {
              const next = clampMoneyInput(value);
              setRent(next.value);
              if (next.capped) {
                setToast("当前仅支持发布 1000 元以内的商品或服务");
                setTimeout(() => setToast(null), 800);
              }
            }}
            placeholder="请输入租金（≤1000元）"
          />
          <PriceInput
            label="押金"
            value={deposit}
            onChange={(value) => {
              const next = clampMoneyInput(value);
              setDeposit(next.value);
              if (next.capped) {
                setToast("当前仅支持发布 1000 元以内的商品或服务");
                setTimeout(() => setToast(null), 800);
              }
            }}
            placeholder="请输入押金（≤1000元）"
          />
          <CategorySelector
            label="租期"
            categories={rentTermOptions}
            selectedCategory={rentTerm}
            onSelect={(value) => setRentTerm(value as (typeof rentTermOptions)[number])}
          />
        </section>

        <section aria-label="标签">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">标签</h2>
          <TagSelector tags={rentTagOptions} selectedTags={tags} onToggle={onToggleTag} />
        </section>

        <SupportModeSelector
          primaryMode="rent"
          modules={tradeModules}
          onChange={setTradeModules}
          onMoneyCap={() => {
            setToast("当前仅支持发布 1000 元以内的商品或服务");
            setTimeout(() => setToast(null), 800);
          }}
        />

        <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-stone-800">位置</h2>
          <p className="mt-2 text-sm text-stone-600">{location}</p>
        </section>
      </div>

      <SubmitFooter text="发布出租" onSubmit={onSubmit} />
    </div>
  );
}
