import { GradientTrackArt } from "@/components/track/gradient-track-art";
import { formatDuration } from "@/lib/format";
import type { Track } from "@/types/track";

interface TrackRowProps {
  track: Track;
  /** Rendered on the trailing edge of the row, e.g. an "add to playlist" button. */
  action?: React.ReactNode;
}

export function TrackRow({ track, action }: TrackRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent">
      <GradientTrackArt title={track.title} artist={track.artist} className="size-12 rounded-md" />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm leading-tight font-semibold">{track.title}</p>
        <p className="truncate text-sm text-muted-foreground leading-tight">{track.artist}</p>
      </div>

      <p className="hidden shrink-0 truncate font-mono text-xs text-muted-foreground/70 sm:block sm:max-w-[180px]">
        {track.album}
      </p>

      <p className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
        {formatDuration(track.duration)}
      </p>

      {action}
    </div>
  );
}
