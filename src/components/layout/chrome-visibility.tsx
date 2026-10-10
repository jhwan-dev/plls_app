"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

// Screens rebuilt to PLLS Redesign's own per-screen header (ScreenHeader) —
// see those pages — render it instead of the site-wide SiteHeader so the
// two header bars don't stack. Every other page keeps SiteHeader as its
// only top-level nav (desktop links, sign-in), so this is a narrow,
// per-route opt-out rather than a site-wide nav redesign.
function screenHasOwnHeader(pathname: string): boolean {
  return pathname === "/" || pathname.startsWith("/playlist/");
}

/** Hides `children` (SiteHeader) on routes that render their own ScreenHeader
 * — mobile only. ScreenHeader is itself a mobile-only pattern (the design
 * doc's whole frame *is* a phone screen) and hides itself at `md`, so
 * desktop keeps SiteHeader as its only top-level nav on every route. */
export function ChromeVisibility({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  if (screenHasOwnHeader(pathname)) return <div className="hidden md:block">{children}</div>;
  return <>{children}</>;
}
