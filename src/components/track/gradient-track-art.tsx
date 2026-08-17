import { getInitial, getTrackColor } from "@/lib/gradient";
import { cn } from "@/lib/utils";

interface GradientTrackArtProps {
  title: string;
  artist: string;
  className?: string;
}

/**
 * Stands in for album art everywhere a track is shown. PLLS never fetches
 * artwork from any provider — this gradient + initial is derived purely
 * from the track's own title/artist (see src/lib/gradient.ts), so the same
 * track always renders identically.
 */
export function GradientTrackArt({ title, artist, className }: GradientTrackArtProps) {
  const color = getTrackColor({ title, artist });
  const initial = getInitial({ title, artist });

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden text-white/90",
        className,
      )}
      style={{ background: `linear-gradient(${color.angle}deg, ${color.from}, ${color.to})` }}
      aria-hidden="true"
    >
      <span className="font-display text-sm leading-none select-none">{initial}</span>
    </div>
  );
}
