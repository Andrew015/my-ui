import { BottomTabBar } from "./bottom-tab-bar";

export function MobileShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[100dvh] justify-center bg-surface-frame sm:items-center sm:px-4 sm:py-6">
      <div
        className="relative flex min-h-[100dvh] w-full max-w-[390px] flex-col bg-surface shadow-none sm:max-h-[min(844px,100dvh)] sm:min-h-[min(844px,100dvh)] sm:overflow-hidden sm:rounded-[2rem] sm:border sm:border-orange-200/80 sm:shadow-xl"
        data-phone-shell
      >
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain pb-6">
            {children}
          </div>
        </div>
        <BottomTabBar />
      </div>
    </div>
  );
}
