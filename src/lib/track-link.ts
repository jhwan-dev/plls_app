import "server-only";
import { prisma } from "@/lib/prisma";

const STALE_AFTER_MS = 30 * 24 * 60 * 60 * 1000; // 30 days
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

interface YoutubeSearchResponse {
  items?: { id?: { videoId?: string } }[];
}

async function searchYoutubeVideoId(title: string, artist: string): Promise<string | null> {
  if (!YOUTUBE_API_KEY) return null;

  const url = new URL("https://www.googleapis.com/youtube/v3/search");
  url.searchParams.set("part", "snippet");
  url.searchParams.set("type", "video");
  url.searchParams.set("maxResults", "1");
  url.searchParams.set("q", `${title} ${artist}`);
  url.searchParams.set("key", YOUTUBE_API_KEY);

  const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
  if (!response.ok) return null;

  const payload = (await response.json()) as YoutubeSearchResponse;
  return payload.items?.[0]?.id?.videoId ?? null;
}

/**
 * Resolves a track's YouTube video, cache-first — returns the direct video
 * URL when the YouTube Data API finds one, or null when it doesn't. No
 * search-results link is ever returned here: the per-track "재생" button
 * only shows for a genuine match, and only tracks with a real match are
 * eligible for the playlist-level "전체 재생" concatenation (see
 * playlist-play-button.tsx), which needs actual video ids to link together.
 *
 * Called once per track at playlist-save time (see the create/update
 * playlist routes), never on every render: the free tier allows ~100
 * searches/day, and TrackLinkCache (keyed globally by itunesTrackId, not
 * per playlist) is what keeps repeat adds of the same track — across any
 * playlist, any user — from ever re-hitting the API.
 *
 * (Originally built against Odesli/song.link for cross-platform matching,
 * but that API's YouTube coverage had silently gone dark ahead of its
 * announced 2026-07-31 retirement — verified empirically against several
 * well-known tracks before switching to a direct YouTube search, which also
 * needs only title+artist, not a source-platform URL.)
 */
export async function resolveYoutubeUrl(
  itunesTrackId: number,
  title: string,
  artist: string,
): Promise<string | null> {
  const cached = await prisma.trackLinkCache.findUnique({ where: { itunesTrackId } });

  if (cached?.resolved) {
    return cached.youtubeUrl;
  }

  const isStale = cached && Date.now() - cached.lastCheckedAt.getTime() > STALE_AFTER_MS;
  if (cached && !isStale) {
    // Previously looked up and still unresolved, not old enough to retry.
    return null;
  }

  let videoId: string | null = null;
  try {
    videoId = await searchYoutubeVideoId(title, artist);
  } catch {
    videoId = null;
  }

  const youtubeUrl = videoId ? `https://www.youtube.com/watch?v=${videoId}` : null;

  await prisma.trackLinkCache.upsert({
    where: { itunesTrackId },
    create: { itunesTrackId, youtubeUrl, resolved: youtubeUrl !== null },
    update: { youtubeUrl, resolved: youtubeUrl !== null, lastCheckedAt: new Date() },
  });

  return youtubeUrl;
}
