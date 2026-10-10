"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { toast } from "@/components/ui/toast";
import { parseJsonResponse } from "@/lib/api/http";

interface LikeButtonProps {
  playlistId: string;
  initialLiked: boolean;
  currentCount: number;
  isAuthenticated: boolean;
  /** Lets the caller keep its own displayed like count (the hero stats
   * row) in sync — this button shows no count itself, see its doc comment. */
  onToggled?: (liked: boolean, count: number) => void;
}

interface ToggleLikeResponse {
  liked: boolean;
  count: number;
}

const ACTIVE = "#E8465A";
const INACTIVE = "#B9B4A6";

/** Icon-only — one of the four Like/Repost/Play/Share buttons on Playlist
 * Detail (PLLS Redesign, turn 7). No count here: the hero stats row above
 * already shows the like count once. */
export function LikeButton({ playlistId, initialLiked, currentCount, isAuthenticated, onToggled }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    if (!isAuthenticated) {
      // Full navigation (not router.push) — the Auth.js sign-in flow needs a
      // real page load to set cookies before it can redirect back here.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (isPending) return;

    const previousLiked = liked;
    const previousCount = currentCount;
    const optimisticCount = previousCount + (previousLiked ? -1 : 1);

    setIsPending(true);
    setLiked(!previousLiked);
    onToggled?.(!previousLiked, optimisticCount);

    try {
      const response = await fetch(`/api/playlists/${playlistId}/like`, { method: "POST" });
      const result = await parseJsonResponse<ToggleLikeResponse>(response);
      setLiked(result.liked);
      onToggled?.(result.liked, result.count);
    } catch (err) {
      setLiked(previousLiked);
      onToggled?.(previousLiked, previousCount);
      toast.add({
        title: "좋아요 처리에 실패했어요",
        description: err instanceof Error ? err.message : "잠시 후 다시 시도해 주세요.",
        type: "error",
      });
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} aria-label="좋아요" aria-pressed={liked}>
      <PixelIcon name="icon-heart" size={22} color={liked ? ACTIVE : INACTIVE} />
    </button>
  );
}
