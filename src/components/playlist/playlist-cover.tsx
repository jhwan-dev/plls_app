import Image from "next/image";
import { BrandMark } from "@/components/brand/brand-mark";
import { getPlaylistColors, type TrackSeed } from "@/lib/gradient";
import { cn } from "@/lib/utils";

interface PlaylistCoverProps {
  /** User-uploaded representative image — takes priority over everything else. */
  coverImageUrl?: string | null;
  /** Falls back to a deterministic gradient field derived from these tracks. */
  tracks: TrackSeed[];
  alt: string;
  className?: string;
  sizes?: string;
}

/**
 * A playlist's representative cover. Priority: user-uploaded image, then a
 * generated gradient "color field" derived from the playlist's own tracks
 * (no external artwork provider involved), then a neutral empty state.
 */
export function PlaylistCover({ coverImageUrl, tracks, alt, className, sizes = "50vw" }: PlaylistCoverProps) {
  if (coverImageUrl) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image src={coverImageUrl} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  if (tracks.length === 0) {
    // Explicit exception to BrandMark's usual "never a placeholder" rule
    // (see its own doc comment) — for playlist covers specifically, the
    // brand mark itself is the intended default thumbnail, not a stand-in
    // for a missing photo.
    return (
      <div className={cn("flex items-center justify-center bg-white", className)}>
        <BrandMark className="h-2/5" />
      </div>
    );
  }

  const colors = getPlaylistColors(tracks, 4);

  return (
    <div
      className={cn("relative overflow-hidden", className)}
      style={{ backgroundColor: colors[0]!.solid }}
      role="img"
      aria-label={alt}
    >
      {colors.map((color, index) => (
        <div
          key={index}
          className="absolute rounded-full"
          style={{
            background: `radial-gradient(circle, ${color.from} 0%, transparent 70%)`,
            width: "85%",
            height: "85%",
            left: `${(index % 2) * 45}%`,
            top: `${index < 2 ? 0 : 45}%`,
          }}
        />
      ))}
    </div>
  );
}
