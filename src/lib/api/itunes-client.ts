import { parseJsonResponse } from "@/lib/api/http";
import type { Track } from "@/types/track";

interface TrackListResponse {
  tracks: Track[];
}

/**
 * Browser-side fetcher. Always goes through our own `/api/itunes/*` route
 * handlers rather than `itunes.apple.com` directly — keeps the upstream base
 * URL and the text-only field mapping in one server-side place.
 */
export async function searchTracks(query: string): Promise<Track[]> {
  const response = await fetch(`/api/itunes/search?q=${encodeURIComponent(query)}`);
  const { tracks } = await parseJsonResponse<TrackListResponse>(response);
  return tracks;
}

/** PLLS's own "most-added" tracks — shown before a search is typed. */
export async function getTrendingTracks(): Promise<Track[]> {
  const response = await fetch("/api/tracks/trending?limit=20");
  const { tracks } = await parseJsonResponse<TrackListResponse>(response);
  return tracks;
}
