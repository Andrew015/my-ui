import Link from "next/link";

type HomeInfoBannerProps = {
  href: string;
  badge: string;
  title: string;
  desc: string;
  className: string;
};

export function HomeInfoBanner({
  href,
  badge,
  title,
  desc,
  className,
}: HomeInfoBannerProps) {
  return (
    <Link
      href={href}
      className={`relative block w-[88%] shrink-0 snap-center overflow-hidden rounded-2xl p-4 shadow-sm ring-1 ring-orange-100/70 ${className}`}
    >
      <span className="inline-flex rounded-full bg-white/70 px-2 py-0.5 text-[11px] font-medium text-emphasis">
        {badge}
      </span>
      <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-stone-800">{title}</h3>
      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-stone-600">{desc}</p>
      <p className="mt-2 text-xs font-medium text-emphasis/80">查看详情 ›</p>
    </Link>
  );
}
