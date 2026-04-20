"use client";

type FormInputProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  maxLength?: number;
  type?: "text" | "number";
};

export function FormInput({
  label,
  value,
  onChange,
  placeholder,
  maxLength,
  type = "text",
}: FormInputProps) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-stone-800">{label}</label>
        {maxLength ? (
          <span className="text-xs text-stone-400">
            {value.length}/{maxLength}
          </span>
        ) : null}
      </div>
      <input
        value={value}
        type={type}
        onChange={(event) => onChange(event.target.value)}
        maxLength={maxLength}
        placeholder={placeholder}
        className="mt-3 w-full rounded-xl border border-stone-200 bg-white px-3 py-3 text-sm text-stone-700 outline-none transition placeholder:text-stone-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
      />
    </section>
  );
}
