import { EditorialPlaylistCard } from "@/components/playlist/editorial-playlist-card";
import type { TrackSeed } from "@/lib/gradient";

export interface FeedPlaylist {
  id: string;
  title: string;
  coverImageUrl: string | null;
  tracks: TrackSeed[];
  likeCount: number;
  initialLiked: boolean;
  owner: { id: string; name: string | null; nickname: string | null; image: string | null } | null;
}

export interface FeedSection {
  key: string;
  label: string;
  description: string;
  emptyMessage: string;
  items: FeedPlaylist[];
  /** "Today's PLLS" is the one section that keeps the brand accent color. */
  accent?: boolean;
}

interface DiscoverFeedProps {
  sections: FeedSection[];
  isAuthenticated: boolean;
}

export function DiscoverFeed({ sections, isAuthenticated }: DiscoverFeedProps) {
  return (
    <div className="flex flex-col gap-14">
      {sections.map((section) => (
        <section key={section.key} className="flex flex-col gap-5">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
            <h2
              className={
                section.accent
                  ? "font-display text-2xl tracking-tight text-primary"
                  : "font-display text-2xl tracking-tight text-foreground"
              }
            >
              {section.label}
            </h2>
            <p className="hidden font-mono text-[11px] text-muted-foreground sm:block">
              {section.description}
            </p>
          </div>

          {section.items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{section.emptyMessage}</p>
          ) : (
            <div className="scrollbar-hide -mx-4 flex gap-4 overflow-x-auto px-4 pb-1">
              {section.items.map((playlist) => (
                <div key={playlist.id} className="w-40 shrink-0 sm:w-48">
                  <EditorialPlaylistCard
                    id={playlist.id}
                    title={playlist.title}
                    coverImageUrl={playlist.coverImageUrl}
                    tracks={playlist.tracks}
                    owner={playlist.owner}
                    initialLiked={playlist.initialLiked}
                    likeCount={playlist.likeCount}
                    isAuthenticated={isAuthenticated}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
