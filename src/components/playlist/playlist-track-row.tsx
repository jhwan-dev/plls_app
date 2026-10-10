import { SquarePlay } from "lucide-react";
import { formatDuration } from "@/lib/format";

interface PlaylistTrackRowProps {
  title: string;
  artist: string;
  album: string;
  duration: number;
  /** The track's own matched YouTube video — never a search-results link. No button renders without one. */
  youtubeUrl: string | null;
}

export function PlaylistTrackRow({ title, artist, album, duration, youtubeUrl }: PlaylistTrackRowProps) {
  return (
    <div className="flex h-11 shrink-0 items-center gap-3">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm leading-tight font-semibold">{title}</p>
        <p className="truncate text-sm leading-tight text-muted-foreground">{artist}</p>
      </div>

      <p className="hidden shrink-0 truncate font-mono text-xs text-muted-foreground/70 sm:block sm:max-w-[180px]">
        {album}
      </p>

      <p className="w-10 shrink-0 text-right font-pixel text-xs text-muted-foreground tabular-nums">
        {formatDuration(duration)}
      </p>

      {/* Plain link to YouTube — never an embed, see the playback policy in
          src/lib/track-link.ts. Absent (not a disabled state) when no video
          was matched, since there's nothing to link to but a search page. */}
      {youtubeUrl && (
        <a
          href={youtubeUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="YouTube에서 재생"
          className="shrink-0 rounded-full p-1.5 text-muted-foreground transition-colors hover:text-foreground"
        >
          <SquarePlay className="size-5" />
        </a>
      )}
    </div>
  );
}
