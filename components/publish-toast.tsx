"use client";

type PublishToastProps = {
  message: string | null;
};

export function PublishToast({ message }: PublishToastProps) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed left-1/2 top-20 z-50 -translate-x-1/2">
      <div className="rounded-full bg-stone-900/85 px-4 py-2 text-xs text-white shadow-lg">
        {message}
      </div>
    </div>
  );
}
