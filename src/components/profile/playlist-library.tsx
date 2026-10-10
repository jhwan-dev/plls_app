import Link from "next/link";
import { PlaylistListRow } from "@/components/playlist/playlist-list-row";
import type { TrackSeed } from "@/lib/gradient";

interface LibraryPlaylist {
  id: string;
  title: string;
  coverImageUrl: string | null;
  tracks: TrackSeed[];
  trackCount: number;
}

interface PlaylistLibraryProps {
  playlists: LibraryPlaylist[];
  /** Only the profile owner sees the "새 플레이리스트" row. */
  isOwnProfile: boolean;
}

/** PLLS Redesign's "Playlist List" pattern (turn 7, 7b): a row list with a
 * Silkscreen total-count badge in the header and, for the owner, a
 * "+ New Playlist" row appended to the list instead of a header icon. */
export function PlaylistLibrary({ playlists, isOwnProfile }: PlaylistLibraryProps) {
  return (
    <section className="flex flex-col">
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
        <h2 className="font-display text-base text-foreground">My Sound</h2>
        <span className="font-pixel text-[10px] tracking-wider text-muted-foreground uppercase">
          {playlists.length} total
        </span>
      </div>

      {playlists.length === 0 && !isOwnProfile ? (
        <p className="py-16 text-center text-sm text-muted-foreground">아직 만든 플레이리스트가 없어요.</p>
      ) : (
        <div className="flex flex-col divide-y divide-border">
          {playlists.map((playlist) => (
            <PlaylistListRow
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              coverImageUrl={playlist.coverImageUrl}
              tracks={playlist.tracks}
              trackCount={playlist.trackCount}
            />
          ))}

          {isOwnProfile && (
            <Link
              href="/search"
              className="flex items-center gap-3 py-3 text-muted-foreground transition-colors hover:text-foreground"
            >
              <span className="font-pixel w-11 shrink-0 text-center text-sm">+</span>
              <span className="text-sm">새 플레이리스트</span>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
