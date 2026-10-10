import { PixelIcon } from "@/components/pixel/pixel-icon";

interface PlaylistPlayButtonProps {
  /** Tracks in playback order — only ones with a matched video are included. */
  tracks: { youtubeUrl: string | null }[];
}

function extractVideoId(youtubeUrl: string): string | null {
  try {
    return new URL(youtubeUrl).searchParams.get("v");
  } catch {
    return null;
  }
}

/**
 * Opens all of a playlist's matched YouTube videos, in order, as a single
 * ad-hoc queue via YouTube's own `watch_videos` endpoint — still a plain
 * link (new tab), never an embed. Tracks with no matched video (see
 * track-link.ts) are simply skipped rather than substituted with a search
 * link, since that has no video id to include in the queue.
 *
 * Icon-only — one of the four Like/Repost/Play/Share buttons (PLLS
 * Redesign, turn 7). No "YouTube" label or badge: where it opens is a
 * technical detail, not something the button needs to say.
 */
export function PlaylistPlayButton({ tracks }: PlaylistPlayButtonProps) {
  const videoIds = tracks
    .map((track) => (track.youtubeUrl ? extractVideoId(track.youtubeUrl) : null))
    .filter((id): id is string => Boolean(id));

  if (videoIds.length === 0) {
    return null;
  }

  const href = `https://www.youtube.com/watch_videos?video_ids=${videoIds.join(",")}`;

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label="재생">
      <PixelIcon name="icon-play" size={22} />
    </a>
  );
}
