import { formatDuration } from "@/lib/format";

interface PlaylistTrackRowProps {
  title: string;
  artist: string;
  album: string;
  duration: number;
}

export function PlaylistTrackRow({ title, artist, album, duration }: PlaylistTrackRowProps) {
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
    </div>
  );
}
