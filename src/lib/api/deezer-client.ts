import { parseJsonResponse } from "@/lib/api/http";
import type { DeezerSearchResponse } from "@/types/deezer";

/**
 * Browser-side fetcher. Always goes through our own `/api/deezer/*` route
 * handlers rather than `api.deezer.com` directly, since Deezer's public API
 * does not return CORS headers for browser requests.
 */
export async function searchTracks(query: string): Promise<DeezerSearchResponse> {
  const response = await fetch(`/api/deezer/search?q=${encodeURIComponent(query)}`);
  return parseJsonResponse<DeezerSearchResponse>(response);
}

export async function getChartTracks(): Promise<DeezerSearchResponse> {
  const response = await fetch("/api/deezer/chart?limit=30");
  return parseJsonResponse<DeezerSearchResponse>(response);
}
