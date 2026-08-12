import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  wordmarkClassName?: string;
  href?: string;
}

// Intrinsic size of public/brand/plls-wordmark.png — sets the aspect-ratio
// so the image is never squished or cropped at whatever height it's shown.
const WORDMARK_RATIO = "843 / 257";

/** The header brand button — the real PLLS wordmark asset only. The "P"
 * symbol is a separate, deliberately rare accent (see BrandMark) and isn't
 * paired here to avoid repeating the mark next to itself on every page. */
export function Logo({ className, wordmarkClassName, href = "/" }: LogoProps) {
  return (
    <Link href={href} className={cn("inline-flex items-center", className)}>
      <span
        className={cn("relative h-7 w-auto", wordmarkClassName)}
        style={{ aspectRatio: WORDMARK_RATIO }}
      >
        <Image src="/brand/plls-wordmark.png" alt="PLLS" fill sizes="140px" className="object-contain" priority />
      </span>
    </Link>
  );
}
