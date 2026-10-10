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
 * Renders as PLLS Redesign's full-width "Play on YouTube" bar (turn 7, 7c)
 * rather than a chip button — it owns that bar's whole look so Playlist
 * Detail doesn't render an empty bar shell when nothing is playable.
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
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-11 shrink-0 items-center border-y border-border bg-card px-3 transition-colors hover:bg-accent/50"
    >
      <span className="flex-1 text-sm font-medium text-foreground">▶ 전체 재생</span>
      <span className="font-pixel text-[10px] text-muted-foreground">YT</span>
    </a>
  );
}
