"use client";

import type { PublishTag } from "@/data/mock";

type PublishTagsProps = {
  tags: PublishTag[];
  selectedTags: PublishTag[];
  onToggle: (tag: PublishTag) => void;
};

export function PublishTags({ tags, selectedTags, onToggle }: PublishTagsProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <h2 className="text-sm font-semibold text-stone-800">标签</h2>
      <div className="mt-3 flex flex-wrap gap-2">
        {tags.map((tag) => {
          const active = selectedTags.includes(tag);
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(tag)}
              className={`rounded-full px-3 py-1.5 text-xs transition ${
                active
                  ? "bg-orange-500 text-white shadow-sm"
                  : "border border-stone-200 bg-white text-stone-600 hover:border-orange-200"
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>
    </section>
  );
}
