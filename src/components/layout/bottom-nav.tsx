"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PixelIcon } from "@/components/pixel/pixel-icon";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  userId?: string;
}

const TABS = [
  { key: "playlists", href: "/", icon: "nav-playlists", label: "PLAYLISTS" },
  { key: "curator-zone", href: "/curator-zone", icon: "nav-crown", label: "CURATOR ZONE" },
  { key: "search", href: "/search", icon: "nav-search", label: "SEARCH" },
] as const;

/** Reads as four physical device buttons (PLLS Redesign, turn 7) — a
 * bordered tile per tab, icon + label, the active one filled solid blue —
 * not a generic icon-only tab strip. */
export function BottomNav({ userId }: BottomNavProps) {
  const pathname = usePathname();
  const profileHref = userId ? `/profile/${userId}` : "/api/auth/signin";

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);
  const isProfileActive = !!userId && pathname === profileHref;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="grid grid-cols-4 gap-1.5 p-1.5">
        {TABS.map((tab) => {
          const active = isActive(tab.href);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              aria-label={tab.label}
              className={cn(
                "flex flex-col items-center gap-1 border border-border py-2",
                active ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
              )}
            >
              <PixelIcon name={tab.icon} size={17} />
              <span className="font-pixel text-[7px] tracking-wide">{tab.label}</span>
            </Link>
          );
        })}

        <Link
          href={profileHref}
          aria-label="PROFILE"
          className={cn(
            "flex flex-col items-center gap-1 border border-border py-2",
            isProfileActive ? "border-primary bg-primary text-primary-foreground" : "bg-card text-muted-foreground",
          )}
        >
          <PixelIcon name="nav-profile" size={17} />
          <span className="font-pixel text-[7px] tracking-wide">PROFILE</span>
        </Link>
      </div>
    </nav>
  );
}
