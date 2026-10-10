"use client";

import { useState } from "react";
import { Loader2, Pencil, X } from "lucide-react";
import { PlaylistCover } from "@/components/playlist/playlist-cover";
import { PixelCoverEditor } from "@/components/playlist/pixel-cover-editor";
import type { TrackSeed } from "@/lib/gradient";
import { cn } from "@/lib/utils";

interface PlaylistCoverEditorProps {
  coverImageUrl: string | null;
  /** Uploads `file` (always a drawn PNG — see PixelCoverEditor) and returns
   * the resulting URL. Callback owns whatever persistence makes sense for
   * the caller's context. */
  onUpload: (file: File) => Promise<string>;
  onRemove: () => Promise<void> | void;
  tracks: TrackSeed[];
  alt: string;
  className?: string;
}

/** Cover art with a draw/remove overlay — drawing (see PixelCoverEditor) is
 * the only way to set a cover; there's no photo upload. Used both for an
 * already-saved playlist's edit mode and for the in-progress draft on the
 * search/create page — see onUpload/onRemove for how the two differ.
 *
 * The empty state is deliberately its own "draw a cover" tile, not
 * PlaylistCover's generated pixel-art default — that's the *read-only* look
 * for a playlist with no cover (feed cards, the view-mode page, OG image,
 * Story card), which would otherwise make an editable, empty slot look like
 * a finished, deliberate choice instead of an invitation to draw something. */
export function PlaylistCoverEditor({
  coverImageUrl,
  onUpload,
  onRemove,
  tracks,
  alt,
  className,
}: PlaylistCoverEditorProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  async function handleDrawnSave(file: File) {
    setError(null);
    try {
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
      throw err;
    }
  }

  async function handleRemove() {
    setIsRemoving(true);
    setError(null);

    try {
      await onRemove();
    } catch (err) {
      setError(err instanceof Error ? err.message : "제거에 실패했습니다.");
    } finally {
      setIsRemoving(false);
    }
  }

  return (
    <>
      <div className={cn("group relative overflow-hidden rounded-[3px]", className)}>
        {coverImageUrl ? (
          <>
            <PlaylistCover coverImageUrl={coverImageUrl} seed={alt} tracks={tracks} alt={alt} className="size-full" />

            <button
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              disabled={isRemoving}
              aria-label="다시 그리기"
              className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
            >
              <Pencil className="size-5 text-white" />
            </button>

            {!isRemoving && (
              <button
                type="button"
                onClick={handleRemove}
                aria-label="커버 이미지 제거"
                className="absolute top-2 right-2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
              >
                <X className="size-4" />
              </button>
            )}

            {isRemoving && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                <Loader2 className="size-5 animate-spin text-white" />
              </div>
            )}
          </>
        ) : (
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            aria-label="커버 직접 그리기"
            className="flex size-full flex-col items-center justify-center gap-1.5 bg-muted text-muted-foreground hover:text-foreground"
          >
            <Pencil className="size-7" />
            <span className="text-xs font-medium">직접 그리기</span>
          </button>
        )}

        {error && (
          <p className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-center text-xs text-white">
            {error}
          </p>
        )}
      </div>

      <PixelCoverEditor open={isDrawerOpen} onOpenChange={setIsDrawerOpen} onSave={handleDrawnSave} />
    </>
  );
}
