"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

export function HomeSearchBar() {
  const router = useRouter();
  const [value, setValue] = useState("");

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    const q = value.trim();
    router.push(q ? `/idle?q=${encodeURIComponent(q)}` : "/idle");
  };

  return (
    <form onSubmit={onSubmit} className="mt-4">
      <div className="flex items-center gap-2 rounded-2xl bg-white px-3 py-2.5 shadow-sm ring-1 ring-orange-100/90">
        <svg
          className="h-5 w-5 shrink-0 text-stone-400"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.2-3.2" />
        </svg>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="搜闲置、品类、小区名"
          className="min-w-0 flex-1 bg-transparent text-sm text-stone-800 placeholder:text-stone-400 outline-none"
          aria-label="搜索"
        />
        <button
          type="submit"
          className="shrink-0 rounded-xl bg-brand px-3 py-1.5 text-xs font-semibold text-brand-foreground transition hover:bg-brand-hover"
        >
          搜索
        </button>
      </div>
    </form>
  );
}
