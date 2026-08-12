import Link from "next/link";
import type { Session } from "next-auth";
import { signIn, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/brand/logo";
import { displayName } from "@/lib/user-display";

interface SiteHeaderProps {
  session: Session | null;
}

export function SiteHeader({ session }: SiteHeaderProps) {
  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <div className="flex items-center gap-6">
          <Logo />
          {/* Bottom tab bar covers primary nav on mobile — this row is desktop-only. */}
          <nav className="hidden items-center gap-5 text-xs font-semibold tracking-wide text-muted-foreground uppercase md:flex">
            <Link href="/" className="hover:text-foreground">
              둘러보기
            </Link>
            <Link href="/search" className="hover:text-foreground">
              검색/생성
            </Link>
            <Link href="/curated" className="hover:text-foreground">
              Curator&apos;s PLLS
            </Link>
            <Link href="/curator-zone" className="hover:text-foreground">
              Curator Zone
            </Link>
            {session?.user && (
              <Link href={`/profile/${session.user.id}`} className="hover:text-foreground">
                프로필
              </Link>
            )}
          </nav>
        </div>

        {session?.user ? (
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-muted-foreground sm:inline">
              {displayName(session.user)}
            </span>
            <form
              action={async () => {
                "use server";
                await signOut();
              }}
            >
              <Button type="submit" variant="outline" size="sm">
                로그아웃
              </Button>
            </form>
          </div>
        ) : (
          <form
            action={async () => {
              "use server";
              await signIn("google");
            }}
          >
            <Button type="submit" size="sm">
              Google로 로그인
            </Button>
          </form>
        )}
      </div>
    </header>
  );
}
