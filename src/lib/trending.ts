import "server-only";
import { prisma } from "@/lib/prisma";
import type { Track } from "@/types/track";

/**
 * Most-added tracks across all playlists — replaces the old external "chart"
 * (Deezer's global Top Tracks) as the pre-search browsing state. Backed by
 * PLLS's own usage data instead of a second external API, so it carries no
 * extra rate-limit or compliance surface.
 */
export async function getTrendingTracks(limit = 20): Promise<Track[]> {
  const groups = await prisma.playlistTrack.groupBy({
    by: ["itunesTrackId", "title", "artist", "album", "duration"],
    _count: { itunesTrackId: true },
    orderBy: { _count: { itunesTrackId: "desc" } },
    take: limit,
  });

  return groups.map((group) => ({
    id: group.itunesTrackId,
    title: group.title,
    artist: group.artist,
    album: group.album,
    duration: group.duration,
  }));
}
