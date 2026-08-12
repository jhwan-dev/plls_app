import Image from "next/image";
import { PreviewPlayButton } from "@/components/player/preview-play-button";
import { formatDuration } from "@/lib/format";

interface PlaylistTrackRowProps {
  /** Deezer track id — fits safely in a JS number, so we convert out of BigInt at the DB boundary. */
  deezerTrackId: number;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  previewUrl: string;
  duration: number;
}

export function PlaylistTrackRow({
  deezerTrackId,
  title,
  artist,
  album,
  coverUrl,
  previewUrl,
  duration,
}: PlaylistTrackRowProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="relative size-11 shrink-0 overflow-hidden rounded-[3px] bg-muted">
        <Image src={coverUrl} alt={album} fill sizes="44px" className="object-cover" />
      </div>

      <PreviewPlayButton
        trackId={deezerTrackId}
        previewUrl={previewUrl}
        title={title}
        artist={artist}
        coverUrl={coverUrl}
        className="size-8"
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm leading-tight font-semibold">{title}</p>
        <p className="truncate text-sm leading-tight text-muted-foreground">{artist}</p>
      </div>

      <p className="hidden shrink-0 truncate font-mono text-xs text-muted-foreground/70 sm:block sm:max-w-[180px]">
        {album}
      </p>

      <p className="w-10 shrink-0 text-right font-mono text-xs text-muted-foreground tabular-nums">
        {formatDuration(duration)}
      </p>
    </div>
  );
}
