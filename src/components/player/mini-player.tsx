"use client";

import Image from "next/image";
import { Pause, Play, X } from "lucide-react";
import { usePlayerStore } from "@/store/player-store";
import { Button } from "@/components/ui/button";

/**
 * Fixed now-playing bar. Sits above the mobile bottom tab bar (see the
 * `bottom` offset — it must match BottomNav's total rendered height,
 * safe-area included) and flush to the bottom on desktop, where there's no
 * tab bar to clear.
 */
export function MiniPlayer() {
  const currentTrackId = usePlayerStore((state) => state.currentTrackId);
  const previewUrl = usePlayerStore((state) => state.previewUrl);
  const title = usePlayerStore((state) => state.title);
  const artist = usePlayerStore((state) => state.artist);
  const coverUrl = usePlayerStore((state) => state.coverUrl);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const pause = usePlayerStore((state) => state.pause);
  const resume = usePlayerStore((state) => state.resume);
  const reset = usePlayerStore((state) => state.reset);

  if (!currentTrackId || !previewUrl) {
    return null;
  }

  return (
    <div
      className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-[45] border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80 md:bottom-0"
    >
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center gap-3 px-4">
        <div className="relative size-10 shrink-0 overflow-hidden rounded-md bg-muted">
          {coverUrl && (
            <Image src={coverUrl} alt={title ?? ""} fill sizes="40px" className="object-cover" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm leading-tight font-semibold">{title}</p>
          <p className="truncate text-xs text-muted-foreground leading-tight">{artist}</p>
        </div>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-9 shrink-0 rounded-full"
          aria-label={isPlaying ? "일시정지" : "재생"}
          onClick={() => (isPlaying ? pause() : resume())}
        >
          {isPlaying ? (
            <Pause className="size-4" fill="currentColor" />
          ) : (
            <Play className="size-4 translate-x-0.5" fill="currentColor" />
          )}
        </Button>

        <Button
          type="button"
          size="icon"
          variant="ghost"
          className="size-9 shrink-0 rounded-full"
          aria-label="재생 중지"
          onClick={reset}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
