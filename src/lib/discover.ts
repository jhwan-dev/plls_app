import "server-only";
import { prisma } from "@/lib/prisma";
import type { CuratorType } from "@/generated/prisma/client";

const WEEKLY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;
const SECTION_LIMIT = 10;
const RECENT_LIMIT = 50;

const playlistCardInclude = {
  // 4, not 1 — the grid card's cover collage draws from up to 4 tracks.
  tracks: { take: 4, orderBy: { position: "asc" as const } },
  _count: { select: { tracks: true, likes: true } },
  user: { select: { id: true, name: true, nickname: true, image: true } },
};

/** Ranked by likes received in the last 7 days — not lifetime total. */
export async function getWeeklyHypePlaylists() {
  const since = new Date(Date.now() - WEEKLY_WINDOW_MS);

  const groups = await prisma.like.groupBy({
    by: ["playlistId"],
    where: { createdAt: { gte: since } },
    _count: { playlistId: true },
    orderBy: { _count: { playlistId: "desc" } },
    take: SECTION_LIMIT,
  });

  if (groups.length === 0) return [];

  const playlists = await prisma.playlist.findMany({
    where: { id: { in: groups.map((group) => group.playlistId) } },
    include: playlistCardInclude,
  });
  const byId = new Map(playlists.map((playlist) => [playlist.id, playlist]));

  // groupBy doesn't preserve join order, so re-sort by the ranking we asked for.
  return groups
    .map((group) => {
      const playlist = byId.get(group.playlistId);
      return playlist ? { ...playlist, weeklyLikeCount: group._count.playlistId } : null;
    })
    .filter((playlist) => playlist !== null);
}

/** Ranked by all-time like count. */
export function getHottestPlaylists() {
  return prisma.playlist.findMany({
    where: { likes: { some: {} } },
    orderBy: { likes: { _count: "desc" } },
    take: SECTION_LIMIT,
    include: playlistCardInclude,
  });
}

export function getRecentPlaylists() {
  return prisma.playlist.findMany({
    orderBy: { createdAt: "desc" },
    take: RECENT_LIMIT,
    include: playlistCardInclude,
  });
}

/** Playlists made by people `viewerId` follows. */
export function getFollowingPlaylists(viewerId: string) {
  return prisma.playlist.findMany({
    where: { user: { followers: { some: { followerId: viewerId } } } },
    orderBy: { createdAt: "desc" },
    take: SECTION_LIMIT,
    include: playlistCardInclude,
  });
}

/** Playlists from curator accounts — see User.isCurator. */
export function getCuratedPlaylists() {
  return prisma.playlist.findMany({
    where: { user: { isCurator: true } },
    orderBy: { createdAt: "desc" },
    include: playlistCardInclude,
  });
}

/**
 * Curator playlists grouped by curator type — see User.curatorType. Used by
 * the Curator Zone page (/curator-zone), which sections artists, places
 * (bars/venues), and individual curators separately, distinct from Discover's
 * single flat "Curator PLLS" preview row.
 */
export async function getCuratorZonePlaylists() {
  const playlists = await prisma.playlist.findMany({
    where: { user: { isCurator: true, curatorType: { not: null } } },
    orderBy: { createdAt: "desc" },
    include: {
      ...playlistCardInclude,
      user: { select: { id: true, name: true, nickname: true, image: true, curatorType: true } },
    },
  });

  const groups: Record<CuratorType, typeof playlists> = { ARTIST: [], PLACE: [], CURATOR: [] };
  for (const playlist of playlists) {
    const type = playlist.user?.curatorType;
    if (type) groups[type].push(playlist);
  }
  return groups;
}

/** Playlist ids among `playlistIds` that `userId` has liked — for seeding LikeButton state in bulk. */
export async function getLikedPlaylistIds(userId: string, playlistIds: string[]) {
  if (playlistIds.length === 0) return new Set<string>();

  const likes = await prisma.like.findMany({
    where: { userId, playlistId: { in: playlistIds } },
    select: { playlistId: true },
  });

  return new Set(likes.map((like) => like.playlistId));
}
