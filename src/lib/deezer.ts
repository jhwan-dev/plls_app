import "server-only";
import type { DeezerErrorResponse, DeezerSearchResponse } from "@/types/deezer";

const DEEZER_API_BASE_URL = process.env.DEEZER_API_BASE_URL ?? "https://api.deezer.com";

export class DeezerApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "DeezerApiError";
    this.status = status;
  }
}

function isDeezerErrorResponse(payload: unknown): payload is DeezerErrorResponse {
  return (
    typeof payload === "object" &&
    payload !== null &&
    "error" in payload &&
    typeof (payload as { error?: unknown }).error === "object"
  );
}

/**
 * Server-side call to the public Deezer API. Never call api.deezer.com
 * directly from the browser — Deezer does not send CORS headers, and this
 * keeps the upstream base URL/config in one place.
 */
export async function searchDeezerTracks(
  query: string,
  options?: { index?: number; limit?: number },
): Promise<DeezerSearchResponse> {
  const url = new URL("/search", DEEZER_API_BASE_URL);
  url.searchParams.set("q", query);
  url.searchParams.set("index", String(options?.index ?? 0));
  url.searchParams.set("limit", String(options?.limit ?? 25));

  const response = await fetch(url, {
    // Deezer results for a given query rarely change second-to-second;
    // a short cache avoids hammering the upstream API on repeat searches.
    next: { revalidate: 60 },
  });

  const payload: unknown = await response.json();

  if (!response.ok || isDeezerErrorResponse(payload)) {
    const message = isDeezerErrorResponse(payload)
      ? payload.error.message
      : `Deezer API request failed with status ${response.status}`;
    throw new DeezerApiError(message, response.ok ? 502 : response.status);
  }

  return payload as DeezerSearchResponse;
}

/** Deezer's global Top Tracks chart — used to give the home page something to show before a search. */
export async function getDeezerChartTracks(limit = 30): Promise<DeezerSearchResponse> {
  const url = new URL("/chart/0/tracks", DEEZER_API_BASE_URL);
  url.searchParams.set("limit", String(limit));

  const response = await fetch(url, {
    // Deezer's preview URLs are short-lived signed links (they 403 once the
    // embedded token expires) — even though the chart ranking itself shifts
    // slowly, caching the response longer than the token's lifetime serves
    // dead preview links. Keep this well under that window.
    next: { revalidate: 300 },
  });

  const payload: unknown = await response.json();

  if (!response.ok || isDeezerErrorResponse(payload)) {
    const message = isDeezerErrorResponse(payload)
      ? payload.error.message
      : `Deezer API request failed with status ${response.status}`;
    throw new DeezerApiError(message, response.ok ? 502 : response.status);
  }

  return payload as DeezerSearchResponse;
}
