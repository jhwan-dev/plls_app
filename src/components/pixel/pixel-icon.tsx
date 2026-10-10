"use client";

import { useEffect, useRef } from "react";
import { drawPixelIcon } from "@/lib/pixel-icons";
import { cn } from "@/lib/utils";

interface PixelIconProps {
  name: string;
  /** Pixel size (both width and height) of the rendered icon on screen. */
  size?: number;
  className?: string;
  /** Overrides the icon's own fixed color — for a state-driven icon (a
   * liked heart, a reposted loop) that repaints between an "on"/"off"
   * color without a different bitmap. */
  color?: string;
}

/** A hand-authored bitmap icon (see lib/pixel-icons.ts) — "currentColor"
 * icons (the bottom-nav set) pick up the CSS color of their container, so
 * set `color` on a parent rather than passing a color here. */
export function PixelIcon({ name, size = 18, className, color }: PixelIconProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const resolved = getComputedStyle(canvasRef.current).color;
    drawPixelIcon(canvasRef.current, name, resolved, color);
  }, [name, color]);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      aria-hidden="true"
      className={cn("[image-rendering:pixelated]", className)}
      style={{ width: size, height: size }}
    />
  );
}
