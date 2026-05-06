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
import { SupportModeSelector } from "@/components/support-mode-selector";
import {
  modulesToFormState,
  publishedAdditionalTradePayload,
  type TradeModule,
  validateAdditionalTradeForm,
} from "@/data/additional-trade";
import { createPublishedMockItem, publishCategories } from "@/data/mock";

const communityTabs = [
  { key: "give", label: "免费赠送" },
  { key: "help", label: "互助服务" },
] as const;

export default function PublishCommunityPage() {
  const router = useRouter();
  const [tab, setTab] = useState<(typeof communityTabs)[number]["key"]>("give");
  const [toast, setToast] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState<(typeof publishCategories)[number]>("家居");
  const [pickupMethod, setPickupMethod] = useState<"自取" | "联系">("自取");
  const [images, setImages] = useState<string[]>([]);
  const [tradeModules, setTradeModules] = useState<TradeModule[]>([]);
  const [location] = useState("锦绣里 · 距离 3.8km");

  const [serviceTitle, setServiceTitle] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceTime, setServiceTime] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [contactNote, setContactNote] = useState("");

  const onAddImage = () => {
    setImages((prev) => (prev.length >= 6 ? prev : [...prev, `community-${Date.now()}-${prev.length}`]));
  };

  const onSubmit = () => {
    const tradeCheck = validateAdditionalTradeForm(modulesToFormState(tradeModules));
    if (!tradeCheck.ok) {
      setToast(tradeCheck.message);
      setTimeout(() => setToast(null), 1800);
      return;
    }

    const tradePayload = publishedAdditionalTradePayload(modulesToFormState(tradeModules));

    if (tab === "give") {
      if (!title.trim()) {
        setToast("请先填写标题");
        setTimeout(() => setToast(null), 1500);
        return;
      }
      const payload = {
        type: "community-give" as const,
        title: title.trim(),
        description: desc.trim(),
        category,
        tags: [pickupMethod],
        pickupMethod,
        ...tradePayload,
        location,
        images,
      };
      console.log("publish-community-give", payload);
      createPublishedMockItem(payload);
    } else {
      if (!serviceTitle.trim()) {
        setToast("请先填写服务标题");
        setTimeout(() => setToast(null), 1500);
        return;
      }
      const payload = {
        type: "community-help" as const,
        title: serviceTitle.trim(),
        description: serviceDesc.trim(),
        category: "运动" as const,
        tags: ["互助服务"],
        ...tradePayload,
        serviceTime: serviceTime.trim(),
        serviceArea: serviceArea.trim(),
        contactNote: contactNote.trim(),
        location: serviceArea.trim() || "同小区优先",
        images: [],
      };
      console.log("publish-community-help", payload);
      createPublishedMockItem(payload);
    }

    setToast("发布成功");
    setTimeout(() => router.push("/"), 700);
  };

  return (
    <div className="min-h-full bg-gray-100">
      <PublishToast message={toast} />
      <PageHeader title="发布公益" backHref="/publish" />

      <div className="space-y-3 px-4 py-4 pb-28">
        <section className="rounded-xl bg-white p-2 shadow-sm ring-1 ring-orange-100/90">
          <div className="grid grid-cols-2 gap-2">
            {communityTabs.map((item) => {
              const active = item.key === tab;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setTab(item.key)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    active ? "bg-brand text-brand-foreground" : "bg-stone-100 text-stone-600"
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </section>

        {tab === "give" ? (
          <>
            <section className="space-y-3" aria-label="基础信息">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400">基础信息</h2>
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
            </section>

            <SupportModeSelector
              primaryMode="community"
              modules={tradeModules}
              onChange={setTradeModules}
            />

            <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
              <h2 className="text-sm font-semibold text-stone-800">位置</h2>
              <p className="mt-2 text-sm text-stone-600">{location}</p>
            </section>
          </>
        ) : (
          <>
            <section className="space-y-3" aria-label="基础信息">
              <h2 className="text-xs font-semibold uppercase tracking-wide text-stone-400">基础信息</h2>
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
            </section>

            <SupportModeSelector
              primaryMode="community"
              modules={tradeModules}
              onChange={setTradeModules}
            />
          </>
        )}
      </div>

      <SubmitFooter text={tab === "give" ? "发布赠送" : "发布服务"} onSubmit={onSubmit} />
    </div>
  );
}
