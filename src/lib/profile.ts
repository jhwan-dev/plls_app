import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

// Wrapped in cache() so generateMetadata and the page component share one
// set of queries per request instead of fetching the profile twice.
export const getUserProfile = cache(async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, nickname: true, image: true },
  });

  if (!user) return null;

  const [playlists, followerCount, followingCount, totalLikesReceived] = await Promise.all([
    prisma.playlist.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        // 4, not 1 — the grid's cover collage draws from up to 4 tracks.
        tracks: { take: 4, orderBy: { position: "asc" } },
        _count: { select: { tracks: true, likes: true } },
      },
    }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.follow.count({ where: { followerId: userId } }),
    // Sum of likes across every playlist this user owns — not likes they've given out.
    prisma.like.count({ where: { playlist: { userId } } }),
  ]);

  return { user, playlists, followerCount, followingCount, totalLikesReceived };
});

export const getUserBasic = cache((userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, nickname: true, image: true },
  }),
);

export function isFollowing(followerId: string, followingId: string) {
  return prisma.follow
    .findUnique({ where: { followerId_followingId: { followerId, followingId } } })
    .then((follow) => !!follow);
}

const userSummarySelect = { id: true, name: true, nickname: true, image: true } as const;

export async function getFollowers(userId: string) {
  const rows = await prisma.follow.findMany({
    where: { followingId: userId },
    orderBy: { createdAt: "desc" },
    include: { follower: { select: userSummarySelect } },
  });
  return rows.map((row) => row.follower);
}

export async function getFollowing(userId: string) {
  const rows = await prisma.follow.findMany({
    where: { followerId: userId },
    orderBy: { createdAt: "desc" },
    include: { following: { select: userSummarySelect } },
  });
  return rows.map((row) => row.following);
}

/** Which of `userIds` does `viewerId` already follow — for seeding FollowButton state in bulk. */
export async function getFollowingIdsAmong(viewerId: string, userIds: string[]) {
  if (userIds.length === 0) return new Set<string>();

  const rows = await prisma.follow.findMany({
    where: { followerId: viewerId, followingId: { in: userIds } },
    select: { followingId: true },
  });

  return new Set(rows.map((row) => row.followingId));
}
