type SectionTitleProps = {
  title: string;
  subtitle?: string;
};

export function SectionTitle({ title, subtitle }: SectionTitleProps) {
  return (
    <div className="mb-3 flex items-end justify-between gap-2">
      <h2 className="text-base font-semibold text-emphasis">{title}</h2>
      {subtitle ? <p className="text-xs text-stone-400">{subtitle}</p> : null}
    </div>
  );
}
