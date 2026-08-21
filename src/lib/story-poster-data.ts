export interface PosterTrackLine {
  title: string;
  artist: string;
}

export interface PosterData {
  title: string;
  coverImageUrl: string | null;
  /** Playlist description — used as the body copy on most templates. */
  description: string | null;
  /** Up to 6 tracks, for the templates that show a tracklist instead of
   * (or in addition to) the description — see TRACKLIST_TEMPLATE_IDS. */
  trackLines: PosterTrackLine[];
  trackCount: number;
  durationLabel: string;
  curatorHandle: string;
  dateLabel: string;
  likeCount: number;
}

const MONTHS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

function formatDurationLabel(totalSeconds: number): string {
  const totalMinutes = Math.round(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}H ${minutes}MIN` : `${minutes}MIN`;
}

function formatDateLabel(date: Date): string {
  return `${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

export function buildPosterData(params: {
  title: string;
  coverImageUrl: string | null;
  description: string | null;
  tracks: { title: string; artist: string; duration: number }[];
  curatorName: string;
  createdAt: Date;
  likeCount: number;
}): PosterData {
  const totalSeconds = params.tracks.reduce((sum, track) => sum + track.duration, 0);

  return {
    title: params.title,
    coverImageUrl: params.coverImageUrl,
    description: params.description,
    trackLines: params.tracks.slice(0, 6).map((track) => ({ title: track.title, artist: track.artist })),
    trackCount: params.tracks.length,
    durationLabel: formatDurationLabel(totalSeconds),
    curatorHandle: `@${params.curatorName}`,
    dateLabel: formatDateLabel(params.createdAt),
    likeCount: params.likeCount,
  };
}

/** Templates dense enough with existing text/columns that a single
 * description sentence doesn't fill the design as intended — these show the
 * tracklist (title + artist only) instead. */
export const TRACKLIST_TEMPLATE_IDS = new Set(["t05", "t08", "t09", "t11", "t13"]);

/** Templates with no cover-photo slot in the original design at all. */
export const NO_COVER_TEMPLATE_IDS = new Set(["t02", "t08", "t10"]);

export const ALL_TEMPLATE_IDS = [
  "t02", "t03", "t04", "t05", "t06", "t07",
  "t08", "t09", "t10", "t11", "t12", "t13",
] as const;

export type TemplateId = (typeof ALL_TEMPLATE_IDS)[number];
