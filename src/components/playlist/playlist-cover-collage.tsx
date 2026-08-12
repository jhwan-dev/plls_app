import Image from "next/image";
import { Music2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PlaylistCoverCollageProps {
  /** Cover URLs in track order — only the first 4 are used. */
  covers: string[];
  alt: string;
  className?: string;
  sizes?: string;
}

/**
 * A playlist's representative cover: a single image when there's fewer than
 * 4 tracks to draw from, otherwise a 2x2 collage of the first 4 tracks'
 * covers — mirrors how Spotify/Apple Music mosaic playlist art.
 */
export function PlaylistCoverCollage({
  covers,
  alt,
  className,
  sizes = "50vw",
}: PlaylistCoverCollageProps) {
  const validCovers = covers.filter(Boolean);

  if (validCovers.length === 0) {
    return (
      <div className={cn("flex items-center justify-center bg-muted", className)}>
        <Music2 className="size-6 text-muted-foreground" />
      </div>
    );
  }

  if (validCovers.length < 4) {
    return (
      <div className={cn("relative overflow-hidden bg-muted", className)}>
        <Image src={validCovers[0]} alt={alt} fill sizes={sizes} className="object-cover" />
      </div>
    );
  }

  return (
    <div className={cn("grid grid-cols-2 grid-rows-2 gap-px overflow-hidden bg-muted", className)}>
      {validCovers.slice(0, 4).map((cover, index) => (
        <div key={index} className="relative overflow-hidden">
          <Image src={cover} alt={alt} fill sizes={sizes} className="object-cover" />
        </div>
      ))}
    </div>
  );
}
