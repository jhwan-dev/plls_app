import Image from "next/image";
import { PreviewPlayButton } from "@/components/player/preview-play-button";
import { formatDuration } from "@/lib/format";
import type { DeezerTrack } from "@/types/deezer";

interface TrackRowProps {
  track: DeezerTrack;
  /** Rendered on the trailing edge of the row, e.g. an "add to playlist" button (Phase 2). */
  action?: React.ReactNode;
}

export function TrackRow({ track, action }: TrackRowProps) {
  return (
    <div className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-accent">
      <PreviewPlayButton
        trackId={track.id}
        previewUrl={track.preview}
        title={track.title}
        artist={track.artist.name}
        coverUrl={track.album.cover_medium}
      />

      <div className="relative size-12 shrink-0 overflow-hidden rounded-md bg-muted">
        <Image
          src={track.album.cover_medium}
          alt={track.album.title}
          fill
          sizes="48px"
          className="object-cover"
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm leading-tight font-semibold">{track.title}</p>
        <p className="truncate text-sm text-muted-foreground leading-tight">
          {track.artist.name}
        </p>
      </div>

      <p className="hidden shrink-0 truncate font-mono text-xs text-muted-foreground/70 sm:block sm:max-w-[180px]">
        {track.album.title}
      </p>

      <p className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
        {formatDuration(track.duration)}
      </p>

      {action}
    </div>
  );
}
