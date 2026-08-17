/**
 * Raw iTunes Search API response shape — only the text-metadata fields PLLS
 * actually uses. Artwork fields (`artworkUrl30/60/100`) and preview fields
 * (`previewUrl`) are intentionally left out of this type: PLLS never reads
 * them, even though the live API response includes them.
 */
export interface ItunesRawTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  collectionName: string;
  trackTimeMillis: number;
  releaseDate?: string;
  kind?: string;
  wrapperType?: string;
}

export interface ItunesSearchResponse {
  resultCount: number;
  results: ItunesRawTrack[];
}
