import { AboutPageShell } from "@/components/about-page-shell";

export default function AboutPublishRulesPage() {
  const rules = [
    "不允许发布食品及其它危险物品。",
    "不允许发布三无产品和过期产品。",
    "发布内容需要进行违规词排查。",
    "个人信息、证件上传仅用于诚信保证，不作为公开展示内容。",
    "特殊产品需要明确标记和补充说明。",
    "当前仅支持发布 1000 元以内的商品和服务。",
  ];

  return (
    <AboutPageShell title="发布规范说明">
      <h2 className="text-base font-semibold text-stone-800">发布前须知</h2>
      <p className="mt-2 text-sm leading-relaxed text-stone-600">
        为保障社区交易安全与体验，请在发布内容前仔细阅读以下规范，确保信息真实、完整、合规。
      </p>

      <ol className="mt-4 space-y-2 text-sm leading-relaxed text-stone-600">
        {rules.map((rule, index) => (
          <li key={rule}>
            <span className="font-medium text-stone-700">{index + 1}.</span> {rule}
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-xl bg-orange-50 px-3 py-2 text-xs leading-relaxed text-orange-700">
        温馨提示：如发布信息存在违规或风险，平台将进行下架处理，并可能限制后续发布权限。
      </p>
    </AboutPageShell>
  );
}
