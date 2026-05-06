import { AboutPageShell } from "@/components/about-page-shell";

export default function AboutCommunityPage() {
  return (
    <AboutPageShell title="邻里流转说明">
      <h2 className="text-base font-semibold text-stone-800">平台定位</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        平台面向邻里之间的真实生活需求，优先服务 1-3 公里社区生活圈，让闲置就近流转。
      </p>

      <h3 className="mt-4 text-sm font-semibold text-stone-800">为什么强调附近</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        同社区或邻近小区交易，沟通成本更低、看货更方便、取货更高效，也更容易建立互信。
      </p>

      <h3 className="mt-4 text-sm font-semibold text-stone-800">支持内容类型</h3>
      <ul className="mt-2 space-y-1.5 text-sm text-stone-600">
        <li>出售闲置：让好物继续发挥价值</li>
        <li>短期出租：提升物品使用效率</li>
        <li>以物置换：换到真正需要的物品</li>
        <li>公益互助：邻里之间互相帮扶</li>
      </ul>

      <h3 className="mt-4 text-sm font-semibold text-stone-800">社区信任</h3>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        平台鼓励当面验货、同城面交与真实信息发布，帮助用户在熟悉环境中更安心地完成流转。
      </p>
    </AboutPageShell>
  );
}
