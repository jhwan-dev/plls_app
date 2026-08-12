/** A track inside the in-progress playlist draft, before it's persisted. */
export interface DraftTrack {
  /** Local-only id (nanoid) — lets the same Deezer track appear more than once in a draft. */
  id: string;
  deezerTrackId: number;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  previewUrl: string;
  duration: number;
}
