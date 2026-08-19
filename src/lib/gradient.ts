export interface TrackSeed {
  title: string;
  artist: string;
}

export interface TrackColor {
  hue: number;
  from: string;
  to: string;
  angle: number;
  solid: string;
}

function hashString(input: string): number {
  let hash = 5381;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i);
  }
  return hash >>> 0;
}

function seedKey({ title, artist }: TrackSeed): string {
  return `${title.trim().toLowerCase()}::${artist.trim().toLowerCase()}`;
}

/**
 * Deterministic color derived purely from a track's title+artist string — no
 * external artwork provider involved, so the same track always renders the
 * same color everywhere it appears as track-level art (search results,
 * playlist rows) via GradientTrackArt.
 */
export function getTrackColor(track: TrackSeed): TrackColor {
  const hash = hashString(seedKey(track));
  const hue = hash % 360;
  // Golden-angle-ish offset for the second stop so it's always visually
  // distinct from the first, never a near-duplicate muddy hue.
  const hue2 = (hue + 47 + (hash % 53)) % 360;
  const angle = 135 + ((hash >> 8) % 4) * 45;

  return {
    hue,
    from: `hsl(${hue} 72% 52%)`,
    to: `hsl(${hue2} 68% 38%)`,
    angle,
    solid: `hsl(${hue} 65% 45%)`,
  };
}

export function getInitial(track: TrackSeed): string {
  const source = track.title.trim() || track.artist.trim();
  return source ? source[0]!.toUpperCase() : "♪";
}
