import Link from "next/link";
import { PlaylistCoverCollage } from "@/components/playlist/playlist-cover-collage";
import { LikeButton } from "@/components/playlist/like-button";
import { displayName } from "@/lib/user-display";

interface EditorialPlaylistCardOwner {
  id: string;
  name: string | null;
  nickname: string | null;
  image: string | null;
}

interface EditorialPlaylistCardProps {
  id: string;
  title: string;
  coverUrls: string[];
  owner?: EditorialPlaylistCardOwner | null;
  initialLiked: boolean;
  likeCount: number;
  isAuthenticated: boolean;
}

/** PLLS's own card format: portrait artwork, sharp corners, and editorial
 * credit typography — not a generic square grid tile. */
export function EditorialPlaylistCard({
  id,
  title,
  coverUrls,
  owner,
  initialLiked,
  likeCount,
  isAuthenticated,
}: EditorialPlaylistCardProps) {
  return (
    <div className="flex flex-col gap-2.5">
      <Link href={`/playlist/${id}`} className="block">
        <PlaylistCoverCollage
          covers={coverUrls}
          alt={title}
          className="aspect-[4/5] w-full rounded-[3px]"
          sizes="(max-width: 640px) 45vw, 260px"
        />
      </Link>

      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <Link href={`/playlist/${id}`} className="min-w-0">
            <p className="truncate text-base leading-snug font-bold text-foreground">{title}</p>
            {owner && (
              <p className="mt-0.5 truncate text-[11px] font-medium tracking-wide text-muted-foreground uppercase">
                {displayName(owner)}
              </p>
            )}
          </Link>
          <LikeButton
            playlistId={id}
            initialLiked={initialLiked}
            initialCount={likeCount}
            isAuthenticated={isAuthenticated}
            variant="minimal"
          />
        </div>
      </div>
    </div>
  );
}
