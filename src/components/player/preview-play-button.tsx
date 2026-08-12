"use client";

import { Pause, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePlayerStore } from "@/store/player-store";
import { cn } from "@/lib/utils";

interface PreviewPlayButtonProps {
  trackId: number;
  previewUrl: string;
  title: string;
  artist: string;
  coverUrl: string;
  className?: string;
}

export function PreviewPlayButton({
  trackId,
  previewUrl,
  title,
  artist,
  coverUrl,
  className,
}: PreviewPlayButtonProps) {
  const isActiveTrack = usePlayerStore((state) => state.currentTrackId === trackId);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const toggle = usePlayerStore((state) => state.toggle);

  const isThisPlaying = isActiveTrack && isPlaying;

  if (!previewUrl) {
    return null;
  }

  return (
    <Button
      type="button"
      size="icon"
      variant={isThisPlaying ? "default" : "outline"}
      className={cn("size-9 shrink-0 rounded-full", className)}
      aria-label={isThisPlaying ? "Pause preview" : "Play 30s preview"}
      onClick={() => toggle({ trackId, previewUrl, title, artist, coverUrl })}
    >
      {isThisPlaying ? (
        <Pause className="size-4" fill="currentColor" />
      ) : (
        <Play className="size-4 translate-x-px" fill="currentColor" />
      )}
    </Button>
  );
}
