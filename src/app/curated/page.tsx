import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getCuratedPlaylists, getLikedPlaylistIds } from "@/lib/discover";
import { EditorialPlaylistCard } from "@/components/playlist/editorial-playlist-card";

export const metadata: Metadata = {
  // `absolute` skips the root "%s | PLLS" template — "Curator's PLLS | PLLS" would be redundant.
  title: { absolute: "Curator's PLLS" },
  description: "큐레이터가 장르별로 선별한 플레이리스트예요.",
};

export default async function CuratedPage() {
  const session = await auth();
  const userId = session?.user?.id;

  const playlists = await getCuratedPlaylists();
  const likedIds = userId
    ? await getLikedPlaylistIds(
        userId,
        playlists.map((playlist) => playlist.id),
      )
    : new Set<string>();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-10 pb-8">
      <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
        큐레이터가 고른
        <br />
        오늘의 사운드.
      </h1>

      {playlists.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          아직 소개된 플레이리스트가 없어요.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8">
          {playlists.map((playlist) => (
            <EditorialPlaylistCard
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              coverUrls={playlist.tracks.map((track) => track.coverUrl)}
              owner={playlist.user}
              initialLiked={likedIds.has(playlist.id)}
              likeCount={playlist._count.likes}
              isAuthenticated={!!userId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
