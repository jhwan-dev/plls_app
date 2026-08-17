"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GradientTrackArt } from "@/components/track/gradient-track-art";
import { formatDuration } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { DraftTrack } from "@/types/playlist";

interface SortableDraftTrackRowProps {
  track: DraftTrack;
  onRemove: (id: string) => void;
  disabled: boolean;
}

export function SortableDraftTrackRow({ track, onRemove, disabled }: SortableDraftTrackRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: track.id,
    disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-lg bg-card p-2",
        isDragging && "z-10 opacity-80 shadow-lg",
      )}
    >
      <button
        type="button"
        aria-label="드래그하여 순서 변경"
        disabled={disabled}
        className={cn(
          "shrink-0 touch-none rounded p-1 text-muted-foreground hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40",
        )}
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
      </button>

      <GradientTrackArt title={track.title} artist={track.artist} className="size-10 shrink-0 rounded-md" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm leading-tight font-semibold">{track.title}</p>
        <p className="truncate text-xs text-muted-foreground leading-tight">{track.artist}</p>
      </div>

      <p className="shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
        {formatDuration(track.duration)}
      </p>

      <Button
        type="button"
        size="icon"
        variant="ghost"
        className="size-8 shrink-0 text-muted-foreground hover:text-destructive"
        aria-label="트랙 삭제"
        disabled={disabled}
        onClick={() => onRemove(track.id)}
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
