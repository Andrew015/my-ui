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
import {
  getPublishedItemById,
  mapPublishedItemToFormState,
  publishCategories,
  type MyPublishedItem,
  updatePublishedItem,
} from "@/data/mock";

const communityTabs = [
  { key: "give", label: "免费赠送" },
  { key: "help", label: "互助服务" },
] as const;

export default function EditCommunityPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = String(params?.id ?? "");

  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState<MyPublishedItem | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [tab, setTab] = useState<(typeof communityTabs)[number]["key"]>("give");

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<(typeof publishCategories)[number]>("家居");
  const [pickupMethod, setPickupMethod] = useState<"自取" | "联系">("自取");
  const [images, setImages] = useState<string[]>([]);
  const [location, setLocation] = useState("");

  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [contactNote, setContactNote] = useState("");

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      const current = getPublishedItemById(id);
      if (!current || current.type !== "community") {
        setItem(null);
        setLoading(false);
        return;
      }
      const mapped = mapPublishedItemToFormState(current);
      setItem(current);
      const mode = mapped.communityMode as "give" | "help";
      setTab(mode);

      if (mode === "give") {
        setTitle(mapped.title);
        setDesc(mapped.description);
        setCategory(mapped.category as (typeof publishCategories)[number]);
        setPickupMethod((mapped.tags[0] as "自取" | "联系") || "自取");
        setImages(mapped.images);
        setLocation(mapped.location);
      } else {
        setServiceTitle(mapped.title);
        setServiceDesc(mapped.description);
        setServiceTime(mapped.serviceTime);
        setServiceArea(mapped.serviceArea);
        setContactNote(mapped.contactNote);
      }
      setLoading(false);
    }, 140);
    return () => clearTimeout(timer);
  }, [id]);

  const onAddImage = () => {
    setImages((prev) => (prev.length >= 6 ? prev : [...prev, `edit-community-${Date.now()}-${prev.length}`]));
  };

  const onSubmit = () => {
    if (tab === "give") {
      if (!title.trim()) {
        setToast("请先填写标题");
        setTimeout(() => setToast(null), 1500);
        return;
      }

      const patch: Partial<MyPublishedItem> = {
        title: title.trim(),
        description: desc.trim(),
        category,
        communityMode: "give",
        tags: [pickupMethod],
        images,
        location,
      };
      const updated = updatePublishedItem(id, patch);
      console.log("update-community-give", updated);
    } else {
      if (!serviceTitle.trim()) {
        setToast("请先填写服务标题");
        setTimeout(() => setToast(null), 1500);
        return;
      }

      const patch: Partial<MyPublishedItem> = {
        title: serviceTitle.trim(),
        description: serviceDesc.trim(),
        communityMode: "help",
        tags: ["互助服务"],
        serviceTime: serviceTime.trim(),
        serviceArea: serviceArea.trim(),
        contactNote: contactNote.trim(),
        location: serviceArea.trim() || "同小区优先",
        images: [],
      };
      const updated = updatePublishedItem(id, patch);
      console.log("update-community-help", updated);
    }

    setToast("保存成功");
    setTimeout(() => router.push("/me/published"), 700);
  };

  if (loading) {
    return (
      <div className="min-h-full bg-gray-100">
        <PageHeader title="编辑公益" backHref="/me/published" />
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
        <PageHeader title="编辑公益" backHref="/me/published" />
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
      <PageHeader title="编辑公益" backHref="/me/published" />

      <div className="space-y-3 px-4 py-4 pb-28">
        <section className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-orange-100/90">
          <div className="grid grid-cols-2 gap-2">
            {communityTabs.map((itemTab) => {
              const active = itemTab.key === tab;
              return (
                <button
                  key={itemTab.key}
                  type="button"
                  onClick={() => setTab(itemTab.key)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-brand text-brand-foreground" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {itemTab.label}
                </button>
              );
            })}
          </div>
        </section>

        {tab === "give" ? (
          <>
            <ImageUploader images={images} onAddImage={onAddImage} />
            <FormInput
              label="标题"
              value={title}
              onChange={setTitle}
              placeholder="给你的赠送物品起个标题"
              maxLength={30}
            />
            <FormTextarea
              label="描述"
              value={desc}
              onChange={setDesc}
              placeholder="描述一下物品状态、领取方式…"
            />
            <CategorySelector
              categories={publishCategories}
              selectedCategory={category}
              onSelect={(value) => setCategory(value as (typeof publishCategories)[number])}
            />
            <CategorySelector
              label="领取方式"
              categories={["自取", "联系"]}
              selectedCategory={pickupMethod}
              onSelect={(value) => setPickupMethod(value as "自取" | "联系")}
            />
            <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
              <h2 className="text-sm font-semibold text-stone-800">位置</h2>
              <p className="mt-2 text-sm text-stone-600">{location}</p>
            </section>
          </>
        ) : (
          <>
            <FormInput
              label="服务标题"
              value={serviceTitle}
              onChange={setServiceTitle}
              placeholder="例如：周末家电小修互助"
              maxLength={30}
            />
            <FormTextarea
              label="服务说明"
              value={serviceDesc}
              onChange={setServiceDesc}
              placeholder="介绍可提供的帮助内容与限制条件"
            />
            <FormInput
              label="可服务时间"
              value={serviceTime}
              onChange={setServiceTime}
              placeholder="例如：工作日 19:00 后 / 周末全天"
            />
            <FormInput
              label="区域"
              value={serviceArea}
              onChange={setServiceArea}
              placeholder="例如：锦绣里及周边 2km"
            />
            <FormTextarea
              label="联系方式说明"
              value={contactNote}
              onChange={setContactNote}
              rows={4}
              placeholder="例如：请先站内消息联系，再约时间"
            />
          </>
        )}
      </div>

      <SubmitFooter text="保存修改" onSubmit={onSubmit} />
    </div>
  );
}
