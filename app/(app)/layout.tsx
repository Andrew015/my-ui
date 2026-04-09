import { MobileShell } from "@/components/mobile-shell";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MobileShell>{children}</MobileShell>;
}
