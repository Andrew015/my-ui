import { BottomTab } from "./bottom-tab";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] bg-[#e8ebe8] flex justify-center sm:items-center sm:py-6 sm:px-4">
      <div
        className="relative flex min-h-[100dvh] w-full max-w-[390px] flex-col bg-[#f4f7f4] shadow-none sm:min-h-[min(844px,100dvh)] sm:max-h-[min(844px,100dvh)] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-stone-200/80 sm:shadow-xl"
        data-phone-shell
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
            {children}
          </div>
        </div>
        <BottomTab />
      </div>
    </div>
  );
}
