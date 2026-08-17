/** A track inside the in-progress playlist draft, before it's persisted. */
export interface DraftTrack {
  /** Local-only id (nanoid) — lets the same track appear more than once in a draft. */
  id: string;
  itunesTrackId: number;
  title: string;
  artist: string;
  album: string;
  duration: number;
  /**
   * Set once loaded from a saved playlist (resolved server-side at save
   * time) — undefined for a not-yet-saved draft track, null when resolution
   * found no video match.
   */
  youtubeUrl?: string | null;
}
