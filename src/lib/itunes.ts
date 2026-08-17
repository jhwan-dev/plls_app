import "server-only";
import type { ItunesRawTrack, ItunesSearchResponse } from "@/types/itunes";
import type { Track } from "@/types/track";

const ITUNES_API_BASE_URL = process.env.ITUNES_API_BASE_URL ?? "https://itunes.apple.com";

export class ItunesApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ItunesApiError";
    this.status = status;
  }
}

function mapItunesTrack(raw: ItunesRawTrack): Track {
  return {
    id: raw.trackId,
    title: raw.trackName,
    artist: raw.artistName,
    album: raw.collectionName,
    duration: Math.round(raw.trackTimeMillis / 1000),
  };
}

/**
 * Server-side call to the public iTunes Search API — text metadata only.
 * Artwork fields present in the raw response are never read (see
 * `ItunesRawTrack`), and no preview/stream field exists on `Track` at all.
 */
export async function searchItunesTracks(query: string, options?: { limit?: number }): Promise<Track[]> {
  const url = new URL("/search", ITUNES_API_BASE_URL);
  url.searchParams.set("term", query);
  url.searchParams.set("country", "kr");
  url.searchParams.set("media", "music");
  url.searchParams.set("entity", "song");
  url.searchParams.set("limit", String(options?.limit ?? 25));

  const response = await fetch(url, {
    // iTunes results for a given query rarely change second-to-second; a
    // short cache keeps us well under the ~20 req/min rate limit on repeat
    // searches.
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new ItunesApiError(`iTunes Search API request failed with status ${response.status}`, response.status);
  }

  const payload = (await response.json()) as ItunesSearchResponse;

  return payload.results
    .filter((raw) => Boolean(raw.trackId && raw.trackName && raw.artistName))
    .map(mapItunesTrack);
}
