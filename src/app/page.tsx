import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import {
  getCuratedPlaylists,
  getFollowingPlaylists,
  getHottestPlaylists,
  getLikedPlaylistIds,
  getRecentPlaylists,
  getWeeklyHypePlaylists,
} from "@/lib/discover";
import { DiscoverFeed, type FeedPlaylist, type FeedSection } from "@/components/discover/discover-feed";
import { DrawCoverTeaser } from "@/components/discover/draw-cover-teaser";
import { Logo } from "@/components/brand/logo";

export const metadata: Metadata = {
  title: "둘러보기",
  description: "다른 사람들이 만든 플레이리스트를 최신순, 좋아요순으로 구경해 보세요.",
};

const SECTION_PREVIEW_LIMIT = 10;

interface RawPlaylist {
  id: string;
  title: string;
  coverImageUrl: string | null;
  tracks: { title: string; artist: string }[];
  _count: { tracks: number; likes: number };
  user: { id: string; name: string | null; nickname: string | null; image: string | null } | null;
}


export default async function Home() {
  const session = await auth();
  const userId = session?.user?.id;

  const [following, weeklyHype, hottest, curated, recent] = await Promise.all([
    userId ? getFollowingPlaylists(userId) : Promise.resolve([]),
    getWeeklyHypePlaylists(),
    getHottestPlaylists(),
    getCuratedPlaylists(),
    getRecentPlaylists(),
  ]);

  const allIds = [
    ...following.map((p) => p.id),
    ...weeklyHype.map((p) => p.id),
    ...hottest.map((p) => p.id),
    ...curated.map((p) => p.id),
    ...recent.map((p) => p.id),
  ];
  const likedIds = userId ? await getLikedPlaylistIds(userId, allIds) : new Set<string>();

  const toFeedPlaylist = (playlist: RawPlaylist): FeedPlaylist => ({
    id: playlist.id,
    title: playlist.title,
    coverImageUrl: playlist.coverImageUrl,
    tracks: playlist.tracks,
    trackCount: playlist._count.tracks,
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
      key: "latest",
      label: "Latest",
      description: "새로 올라온 플레이리스트",
      emptyMessage: "아직 새로 올라온 플레이리스트가 없어요.",
      items: recent.slice(0, SECTION_PREVIEW_LIMIT).map(toFeedPlaylist),
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
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      {/* Brand topbar, not a "Browse" screen title — PLLS Redesign's own
          Home/Playlists screen opens with the masthead, not a label (turn
          4). Mobile-only, same md:hidden handoff as ScreenHeader. */}
      <header className="flex h-10 shrink-0 items-center justify-between border-b border-border px-3 md:hidden">
        <Logo iconSize={18} />
        <span className="font-pixel text-[10px] tracking-wider text-destructive uppercase">
          {Math.min(recent.length, 99)} new
        </span>
      </header>
      <div className="flex flex-col gap-6 px-3 pt-4 pb-8">
        <DrawCoverTeaser />
        <DiscoverFeed sections={sections} />
      </div>
    </div>
  );
}
