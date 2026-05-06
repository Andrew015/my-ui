import Link from "next/link";

type LocationEntryProps = {
  locationText: string;
};

export function LocationEntry({ locationText }: LocationEntryProps) {
  return (
    <Link
      href="/location"
      className="mt-2 inline-flex max-w-full items-center gap-2 text-sm text-stone-600"
    >
      <span className="text-sm" aria-hidden>
        📍
      </span>
      <p className="truncate">{locationText}</p>
      <span className="text-stone-300">›</span>
    </Link>
  );
}
