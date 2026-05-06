"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategorySelector } from "@/components/category-selector";
import { EmptyState } from "@/components/empty-state";
import { FormInput } from "@/components/form-input";
import { FormTextarea } from "@/components/form-textarea";
import { ImageUploader } from "@/components/image-uploader";
import { PageHeader } from "@/components/page-header";
import { PublishToast } from "@/components/publish-toast";
import { SubmitFooter } from "@/components/submit-footer";
import { SupportModeSelector } from "@/components/support-mode-selector";
import { TagSelector } from "@/components/tag-selector";
import {
  additionalTradePatchForSave,
  modulesToFormState,
  tradeModulesFromPublished,
  type TradeModule,
  validateAdditionalTradeForm,
} from "@/data/additional-trade";
import {
  getPublishedItemById,
  mapPublishedItemToFormState,
  publishCategories,
  swapTagOptions,
  type MyPublishedItem,
  updatePublishedItem,
} from "@/data/mock";

export default function EditSwapPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<MyPublishedItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<(typeof publishCategories)[number]>("数码");
  const [exchangeWish, setExchangeWish] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [tradeModules, setTradeModules] = useState<TradeModule[]>([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const current = getPublishedItemById(id);
      if (!current || current.type !== "swap") {
        setItem(null);
        setLoading(false);
        return;
      }
      const mapped = mapPublishedItemToFormState(current);
      setItem(current);
      setTitle(mapped.title);
      setDesc(mapped.description);
      setCategory(mapped.category as (typeof publishCategories)[number]);
      setExchangeWish(mapped.exchangeWish);
      setTags(mapped.tags);
      setTradeModules(tradeModulesFromPublished(current));
      setImages(mapped.images);
      setLocation(mapped.location);
      setLoading(false);
    }, 140);
    return () => clearTimeout(timer);
  }, [id]);

  const onAddImage = () => {
    setImages((prev) => (prev.length >= 6 ? prev : [...prev, `edit-swap-${Date.now()}-${prev.length}`]));
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
    if (!exchangeWish.trim()) {
      setToast("请填写想换什么");
      setTimeout(() => setToast(null), 1500);
      return;
    }

    const tradeCheck = validateAdditionalTradeForm(modulesToFormState(tradeModules));
    if (!tradeCheck.ok) {
      setToast(tradeCheck.message);
      setTimeout(() => setToast(null), 1800);
      return;
    }

    const patch: Partial<MyPublishedItem> = {
      title: title.trim(),
      description: desc.trim(),
      category,
      exchangeWish: exchangeWish.trim(),
      tags,
      ...additionalTradePatchForSave(modulesToFormState(tradeModules)),
      images,
      location,
    };
    const updated = updatePublishedItem(id, patch);
    console.log("update-swap", updated);
    setToast("保存成功");
    setTimeout(() => router.push("/me/published"), 700);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-100">
        <PageHeader title="编辑置换" backHref="/me/published" />
        <div className="space-y-3 px-4 py-4">
          <div className="h-28 animate-pulse rounded-xl bg-white" />
          <div className="h-24 animate-pulse rounded-xl bg-white" />
          <div className="h-24 animate-pulse rounded-xl bg-white" />
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-full bg-gray-100">
        <PageHeader title="编辑置换" backHref="/me/published" />
        <div className="py-6">
          <EmptyState
            message="内容不存在"
            actionHref="/me/published"
            actionLabel="返回我的发布"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full bg-gray-100">
      <PublishToast message={toast} />
      <PageHeader title="编辑置换" backHref="/me/published" />

      <div className="space-y-3 px-4 py-4 pb-28">
        <section className="space-y-3" aria-label="基础信息">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400">基础信息</h2>
          <ImageUploader images={images} onAddImage={onAddImage} />
        <FormInput
          label="标题"
          value={title}
          onChange={setTitle}
          placeholder="给你的置换信息起个标题"
          maxLength={30}
        />
        <FormTextarea
          label="描述"
          value={desc}
          onChange={setDesc}
          placeholder="描述一下成色、功能、置换偏好…"
        />
        <CategorySelector
          categories={publishCategories}
          selectedCategory={category}
          onSelect={(value) => setCategory(value as (typeof publishCategories)[number])}
        />
        <FormInput
          label="想换什么"
          value={exchangeWish}
          onChange={setExchangeWish}
          placeholder="例如：想换机械键盘或显示器支架"
        />
        </section>
        <section aria-label="标签">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-stone-400">标签</h2>
          <TagSelector tags={swapTagOptions} selectedTags={tags} onToggle={onToggleTag} />
        </section>
        <SupportModeSelector primaryMode="swap" modules={tradeModules} onChange={setTradeModules} />
        <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-stone-800">位置</h2>
          <p className="mt-2 text-sm text-stone-600">{location}</p>
        </section>
      </div>

      <SubmitFooter text="保存修改" onSubmit={onSubmit} />
    </div>
  );
}
