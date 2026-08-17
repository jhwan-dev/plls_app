/**
 * Provider-agnostic track shape used throughout the UI. Deliberately has no
 * artwork/cover field and no preview/stream URL — PLLS never fetches album
 * art from any provider and never plays audio in-app. If the source ever
 * changes again, only the adapter that produces this shape needs to change.
 */
export interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
}
