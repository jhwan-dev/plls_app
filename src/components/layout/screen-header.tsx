import Link from "next/link";
import { BackButton } from "@/components/layout/back-button";

interface ScreenHeaderProps {
  title: string;
  /** Short all-caps/numeric status, Silkscreen — e.g. "8 NEW", "6 TOTAL". */
  meta?: string;
  /** Static back destination. Omit on a tab's own root screen (nothing to go back to). */
  backHref?: string;
  /** Dynamic back (history) — for screens reached from many different lists. */
  useHistoryBack?: boolean;
}

/** PLLS Redesign's per-screen header bar (turn 7, all three screens): fixed
 * 40px, a Space Mono title on the left (with an optional "<" back chevron),
 * a Silkscreen status badge on the right. Mobile-only — the design doc's
 * frame is itself a phone screen, so `md:hidden` here hands desktop back to
 * SiteHeader, which ChromeVisibility (layout.tsx) hides only below `md` on
 * these same routes. */
export function ScreenHeader({ title, meta, backHref, useHistoryBack }: ScreenHeaderProps) {
  const titleNode = (
    <span className="font-display text-base font-bold text-foreground">
      {(backHref || useHistoryBack) && <span aria-hidden="true">&lt; </span>}
      {title}
    </span>
  );

  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b border-border px-3 md:hidden">
      {useHistoryBack ? (
        <BackButton>{titleNode}</BackButton>
      ) : backHref ? (
        <Link href={backHref}>{titleNode}</Link>
      ) : (
        titleNode
      )}
      {meta && (
        <span className="font-pixel text-[10px] tracking-wider text-muted-foreground-strong uppercase">
          {meta}
        </span>
      )}
    </header>
  );
}
