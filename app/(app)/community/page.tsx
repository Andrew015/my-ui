import Link from "next/link";
import { PageHeader } from "@/components/page-header";

export default function CommunityPage() {
  return (
    <div>
      <PageHeader title="邻里公益" backHref="/" />
      <div className="px-4 py-6 space-y-4">
        <p className="text-sm text-stone-600">
          免费赠送与互助服务，让邻里更温暖。
        </p>
        <Link
          href="/community/give"
          className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/80 transition hover:shadow-md"
        >
          <h2 className="text-base font-semibold text-rose-800">免费赠送</h2>
          <p className="mt-1 text-sm text-stone-500">送出闲置，送给需要的人</p>
        </Link>
        <Link
          href="/community/help"
          className="block rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/80 transition hover:shadow-md"
        >
          <h2 className="text-base font-semibold text-pink-800">互助服务</h2>
          <p className="mt-1 text-sm text-stone-500">技能与时间互助，邻里搭把手</p>
        </Link>
      </div>
    </div>
  );
}
