import Link from "next/link";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconSize?: number;
  href?: string;
}

/** The brand lockup — a hand-authored pixel-bitmap "P" plus a Press Start
 * 2P wordmark (see lib/pixel-icons.ts and globals.css's --font-word). Not
 * the photo asset in public/brand/ — those stay in the two spots that can't
 * render a canvas (the OG image, built by Satori, and the splash screen's
 * brief pre-redesign brand moment). */
export function Logo({ className, iconSize = 20, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center gap-1.5", className)}>
      <PixelIcon name="p-icon" size={iconSize} />
      <span className="font-word text-foreground" style={{ fontSize: iconSize * 0.55 }}>
        PLLS
      </span>
    </Link>
  );
}
