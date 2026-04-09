import Link from "next/link";

type PageHeaderProps = {
  title: string;
  backHref?: string;
};

export function PageHeader({ title, backHref }: PageHeaderProps) {
  return (
    <header className="sticky top-0 z-10 flex items-center gap-3 border-b border-stone-200/80 bg-[#f4f7f4]/95 px-4 py-3 backdrop-blur-md">
      {backHref ? (
        <Link
          href={backHref}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone-600 transition-colors hover:bg-stone-200/60"
          aria-label="返回"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
      ) : (
        <span className="w-9 shrink-0" aria-hidden />
      )}
      <h1 className="flex-1 text-center text-base font-semibold text-stone-800">
        {title}
      </h1>
      <span className="w-9 shrink-0" aria-hidden />
    </header>
  );
}
