"use client";

import { useEffect, useRef } from "react";
import { drawPixelArt, type PixelArtOptions } from "@/lib/pixel-art";
import { cn } from "@/lib/utils";

interface PixelArtProps extends PixelArtOptions {
  seed: string;
  className?: string;
}

/** A generated pixel-art swatch, seeded deterministically — the same seed
 * always draws the same art (a repost shows the identical cover as the
 * original). Internal resolution is fixed; CSS scales it to fill the
 * container with crisp (non-blurred) pixel edges. */
export function PixelArt({ seed, className, grid, fillChance }: PixelArtProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      drawPixelArt(canvasRef.current, seed, 8, { grid, fillChance });
    }
  }, [seed, grid, fillChance]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("block size-full [image-rendering:pixelated]", className)}
    />
  );
}
