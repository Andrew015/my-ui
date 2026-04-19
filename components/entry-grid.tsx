import Link from "next/link";
import type { HomeEntry } from "@/data/mock";

export function EntryGrid({ entries }: { entries: HomeEntry[] }) {
  return (
    <div className="grid gap-3">
      {entries.map((entry) => (
        <Link
          key={entry.href}
          href={entry.href}
          className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90 transition hover:shadow-md active:scale-[0.99]"
        >
          <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${entry.accent} text-white`}>
            <span className="text-lg font-semibold">{entry.title.slice(0, 1)}</span>
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-stone-800">{entry.title}</h3>
            <p className="mt-0.5 text-sm text-stone-500">{entry.desc}</p>
          </div>
          <span className="text-stone-300" aria-hidden>
            ›
          </span>
        </Link>
      ))}
    </div>
  );
}
