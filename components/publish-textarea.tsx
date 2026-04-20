"use client";

type PublishTextareaProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
};

export function PublishTextarea({
  label,
  value,
  onChange,
  placeholder,
}: PublishTextareaProps) {
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <label className="text-sm font-semibold text-stone-800">{label}</label>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        rows={5}
        placeholder={placeholder}
        className="mt-3 w-full resize-none rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm leading-6 text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
      />
    </section>
  );
}
