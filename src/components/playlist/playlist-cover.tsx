import Image from "next/image";
import { PixelArt } from "@/components/pixel/pixel-art";
import type { TrackSeed } from "@/lib/gradient";
import { cn } from "@/lib/utils";

interface PlaylistCoverProps {
  /** User-uploaded representative image — takes priority over everything else. */
  coverImageUrl?: string | null;
  /** Deterministic seed for the generated pixel-art fallback — the
   * playlist's id where one exists, or its (working) title for an
   * unsaved draft. Same seed always draws the same art, so a repost shows
   * the identical swatch as the original. */
  seed: string;
  /** Unused for rendering now (pixel art is seeded by `seed`, not track
   * data) — kept so callers that still thread track data through for other
   * reasons (e.g. Story card's own track list) don't need a separate prop
   * shape. */
  tracks: TrackSeed[];
  alt: string;
  className?: string;
  sizes?: string;
}

/**
 * A playlist's representative cover. Priority: user-uploaded image, then a
 * generated pixel-art swatch (see lib/pixel-art.ts) — every cover on PLLS
 * is pixel art or a real photo, never a gradient or a letter initial.
 */
export function PlaylistCover({ coverImageUrl, seed, alt, className, sizes = "50vw" }: PlaylistCoverProps) {
  if (coverImageUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image src={coverImageUrl} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("overflow-hidden border border-border", className)}>
      <PixelArt seed={seed} />
    </div>
  );
}
