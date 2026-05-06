import type { ReactNode } from "react";
import { PageHeader } from "@/components/page-header";

type AboutPageShellProps = {
  title: string;
  children: ReactNode;
};

export function AboutPageShell({ title, children }: AboutPageShellProps) {
  return (
    <div className="min-h-full bg-gray-100">
      <PageHeader title={title} backHref="/" />
      <div className="space-y-3 px-4 py-4">
        <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-orange-100/90">
          {children}
        </section>
      </div>
    </div>
  );
}
