"use client";

import { useEffect, useRef } from "react";
import { usePlayerStore } from "@/store/player-store";
import { toast } from "@/components/ui/toast";

/**
 * Single shared <audio> element for 30s Deezer previews. Mounting exactly one
 * instance (in the root layout) guarantees only one preview ever plays at a
 * time, regardless of how many track rows are rendered on screen.
 */
export function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrackId = usePlayerStore((state) => state.currentTrackId);
  const previewUrl = usePlayerStore((state) => state.previewUrl);
  const isPlaying = usePlayerStore((state) => state.isPlaying);
  const pause = usePlayerStore((state) => state.pause);
  const reset = usePlayerStore((state) => state.reset);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !previewUrl) return;

    if (audio.src !== previewUrl) {
      audio.src = previewUrl;
    }
    audio.play().catch(() => {
      // Autoplay can be rejected by the browser (e.g. no prior user
      // gesture); reflect that back in the shared state.
      pause();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackId, previewUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch(() => pause());
    } else {
      audio.pause();
    }
  }, [isPlaying, pause]);

  return (
    <audio
      ref={audioRef}
      preload="none"
      onEnded={reset}
      onError={() => {
        // Most commonly a Deezer preview link whose signed token expired
        // before the click — surface it instead of leaving the play button
        // stuck showing "playing" over silence.
        reset();
        toast.add({
          title: "미리듣기를 재생할 수 없어요",
          description: "잠시 후 다시 시도해 주세요.",
          type: "error",
        });
      }}
      className="hidden"
    />
  );
}
