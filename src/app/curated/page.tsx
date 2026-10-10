import type { Metadata } from "next";
import { getCuratedPlaylists } from "@/lib/discover";
import { PlaylistListRow } from "@/components/playlist/playlist-list-row";

export const metadata: Metadata = {
  // `absolute` skips the root "%s | PLLS" template — "Curator's PLLS | PLLS" would be redundant.
  title: { absolute: "Curator's PLLS" },
  description: "큐레이터가 장르별로 선별한 플레이리스트예요.",
};

export default async function CuratedPage() {
  const playlists = await getCuratedPlaylists();

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 pt-10 pb-8">
      <h1 className="font-display text-4xl leading-[1.15] text-foreground sm:text-5xl">
        큐레이터가 고른
        <br />
        오늘의 사운드.
      </h1>

      {playlists.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted-foreground">
          아직 소개된 플레이리스트가 없어요.
        </p>
      ) : (
        <div className="flex flex-col divide-y divide-border border-t border-border">
          {playlists.map((playlist) => (
            <PlaylistListRow
              key={playlist.id}
              id={playlist.id}
              title={playlist.title}
              coverImageUrl={playlist.coverImageUrl}
              tracks={playlist.tracks}
              trackCount={playlist._count.tracks}
              owner={playlist.user}
            />
          ))}
        </div>
      )}
    </div>
  );
}
