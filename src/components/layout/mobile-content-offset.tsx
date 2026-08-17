import type { ReactNode } from "react";

/**
 * Reserves space at the bottom of the page on mobile so content doesn't end
 * up underneath the fixed bottom tab bar.
 */
export function MobileContentOffset({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-1 flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
      {children}
    </div>
  );
}
