"use client";

type PublishFooterProps = {
  onSubmit: () => void;
  disabled?: boolean;
};

export function PublishFooter({ onSubmit, disabled = false }: PublishFooterProps) {
  return (
    <div className="sticky bottom-0 z-30 border-t border-orange-100/90 bg-white/95 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgba(0,0,0,0.06)] backdrop-blur-md">
      <button
        type="button"
        onClick={onSubmit}
        disabled={disabled}
        className="flex h-12 w-full items-center justify-center rounded-xl bg-brand text-sm font-semibold text-brand-foreground transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
      >
        发布闲置
      </button>
    </div>
  );
}
