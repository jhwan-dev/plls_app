"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Home, Search } from "lucide-react";
import { UserAvatar } from "@/components/brand/user-avatar";
import { cn } from "@/lib/utils";

interface BottomNavProps {
  userId?: string;
  userImage: string | null;
  userName: string | null;
}

export function BottomNav({ userId, userImage, userName }: BottomNavProps) {
  const pathname = usePathname();

  const profileHref = userId ? `/profile/${userId}` : "/api/auth/signin";
  const isDiscoverActive = pathname === "/";
  const isCuratorZoneActive = pathname.startsWith("/curator-zone");
  const isCreateActive = pathname.startsWith("/search");
  const isProfileActive = !!userId && pathname === profileHref;

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background md:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="flex h-16 items-center justify-around">
        <Link
          href="/"
          aria-label="둘러보기"
          className={cn("flex flex-1 items-center justify-center", isDiscoverActive ? "text-foreground" : "text-muted-foreground")}
        >
          <Home className="size-6" fill={isDiscoverActive ? "currentColor" : "none"} />
        </Link>

        <Link
          href="/curator-zone"
          aria-label="큐레이터 존"
          className={cn("flex flex-1 items-center justify-center", isCuratorZoneActive ? "text-foreground" : "text-muted-foreground")}
        >
          <Crown className="size-6" fill={isCuratorZoneActive ? "currentColor" : "none"} />
        </Link>

        <Link
          href="/search"
          aria-label="검색/생성"
          className={cn("flex flex-1 items-center justify-center", isCreateActive ? "text-foreground" : "text-muted-foreground")}
        >
          <Search className="size-6" strokeWidth={isCreateActive ? 2.75 : 2} />
        </Link>

        <Link href={profileHref} aria-label="내 프로필" className="flex flex-1 items-center justify-center">
          <UserAvatar
            image={userImage}
            name={userName ?? ""}
            className={cn(
              "size-7 rounded-full ring-2",
              isProfileActive ? "ring-primary" : "ring-transparent",
            )}
          />
        </Link>
      </div>
    </nav>
  );
}
