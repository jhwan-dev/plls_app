import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { getCuratorZonePlaylists, getLikedPlaylistIds } from "@/lib/discover";
import { EditorialPlaylistCard } from "@/components/playlist/editorial-playlist-card";
import type { CuratorType } from "@/generated/prisma/client";

export const metadata: Metadata = {
  // `absolute` skips the root "%s | PLLS" template — "Curator Zone | PLLS" would be redundant.
  title: { absolute: "Curator Zone" },
  description: "아티스트, 플레이스, 큐레이터가 선별한 플레이리스트를 만나보세요.",
};

const SECTIONS: { type: CuratorType; label: string; emptyMessage: string }[] = [
  {
    type: "CURATOR",
    label: "Curator",
    emptyMessage: "아직 소개된 큐레이터 플레이리스트가 없어요.",
  },
  {
    type: "PLACE",
    label: "Place",
    emptyMessage: "아직 소개된 플레이스 플레이리스트가 없어요.",
  },
  {
    type: "ARTIST",
    label: "Artist",
    emptyMessage: "아직 소개된 아티스트 플레이리스트가 없어요.",
  },
];

export default async function CuratorZonePage() {
  const session = await auth();
  const userId = session?.user?.id;

  const groups = await getCuratorZonePlaylists();
  const allIds = SECTIONS.flatMap((section) => groups[section.type].map((playlist) => playlist.id));
  const likedIds = userId ? await getLikedPlaylistIds(userId, allIds) : new Set<string>();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-14 px-4 pt-10 pb-8">
      <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
        아티스트, 플레이스, 큐레이터가
        <br />
        고른 사운드.
      </h1>

      {SECTIONS.map((section) => {
        const playlists = groups[section.type];
        return (
          <div key={section.type} className="flex flex-col gap-4">
            <div className="border-b border-border pb-3">
              <h2 className="font-display text-2xl tracking-tight text-foreground">{section.label}</h2>
            </div>

            {playlists.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">{section.emptyMessage}</p>
            ) : (
              <div className="grid grid-cols-2 gap-x-4 gap-y-8">
                {playlists.map((playlist) => (
                  <EditorialPlaylistCard
                    key={playlist.id}
                    id={playlist.id}
                    title={playlist.title}
                    coverImageUrl={playlist.coverImageUrl}
                    tracks={playlist.tracks}
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
      })}
    </div>
  );
}
