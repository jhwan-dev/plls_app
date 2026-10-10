import Link from "next/link";
import { PlaylistCover } from "@/components/playlist/playlist-cover";
import { displayName } from "@/lib/user-display";
import type { TrackSeed } from "@/lib/gradient";

interface PlaylistListRowOwner {
  id: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
}

interface PlaylistListRowProps {
  id: string;
  title: string;
  coverImageUrl: string | null;
  tracks: TrackSeed[];
  trackCount: number;
  /** Shown under the title (e.g. Browse's "From Friends") — omitted on a
   * profile's own library, where every row is already the same owner. */
  owner?: PlaylistListRowOwner | null;
}

/** PLLS Redesign's row pattern (turns 6-7, 7a/7b): a full-row link, square
 * thumbnail, title + owner stacked, a Silkscreen track-count badge, and a
 * trailing arrow — replaces the editorial card grid on Browse and the
 * profile library. */
export function PlaylistListRow({ id, title, coverImageUrl, tracks, trackCount, owner }: PlaylistListRowProps) {
  return (
    <Link
      href={`/playlist/${id}`}
      className="flex h-14 shrink-0 items-center gap-3 transition-colors hover:bg-accent/50"
    >
      <PlaylistCover
        coverImageUrl={coverImageUrl}
        tracks={tracks}
        alt={title}
        className="size-11 shrink-0 rounded-[2px]"
        sizes="44px"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="truncate text-sm leading-tight font-medium text-foreground">{title}</span>
        {owner && (
          <span className="truncate text-xs leading-tight text-muted-foreground">{displayName(owner)}</span>
        )}
      </div>

      <span className="font-pixel shrink-0 text-[10px] tracking-wider text-muted-foreground uppercase">
        {trackCount} tracks
      </span>
      <span className="font-pixel w-2.5 shrink-0 text-xs text-muted-foreground">&gt;</span>
    </Link>
  );
}
