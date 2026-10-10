import Link from "next/link";
import { PlaylistCover } from "@/components/playlist/playlist-cover";
import { displayName } from "@/lib/user-display";
import type { FeedPlaylist } from "@/components/discover/discover-feed";

/** Today's PLLS — the one featured pick, presented as a card (big art, a
 * NEW ribbon, stats) rather than a row like every other section. */
export function HeroPlaylistCard({ playlist }: { playlist: FeedPlaylist }) {
  return (
    <Link href={`/playlist/${playlist.id}`} className="block border border-border bg-card p-3">
      <div className="relative aspect-square w-full border border-border">
        <span className="absolute top-0 left-0 z-10 bg-destructive px-1.5 py-0.5 font-pixel text-[9px] text-white">
          NEW
        </span>
        <PlaylistCover
          coverImageUrl={playlist.coverImageUrl}
          seed={playlist.id}
          tracks={playlist.tracks}
          alt={playlist.title}
          className="size-full"
          sizes="260px"
        />
      </div>

      <div className="mt-3 flex flex-col gap-1">
        <h3 className="font-display text-lg leading-tight font-bold text-foreground">{playlist.title}</h3>
        {playlist.owner && <p className="text-sm text-muted-foreground">{displayName(playlist.owner)}</p>}
      </div>

      <div className="font-pixel mt-2 flex gap-3 text-[9px] tracking-wider text-muted-foreground uppercase">
        <span>{playlist.trackCount} tracks</span>
        <span>{playlist.likeCount} likes</span>
      </div>
    </Link>
  );
}
