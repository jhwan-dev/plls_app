import Image from "next/image";
import { Music2 } from "lucide-react";
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
    return (
      <div className={cn("flex items-center justify-center bg-muted", className)}>
        <Music2 className="size-6 text-muted-foreground" />
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
