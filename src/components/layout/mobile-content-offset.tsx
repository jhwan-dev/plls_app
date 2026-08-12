"use client";

import type { ReactNode } from "react";
import { usePlayerStore } from "@/store/player-store";
import { cn } from "@/lib/utils";

/**
 * Reserves space at the bottom of the page on mobile so content doesn't end
 * up underneath the fixed bottom tab bar — and, when a preview is playing,
 * underneath the mini player stacked on top of it too.
 */
export function MobileContentOffset({ children }: { children: ReactNode }) {
  const isPlayerActive = usePlayerStore((state) => state.currentTrackId !== null);

  return (
    <div
      className={cn(
        "flex flex-1 flex-col",
        isPlayerActive
          ? "pb-[calc(8rem+env(safe-area-inset-bottom))] md:pb-0"
          : "pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0",
      )}
    >
      {children}
    </div>
  );
}
