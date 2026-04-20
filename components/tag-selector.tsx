"use client";

type TagSelectorProps = {
  label?: string;
  tags: string[];
  selectedTags: string[];
  onToggle: (tag: string) => void;
};

export function TagSelector({
  label = "标签",
  tags,
  selectedTags,
  onToggle,
}: TagSelectorProps) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <h2 className="text-sm font-semibold text-stone-800">{label}</h2>
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
