import Image from "next/image";
import { BrandMark } from "@/components/brand/brand-mark";
import type { TrackSeed } from "@/lib/gradient";
import { cn } from "@/lib/utils";

interface PlaylistCoverProps {
  /** User-uploaded representative image — takes priority over everything else. */
  coverImageUrl?: string | null;
  /** Unused for rendering now (default cover is always the P mark below) —
   * kept so callers that still thread track data through for other reasons
   * (e.g. Story card's own track list) don't need a separate prop shape. */
  tracks: TrackSeed[];
  alt: string;
  className?: string;
  sizes?: string;
}

/**
 * A playlist's representative cover. Priority: user-uploaded image, then the
 * PLLS "P" brand mark on white — the mark itself is the intended default
 * thumbnail here (see BrandMark's doc comment for this explicit exception),
 * not a per-playlist generated pattern.
 */
export function PlaylistCover({ coverImageUrl, alt, className, sizes = "50vw" }: PlaylistCoverProps) {
  if (coverImageUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image src={coverImageUrl} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center justify-center bg-white", className)}>
      <BrandMark className="h-2/5" />
    </div>
  );
}
