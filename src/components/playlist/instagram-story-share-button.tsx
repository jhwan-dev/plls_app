"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Camera, Loader2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { StoryPosterCard } from "@/components/playlist/story-poster-card";
import { ALL_TEMPLATE_IDS, buildPosterData, type PosterData, type TemplateId } from "@/lib/story-poster-data";

// Capturing before an image finishes loading can rasterize a blank frame.
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

function pickRandomTemplate(exclude?: TemplateId): TemplateId {
  const pool = exclude ? ALL_TEMPLATE_IDS.filter((id) => id !== exclude) : ALL_TEMPLATE_IDS;
  return pool[Math.floor(Math.random() * pool.length)]!;
}

// On-screen preview width — the actual card always renders at its native
// 1080x1920, scaled down visually so the capture (off-screen, unscaled) is
// never affected by the preview's CSS transform.
const PREVIEW_WIDTH = 260;
const PREVIEW_SCALE = PREVIEW_WIDTH / 1080;

interface InstagramStoryShareButtonProps {
  playlistId: string;
  title: string;
  description: string | null;
  coverImageUrl?: string | null;
  tracks: { title: string; artist: string; duration: number }[];
  curatorName: string;
  createdAt: string;
  likeCount: number;
}

export function InstagramStoryShareButton({
  playlistId,
  title,
  description,
  coverImageUrl,
  tracks,
  curatorName,
  createdAt,
  likeCount,
}: InstagramStoryShareButtonProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [templateId, setTemplateId] = useState<TemplateId>(() => pickRandomTemplate());

  const data: PosterData = buildPosterData({
    title,
    description,
    coverImageUrl: coverImageUrl ?? null,
    tracks,
    curatorName,
    createdAt: new Date(createdAt),
    likeCount,
  });

  function handleOpen() {
    setTemplateId(pickRandomTemplate());
    setIsOpen(true);
  }

  function handleShuffle() {
    setTemplateId((current) => pickRandomTemplate(current));
  }

  async function handleShare() {
    if (!captureRef.current || isGenerating) return;
    setIsGenerating(true);

    try {
      await waitForImages(captureRef.current);
      const dataUrl = await toPng(captureRef.current, {
        width: 1080,
        height: 1920,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: "#ffffff",
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
      setIsOpen(false);
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
      <Button type="button" variant="outline" onClick={handleOpen} className="shrink-0">
        <Camera className="size-4" />
        인스타로 공유
      </Button>

      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="bottom" className="items-center">
          <SheetHeader className="items-center text-center">
            <SheetTitle>스토리 카드 미리보기</SheetTitle>
          </SheetHeader>

          <div
            style={{ width: PREVIEW_WIDTH, height: 1920 * PREVIEW_SCALE, overflow: "hidden" }}
            className="rounded-lg border border-border shadow-sm"
          >
            <div style={{ transform: `scale(${PREVIEW_SCALE})`, transformOrigin: "top left" }}>
              <StoryPosterCard templateId={templateId} data={data} />
            </div>
          </div>

          <SheetFooter className="w-full flex-row gap-2">
            <Button type="button" variant="outline" onClick={handleShuffle} disabled={isGenerating} className="flex-1">
              <Shuffle className="size-4" />
              템플릿 바꾸기
            </Button>
            <Button type="button" onClick={handleShare} disabled={isGenerating} className="flex-1">
              {isGenerating ? <Loader2 className="size-4 animate-spin" /> : <Camera className="size-4" />}
              공유하기
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      {/* Off-screen, full resolution — laid out (not display:none) so
          html-to-image can rasterize it, but never visible to the user. */}
      <div style={{ position: "fixed", top: 0, left: -10_000, pointerEvents: "none" }} aria-hidden="true">
        <StoryPosterCard ref={captureRef} templateId={templateId} data={data} />
      </div>
    </>
  );
}
