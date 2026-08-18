"use client";

import { useRef, useState, type ChangeEvent } from "react";
import { Camera, Loader2, X } from "lucide-react";
import { PlaylistCover } from "@/components/playlist/playlist-cover";
import type { TrackSeed } from "@/lib/gradient";
import { cn } from "@/lib/utils";

interface PlaylistCoverEditorProps {
  coverImageUrl: string | null;
  /** Uploads `file` and returns the resulting URL — callback owns whatever
   * persistence (or lack of it) makes sense for the caller's context. */
  onUpload: (file: File) => Promise<string>;
  onRemove: () => Promise<void> | void;
  tracks: TrackSeed[];
  alt: string;
  className?: string;
}

/** Cover art with an upload/remove overlay. Used both for an already-saved
 * playlist's edit mode and for the in-progress draft on the search/create
 * page — see onUpload/onRemove for how the two differ. */
export function PlaylistCoverEditor({
  coverImageUrl,
  onUpload,
  onRemove,
  tracks,
  alt,
  className,
}: PlaylistCoverEditorProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    setError(null);

    try {
      await onUpload(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : "업로드에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  }

  async function handleRemove() {
    setIsUploading(true);
    setError(null);

    try {
      await onRemove();
    } catch (err) {
      setError(err instanceof Error ? err.message : "제거에 실패했습니다.");
    } finally {
      setIsUploading(false);
    }
  }

  return (
    // No wrapping element around the sized box below — `className` (aspect
    // ratio + width) needs to land on whatever is the *actual* flex item of
    // the caller's layout. An extra unsized wrapper here previously broke
    // that: on a fixed sm:w-64 desktop width it happened to still resolve,
    // but on mobile — width-only-through-w-full, no fixed-px fallback — the
    // wrapper had no way to hand down a resolvable width, so the image
    // rendered at 0×0. The `hidden` file input has no layout footprint so it
    // can safely sit alongside as a sibling; the (rare) error message does
    // the same as an overlay rather than adding a second box to size.
    <>
      <div className={cn("group relative overflow-hidden rounded-[3px]", className)}>
        <PlaylistCover coverImageUrl={coverImageUrl} tracks={tracks} alt={alt} className="size-full" />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          aria-label="커버 이미지 변경"
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100"
        >
          {isUploading ? (
            <Loader2 className="size-5 animate-spin text-white" />
          ) : (
            <Camera className="size-5 text-white" />
          )}
        </button>

        {!isUploading && coverImageUrl && (
          <button
            type="button"
            onClick={handleRemove}
            aria-label="커버 이미지 제거"
            className="absolute top-2 right-2 rounded-full bg-black/40 p-1.5 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100"
          >
            <X className="size-4" />
          </button>
        )}

        {error && (
          <p className="absolute inset-x-0 bottom-0 bg-black/60 px-2 py-1 text-center text-xs text-white">
            {error}
          </p>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </>
  );
}
