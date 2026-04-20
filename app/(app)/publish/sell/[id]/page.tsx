"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { CategorySelector } from "@/components/category-selector";
import { EmptyState } from "@/components/empty-state";
import { FormInput } from "@/components/form-input";
import { FormTextarea } from "@/components/form-textarea";
import { ImageUploader } from "@/components/image-uploader";
import { PageHeader } from "@/components/page-header";
import { PriceInput } from "@/components/price-input";
import { PublishToast } from "@/components/publish-toast";
import { SubmitFooter } from "@/components/submit-footer";
import { TagSelector } from "@/components/tag-selector";
import {
  getPublishedItemById,
  mapPublishedItemToFormState,
  publishCategories,
  sellTagOptions,
  type MyPublishedItem,
  updatePublishedItem,
} from "@/data/mock";

function sanitizeMoney(value: string) {
  return value.replace(/[^\d.]/g, "");
}

export default function EditSellPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<MyPublishedItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<(typeof publishCategories)[number]>("数码");
  const [price, setPrice] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const current = getPublishedItemById(id);
      if (!current || current.type !== "sell") {
        setItem(null);
        setLoading(false);
        return;
      }
      const mapped = mapPublishedItemToFormState(current);
      setItem(current);
      setTitle(mapped.title);
      setDesc(mapped.description);
      setCategory(mapped.category as (typeof publishCategories)[number]);
      setPrice(mapped.price);
      setTags(mapped.tags);
      setImages(mapped.images);
      setLocation(mapped.location);
      setLoading(false);
    }, 140);
    return () => clearTimeout(timer);
  }, [id]);

  const onAddImage = () => {
    setImages((prev) => (prev.length >= 6 ? prev : [...prev, `edit-sell-${Date.now()}-${prev.length}`]));
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
    if (!price.trim()) {
      setToast("请先填写价格");
      setTimeout(() => setToast(null), 1500);
      return;
    }

    const patch: Partial<MyPublishedItem> = {
      title: title.trim(),
      description: desc.trim(),
      category,
      price: Number(price),
      tags,
      images,
      location,
    };
    const updated = updatePublishedItem(id, patch);
    console.log("update-sell", updated);
    setToast("保存成功");
    setTimeout(() => router.push("/me/published"), 700);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-100">
        <PageHeader title="编辑出售" backHref="/me/published" />
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
        <PageHeader title="编辑出售" backHref="/me/published" />
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
      <PageHeader title="编辑出售" backHref="/me/published" />

      <div className="space-y-3 px-4 py-4 pb-28">
        <ImageUploader images={images} onAddImage={onAddImage} />
        <FormInput
          label="标题"
          value={title}
          onChange={setTitle}
          placeholder="给你的宝贝起个标题吧"
          maxLength={30}
        />
        <FormTextarea
          label="描述"
          value={desc}
          onChange={setDesc}
          placeholder="描述一下成色、功能、使用情况…"
        />
        <CategorySelector
          categories={publishCategories}
          selectedCategory={category}
          onSelect={(value) => setCategory(value as (typeof publishCategories)[number])}
        />
        <PriceInput
          label="价格"
          value={price}
          onChange={(value) => setPrice(sanitizeMoney(value))}
          placeholder="请输入价格"
        />
        <TagSelector tags={sellTagOptions} selectedTags={tags} onToggle={onToggleTag} />
        <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-stone-800">位置</h2>
          <p className="mt-2 text-sm text-stone-600">{location}</p>
        </section>
      </div>

      <SubmitFooter text="保存修改" onSubmit={onSubmit} />
    </div>
  );
}
