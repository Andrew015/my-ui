"use client";

type ImageUploaderProps = {
  images: string[];
  onAddImage: () => void;
  max?: number;
};

export function ImageUploader({ images, onAddImage, max = 6 }: ImageUploaderProps) {
  return (
    <section className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-stone-800">图片</h2>
        <p className="text-xs text-stone-400">
          {images.length}/{max}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2">
        {images.map((image, index) => (
          <div
            key={image}
            className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-orange-50 to-gray-100 ring-1 ring-orange-100/80"
          >
            <span className="absolute inset-0 flex items-center justify-center text-2xl" aria-hidden>
              📷
            </span>
            <span className="absolute bottom-1 left-1 rounded bg-white/85 px-1.5 py-0.5 text-[10px] text-stone-500">
              图{index + 1}
            </span>
          </div>
        ))}

        {images.length < max ? (
          <button
            type="button"
            onClick={onAddImage}
            className="flex aspect-square flex-col items-center justify-center rounded-xl border border-dashed border-orange-200 bg-orange-50/30 text-stone-500 transition active:scale-[0.98] hover:bg-orange-50"
          >
            <span className="text-xl leading-none text-orange-500">+</span>
            <span className="mt-1 text-xs">添加图片</span>
          </button>
        ) : null}
      </div>
    </section>
  );
}
