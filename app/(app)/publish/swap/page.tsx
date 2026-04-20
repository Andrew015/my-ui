"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { CategorySelector } from "@/components/category-selector";
import { FormInput } from "@/components/form-input";
import { FormTextarea } from "@/components/form-textarea";
import { ImageUploader } from "@/components/image-uploader";
import { PageHeader } from "@/components/page-header";
import { PublishToast } from "@/components/publish-toast";
import { SubmitFooter } from "@/components/submit-footer";
import { TagSelector } from "@/components/tag-selector";
import {
  createPublishedMockItem,
  publishCategories,
  swapTagOptions,
} from "@/data/mock";

export default function PublishSwapPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [expectedSwap, setExpectedSwap] = useState("");
  const [category, setCategory] = useState<(typeof publishCategories)[number]>("数码");
  const [tags, setTags] = useState<string[]>(["同城"]);
  const [images, setImages] = useState<string[]>([]);
  const [location] = useState("锦绣里 · 距离 3.8km");
  const [toast, setToast] = useState<string | null>(null);

  const onAddImage = () => {
    setImages((prev) => (prev.length >= 6 ? prev : [...prev, `swap-${Date.now()}-${prev.length}`]));
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
    if (!expectedSwap.trim()) {
      setToast("请填写想换什么");
      setTimeout(() => setToast(null), 1500);
      return;
    }
    const payload = {
      type: "swap" as const,
      title: title.trim(),
      description: desc.trim(),
      expectedSwap: expectedSwap.trim(),
      category,
      tags,
      location,
      images,
    };
    console.log("publish-swap", payload);
    createPublishedMockItem(payload);
    setToast("发布成功");
    setTimeout(() => router.push("/"), 700);
  };

  return (
    <div className="min-h-full bg-gray-100">
      <PublishToast message={toast} />
      <PageHeader title="发布置换" backHref="/publish" />

      <div className="space-y-3 px-4 py-4 pb-28">
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
          value={expectedSwap}
          onChange={setExpectedSwap}
          placeholder="例如：想换机械键盘或显示器支架"
        />
        <TagSelector tags={swapTagOptions} selectedTags={tags} onToggle={onToggleTag} />
        <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-stone-800">位置</h2>
          <p className="mt-2 text-sm text-stone-600">{location}</p>
        </section>
      </div>

      <SubmitFooter text="发布置换" onSubmit={onSubmit} />
    </div>
  );
}
