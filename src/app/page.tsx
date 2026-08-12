import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import {
  getCuratedPlaylists,
  getFollowingPlaylists,
  getHottestPlaylists,
  getLikedPlaylistIds,
  getWeeklyHypePlaylists,
} from "@/lib/discover";
import { DiscoverFeed, type FeedPlaylist, type FeedSection } from "@/components/discover/discover-feed";

export const metadata: Metadata = {
  title: "둘러보기",
  description: "다른 사람들이 만든 플레이리스트를 최신순, 좋아요순으로 구경해 보세요.",
};

const SECTION_PREVIEW_LIMIT = 10;

interface RawPlaylist {
  id: string;
  title: string;
  tracks: { coverUrl: string }[];
  _count: { tracks: number; likes: number };
  user: { id: string; name: string | null; nickname: string | null; image: string | null } | null;
}

export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  const [following, weeklyHype, hottest, curated] = await Promise.all([
    userId ? getFollowingPlaylists(userId) : Promise.resolve([]),
    getWeeklyHypePlaylists(),
    getHottestPlaylists(),
    getCuratedPlaylists(),
  ]);

  const allIds = [
    ...following.map((p) => p.id),
    ...weeklyHype.map((p) => p.id),
    ...hottest.map((p) => p.id),
    ...curated.map((p) => p.id),
  ];
  const likedIds = userId ? await getLikedPlaylistIds(userId, allIds) : new Set<string>();

  const toFeedPlaylist = (playlist: RawPlaylist): FeedPlaylist => ({
    id: playlist.id,
    title: playlist.title,
    coverUrls: playlist.tracks.map((track) => track.coverUrl),
    likeCount: playlist._count.likes,
    initialLiked: likedIds.has(playlist.id),
    owner: playlist.user,
  });

  const featuredPick = hottest[0] ?? weeklyHype[0] ?? curated[0] ?? following[0] ?? null;

  const sections: FeedSection[] = [
    {
      key: "today",
      label: "Today's PLLS",
      description: "오늘의 PLLS 추천",
      emptyMessage: "아직 추천할 플레이리스트가 없어요.",
      items: featuredPick ? [toFeedPlaylist(featuredPick)] : [],
      accent: true,
    },
    {
      key: "hottest",
      label: "Hottest",
      description: "역대 가장 많은 좋아요",
      emptyMessage: "아직 좋아요를 받은 플레이리스트가 없어요.",
      items: hottest.slice(0, SECTION_PREVIEW_LIMIT).map(toFeedPlaylist),
    },
    {
      key: "weekly",
      label: "Weekly Hype",
      description: "최근 7일간 가장 많은 좋아요",
      emptyMessage: "이번 주에는 아직 좋아요를 받은 플레이리스트가 없어요.",
      items: weeklyHype.slice(0, SECTION_PREVIEW_LIMIT).map(toFeedPlaylist),
    },
    {
      key: "curator",
      label: "Curator PLLS",
      description: "큐레이터가 만든 플레이리스트",
      emptyMessage: "아직 큐레이터가 만든 플레이리스트가 없어요.",
      items: curated.slice(0, SECTION_PREVIEW_LIMIT).map(toFeedPlaylist),
    },
    ...(userId
      ? [
          {
            key: "following",
            label: "Following",
            description: "내가 팔로우하는 사람들",
            emptyMessage: "팔로우하는 사람이 아직 플레이리스트를 올리지 않았어요.",
            items: following.slice(0, SECTION_PREVIEW_LIMIT).map(toFeedPlaylist),
          },
        ]
      : []),
  ];

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-14 px-4 pt-10 pb-8">
      <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
        오늘의 취향을
        <br />
        골라보세요.
      </h1>

      <DiscoverFeed sections={sections} isAuthenticated={!!userId} />
    </div>
  );
}
