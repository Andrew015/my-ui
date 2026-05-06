import { HomeInfoBanner } from "@/components/home-info-banner";

const banners = [
  {
    href: "/about/community",
    badge: "平台特点",
    title: "邻里 1-3 公里，闲置就近流转",
    desc: "让附近的好物、短租、置换与互助，在熟悉的小区生活圈里被看见。",
    className: "bg-gradient-to-br from-orange-100 to-amber-50",
  },
  {
    href: "/about/publish-rules",
    badge: "发布规范",
    title: "发布前请先了解内容规范",
    desc: "当前仅支持发布 1000 元以内的商品与服务，请确保内容真实、安全、合规。",
    className: "bg-gradient-to-br from-orange-50 to-stone-100",
  },
];

export function HomeBannerCarousel() {
  return (
    <section className="mt-4" aria-label="平台介绍与发布规范">
      <div className="flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {banners.map((banner) => (
          <HomeInfoBanner key={banner.href} {...banner} />
        ))}
      </div>
    </section>
  );
}
