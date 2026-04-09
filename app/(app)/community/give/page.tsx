import { PageHeader } from "@/components/page-header";
import { ItemCard } from "@/components/item-card";
import { SectionTitle } from "@/components/section-title";
import { getItemsByChannel } from "@/data/mock";

export default function CommunityGivePage() {
  const list = getItemsByChannel("give");

  return (
    <div>
      <PageHeader title="免费赠送" backHref="/community" subtitle="送出闲置，传递温暖" />
      <div className="px-4 py-4">
        <SectionTitle title="可领取物品" subtitle={`${list.length} 条`} />
        <div className="grid gap-3">
          {list.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}
