import Link from "next/link";
import { PixelIcon } from "@/components/pixel/pixel-icon";

/** Entry point for hand-drawing a playlist cover on its own pixel grid —
 * every cover already renders as one (see lib/pixel-art.ts), so this is
 * where that becomes something a user can paint themselves (see
 * PixelCoverEditor). Links to Search/create, where a new draft's cover
 * editor offers "직접 그리기" alongside the regular photo upload. */
export function DrawCoverTeaser() {
  return (
    <Link
      href="/search"
      className="flex items-center gap-3 border-2 border-dashed border-muted-foreground/40 bg-muted/40 p-3.5"
    >
      <span className="flex size-10 shrink-0 items-center justify-center border border-border bg-card">
        <PixelIcon name="brush" size={22} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-foreground">내 커버 직접 그리기</span>
        <span className="mt-0.5 block text-xs leading-snug text-muted-foreground">
          플레이리스트 커버는 늘 이 픽셀판 위에 그려져요 — 이제 직접 칠해보세요.
        </span>
      </span>
      <span className="font-pixel shrink-0 text-[10px] text-primary">GO &gt;</span>
    </Link>
  );
}
