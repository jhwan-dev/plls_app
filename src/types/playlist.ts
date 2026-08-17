/** A track inside the in-progress playlist draft, before it's persisted. */
export interface DraftTrack {
  /** Local-only id (nanoid) — lets the same track appear more than once in a draft. */
  id: string;
  itunesTrackId: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  /** Present only once loaded from a saved playlist (resolved server-side at save time). */
  youtubeUrl?: string;
}
