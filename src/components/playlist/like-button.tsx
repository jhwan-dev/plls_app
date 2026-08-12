"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { parseJsonResponse } from "@/lib/api/http";

interface LikeButtonProps {
  playlistId: string;
  initialLiked: boolean;
  initialCount: number;
  isAuthenticated: boolean;
  /** "minimal" drops the bordered button chrome for use inside dense editorial cards. */
  variant?: "button" | "minimal";
}

interface ToggleLikeResponse {
  liked: boolean;
  count: number;
}

export function LikeButton({
  playlistId,
  initialLiked,
  initialCount,
  isAuthenticated,
  variant = "button",
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
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
    const previousCount = count;

    setIsPending(true);
    setLiked(!previousLiked);
    setCount(previousCount + (previousLiked ? -1 : 1));

    try {
      const response = await fetch(`/api/playlists/${playlistId}/like`, { method: "POST" });
      const result = await parseJsonResponse<ToggleLikeResponse>(response);
      setLiked(result.liked);
      setCount(result.count);
    } catch {
      setLiked(previousLiked);
      setCount(previousCount);
    } finally {
      setIsPending(false);
    }
  }

  if (variant === "minimal") {
    return (
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className={cn(
          "inline-flex shrink-0 items-center gap-1 font-mono text-xs tabular-nums transition-colors",
          liked ? "text-primary" : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Heart className={cn("size-3.5", liked && "fill-current")} />
        {count}
      </button>
    );
  }

  return (
    <Button
      type="button"
      variant={liked ? "default" : "outline"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="shrink-0"
    >
      <Heart className={cn("size-4", liked && "fill-current")} />
      {count}
    </Button>
  );
}
