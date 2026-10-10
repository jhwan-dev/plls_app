"use client";

import { useState } from "react";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { parseJsonResponse } from "@/lib/api/http";

interface RepostButtonProps {
  playlistId: string;
  initialReposted: boolean;
  isAuthenticated: boolean;
  /** The owner can't repost their own playlist — see the API route; this
   * just hides the affordance instead of letting the click fail. */
  isOwnPlaylist: boolean;
}

interface ToggleRepostResponse {
  reposted: boolean;
  count: number;
}

const ACTIVE = "#3047FF";
const INACTIVE = "#B9B4A6";

/** Icon-only — shares someone else's playlist onto this user's own profile
 * (see Repost in schema.prisma), the way Instagram's repost does, not a
 * generic "share" duplicate. */
export function RepostButton({ playlistId, initialReposted, isAuthenticated, isOwnPlaylist }: RepostButtonProps) {
  const [reposted, setReposted] = useState(initialReposted);
  const [isPending, setIsPending] = useState(false);

  if (isOwnPlaylist) return null;

  async function handleClick() {
    if (!isAuthenticated) {
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (isPending) return;

    const previous = reposted;
    setIsPending(true);
    setReposted(!previous);

    try {
      const response = await fetch(`/api/playlists/${playlistId}/repost`, { method: "POST" });
      const result = await parseJsonResponse<ToggleRepostResponse>(response);
      setReposted(result.reposted);
    } catch {
      setReposted(previous);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={isPending} aria-label="리포스트" aria-pressed={reposted}>
      <PixelIcon name="icon-repost" size={22} color={reposted ? ACTIVE : INACTIVE} />
    </button>
  );
}
