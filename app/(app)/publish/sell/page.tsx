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
import { TagSelector } from "@/components/tag-selector";
import { createPublishedMockItem, publishCategories, sellTagOptions } from "@/data/mock";

function sanitizeMoney(value: string) {
  return value.replace(/[^\d.]/g, "");
}

export default function PublishSellPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState<(typeof publishCategories)[number]>("数码");
  const [tags, setTags] = useState<string[]>(["95新"]);
  const [images, setImages] = useState<string[]>([]);
  const [location] = useState("锦绣里 · 距离 3.8km");
  const [toast, setToast] = useState<string | null>(null);

  const onAddImage = () => {
    setImages((prev) => (prev.length >= 6 ? prev : [...prev, `sell-${Date.now()}-${prev.length}`]));
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

    const payload = {
      type: "sell" as const,
      title: title.trim(),
      description: desc.trim(),
      price: Number(price),
      category,
      tags,
      location,
      images,
    };
    console.log("publish-sell", payload);
    createPublishedMockItem(payload);
    setToast("发布成功");
    setTimeout(() => router.push("/idle"), 700);
  };

  return (
    <div className="min-h-full bg-gray-100">
      <PublishToast message={toast} />
      <PageHeader title="发布出售" backHref="/publish" />

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

      <SubmitFooter text="发布闲置" onSubmit={onSubmit} />
    </div>
  );
}
