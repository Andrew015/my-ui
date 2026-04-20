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
  rentTagOptions,
  rentTermOptions,
  type MyPublishedItem,
  updatePublishedItem,
} from "@/data/mock";

function sanitizeMoney(value: string) {
  return value.replace(/[^\d.]/g, "");
}

export default function EditRentPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<MyPublishedItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<(typeof publishCategories)[number]>("数码");
  const [rentPrice, setRentPrice] = useState("");
  const [deposit, setDeposit] = useState("");
  const [rentTerm, setRentTerm] = useState<(typeof rentTermOptions)[number]>("按天");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState("");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const current = getPublishedItemById(id);
      if (!current || current.type !== "rent") {
        setItem(null);
        setLoading(false);
        return;
      }
      const mapped = mapPublishedItemToFormState(current);
      setItem(current);
      setTitle(mapped.title);
      setDesc(mapped.description);
      setCategory(mapped.category as (typeof publishCategories)[number]);
      setRentPrice(mapped.rentPrice);
      setDeposit(mapped.deposit);
      setRentTerm(mapped.rentTerm as (typeof rentTermOptions)[number]);
      setTags(mapped.tags);
      setImages(mapped.images);
      setLocation(mapped.location);
      setLoading(false);
    }, 140);
    return () => clearTimeout(timer);
  }, [id]);

  const onAddImage = () => {
    setImages((prev) => (prev.length >= 6 ? prev : [...prev, `edit-rent-${Date.now()}-${prev.length}`]));
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
    if (!rentPrice.trim()) {
      setToast("请先填写租金");
      setTimeout(() => setToast(null), 1500);
      return;
    }

    const patch: Partial<MyPublishedItem> = {
      title: title.trim(),
      description: desc.trim(),
      category,
      rentPrice: Number(rentPrice),
      deposit: deposit ? Number(deposit) : 0,
      rentTerm,
      tags,
      images,
      location,
    };
    const updated = updatePublishedItem(id, patch);
    console.log("update-rent", updated);
    setToast("保存成功");
    setTimeout(() => router.push("/me/published"), 700);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-100">
        <PageHeader title="编辑出租" backHref="/me/published" />
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
        <PageHeader title="编辑出租" backHref="/me/published" />
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
      <PageHeader title="编辑出租" backHref="/me/published" />

      <div className="space-y-3 px-4 py-4 pb-28">
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
          value={rentPrice}
          onChange={(value) => setRentPrice(sanitizeMoney(value))}
          placeholder="请输入租金"
        />
        <PriceInput
          label="押金"
          value={deposit}
          onChange={(value) => setDeposit(sanitizeMoney(value))}
          placeholder="请输入押金"
        />
        <CategorySelector
          label="租期"
          categories={rentTermOptions}
          selectedCategory={rentTerm}
          onSelect={(value) => setRentTerm(value as (typeof rentTermOptions)[number])}
        />
        <TagSelector tags={rentTagOptions} selectedTags={tags} onToggle={onToggleTag} />
        <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          <h2 className="text-sm font-semibold text-stone-800">位置</h2>
          <p className="mt-2 text-sm text-stone-600">{location}</p>
        </section>
      </div>

      <SubmitFooter text="保存修改" onSubmit={onSubmit} />
    </div>
  );
}
