"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Camera, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { StoryCard } from "@/components/playlist/story-card";

// Only relevant when a cover image is set (see StoryCard) — capturing before
// it's loaded can rasterize a blank frame. No-op when the card has no <img>
// at all (gradient-blob background, the common case).
async function waitForImages(container: HTMLElement) {
  const imgs = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    imgs.map((img) =>
      img.complete
        ? Promise.resolve()
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
    ),
  );
}

interface InstagramStoryShareButtonProps {
  playlistId: string;
  title: string;
  coverImageUrl?: string | null;
  tracks: { title: string; artist: string }[];
}

export function InstagramStoryShareButton({
  playlistId,
  title,
  coverImageUrl,
  tracks,
}: InstagramStoryShareButtonProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  async function handleShare() {
    if (!cardRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      await waitForImages(cardRef.current);
      const dataUrl = await toPng(cardRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: "#0f172a",
      });

      const playlistUrl = `${window.location.origin}/playlist/${playlistId}`;
      // Best-effort — clipboard access can be denied, or a permission prompt
      // can sit unanswered, which would hang this await forever. Race it
      // against a timeout so a stuck clipboard call can never block the
      // image download/share below.
      await Promise.race([
        navigator.clipboard.writeText(playlistUrl).catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, 1500)),
      ]);

      const blob = await (await fetch(dataUrl)).blob();
      const file = new File([blob], `plls-${playlistId}.png`, { type: "image/png" });

      // navigator.share needs to run inside the original click's user-activation
      // window — on iOS Safari in particular, the await above can burn through
      // that window and make share() silently reject. Fall back to a direct
      // download whenever the Web Share API isn't available or refuses the file.
      let shared = false;
      if (navigator.canShare?.({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title });
          shared = true;
        } catch (err) {
          if (err instanceof Error && err.name === "AbortError") {
            // User closed the share sheet — not an error, don't fall back.
            shared = true;
          }
        }
      }

      if (!shared) {
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `plls-${playlistId}.png`;
        link.click();
      }

      toast.add({
        title: "스토리 카드가 준비됐어요",
        description: "인스타 스토리에서 링크 스티커를 추가하고, 복사된 플레이리스트 링크를 붙여넣으세요!",
        type: "success",
      });
    } catch (err) {
      toast.add({
        title: "이미지 생성에 실패했어요",
        description: err instanceof Error ? err.message : "잠시 후 다시 시도해 주세요.",
        type: "error",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <Button type="button" variant="outline" onClick={handleShare} disabled={isGenerating} className="shrink-0">
        {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
        인스타로 공유
      </Button>

      {/* Off-screen — laid out (not display:none) so html-to-image can
          rasterize it, but never visible to the user. */}
      <div style={{ position: "fixed", top: 0, left: -10_000, pointerEvents: "none" }} aria-hidden="true">
        <StoryCard ref={cardRef} title={title} coverImageUrl={coverImageUrl} tracks={tracks} />
      </div>
    </>
  );
}
