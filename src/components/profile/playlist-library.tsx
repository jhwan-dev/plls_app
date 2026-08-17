import Link from "next/link";
import { Plus } from "lucide-react";
import { EditorialPlaylistCard } from "@/components/playlist/editorial-playlist-card";
import type { TrackSeed } from "@/lib/gradient";

interface LibraryPlaylist {
  id: string;
  title: string;
  coverImageUrl: string | null;
  tracks: TrackSeed[];
  likeCount: number;
  initialLiked: boolean;
}

interface PlaylistLibraryProps {
  playlists: LibraryPlaylist[];
  /** Only the profile owner sees the "새 플레이리스트" shortcut. */
  isOwnProfile: boolean;
  isAuthenticated: boolean;
}

export function PlaylistLibrary({ playlists, isOwnProfile, isAuthenticated }: PlaylistLibraryProps) {
  return (
    <section className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-display text-2xl tracking-tight text-foreground">My Sound</h2>
        {isOwnProfile && (
          <Link
            href="/search"
            aria-label="새 플레이리스트 만들기"
            className="flex size-7 shrink-0 items-center justify-center text-muted-foreground hover:text-foreground"
          >
            <Plus className="size-4" />
          </Link>
        )}
      </div>

      {playlists.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">아직 만든 플레이리스트가 없어요.</p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {playlists.map((playlist) => (
            <EditorialPlaylistCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              coverImageUrl={playlist.coverImageUrl}
              tracks={playlist.tracks}
              initialLiked={playlist.initialLiked}
              likeCount={playlist.likeCount}
              isAuthenticated={isAuthenticated}
            />
          ))}
        </div>
      )}
    </section>
  );
}
