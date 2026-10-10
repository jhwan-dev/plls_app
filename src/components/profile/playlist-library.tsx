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

interface RepostedPlaylist extends LibraryPlaylist {
  owner: { id: string; name: string | null; nickname: string | null; image: string | null } | null;
}

interface PlaylistLibraryProps {
  playlists: LibraryPlaylist[];
  reposts: RepostedPlaylist[];
  /** Only the profile owner sees the "새 플레이리스트" row. */
  isOwnProfile: boolean;
}

/** Instagram-style split: what this person made, and what they reposted
 * from someone else — two lists, never merged into one, so a repost never
 * reads as this profile's own work. */
export function PlaylistLibrary({ playlists, reposts, isOwnProfile }: PlaylistLibraryProps) {
  return (
    <div className="flex flex-col gap-10">
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

      {(reposts.length > 0 || isOwnProfile) && (
        <section className="flex flex-col">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
            <h2 className="font-display text-base text-foreground">Reposts</h2>
            <span className="font-pixel text-[10px] tracking-wider text-muted-foreground uppercase">
              {reposts.length} total
            </span>
          </div>

          {reposts.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">
              아직 리포스트한 플레이리스트가 없어요.
            </p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {reposts.map((playlist) => (
                <PlaylistListRow
                  key={playlist.id}
                  id={playlist.id}
                  title={playlist.title}
                  coverImageUrl={playlist.coverImageUrl}
                  tracks={playlist.tracks}
                  trackCount={playlist.trackCount}
                  owner={playlist.owner}
                  isRepost
                />
              ))}
            </div>
          )}
        </section>
      )}
    </div>
  );
}
