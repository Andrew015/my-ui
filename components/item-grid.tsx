import type { ReactNode } from "react";

export function ItemGrid({ children }: { children: ReactNode }) {
  return <div className="grid grid-cols-2 gap-x-3 gap-y-4">{children}</div>;
}
