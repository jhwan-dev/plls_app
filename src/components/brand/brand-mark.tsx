import Image from "next/image";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  className?: string;
}

// Intrinsic size of public/brand/p-symbol.png — sets the aspect-ratio so
// callers only need to constrain height (e.g. "h-7") and width follows.
const GLYPH_RATIO = "623 / 780";

/**
 * The PLLS "P" brand mark — the actual designed glyph (see
 * public/brand/p-symbol.png), not a generic letter-in-a-shape icon. This is
 * the brand symbol itself: reserve it for real brand moments (header
 * lockup, splash, app icon) — never as a stand-in "no photo" placeholder,
 * see UserAvatar's own neutral fallback for that.
 */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <span className={cn("relative inline-block shrink-0", className)} style={{ aspectRatio: GLYPH_RATIO }}>
      <Image src="/brand/p-symbol.png" alt="PLLS" fill sizes="120px" className="object-contain" priority />
    </span>
  );
}
