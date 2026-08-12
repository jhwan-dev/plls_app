"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { parseJsonResponse } from "@/lib/api/http";

interface ToggleFollowResponse {
  following: boolean;
  followerCount: number;
}

interface FollowButtonProps {
  targetUserId: string;
  initialFollowing: boolean;
  isAuthenticated: boolean;
  onChange?: (result: ToggleFollowResponse) => void;
}

export function FollowButton({
  targetUserId,
  initialFollowing,
  isAuthenticated,
  onChange,
}: FollowButtonProps) {
  const router = useRouter();
  const [following, setFollowing] = useState(initialFollowing);
  const [isPending, setIsPending] = useState(false);

  async function handleClick() {
    if (!isAuthenticated) {
      // Full navigation — the Auth.js sign-in flow needs a real page load
      // to set cookies before it can redirect back here.
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = `/api/auth/signin?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (isPending) return;

    const previous = following;
    setIsPending(true);
    setFollowing(!previous);

    try {
      const response = await fetch(`/api/users/${targetUserId}/follow`, { method: "POST" });
      const result = await parseJsonResponse<ToggleFollowResponse>(response);
      setFollowing(result.following);
      onChange?.(result);
      // Refreshes the surrounding server component so the "팔로워 N" count
      // (rendered server-side, not owned by this button) stays in sync.
      router.refresh();
    } catch {
      setFollowing(previous);
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      type="button"
      variant={following ? "outline" : "default"}
      size="sm"
      onClick={handleClick}
      disabled={isPending}
      className="rounded-full px-4"
    >
      {following ? "팔로잉" : "팔로우"}
    </Button>
  );
}
