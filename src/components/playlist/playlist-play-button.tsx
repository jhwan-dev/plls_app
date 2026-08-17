import { SquarePlay } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <Button
      variant="outline"
      className="shrink-0"
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
    >
      <SquarePlay className="size-4" />
      전체 재생
    </Button>
  );
}
