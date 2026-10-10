import { PlaylistListRow } from "@/components/playlist/playlist-list-row";
import type { TrackSeed } from "@/lib/gradient";

export interface FeedPlaylist {
  id: string;
  title: string;
  coverImageUrl: string | null;
  tracks: TrackSeed[];
  trackCount: number;
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
}

export function DiscoverFeed({ sections }: DiscoverFeedProps) {
  return (
    <div className="flex flex-col gap-6">
      {sections.map((section) => (
        <section key={section.key} className="flex flex-col">
          <div className="flex items-baseline justify-between gap-4 border-b border-border pb-2">
            <h2
              className={
                section.accent
                  ? "font-display text-base text-primary"
                  : "font-display text-base text-foreground"
              }
            >
              {section.label}
            </h2>
            <p className="hidden text-[11px] text-muted-foreground sm:block">{section.description}</p>
          </div>

          {section.items.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted-foreground">{section.emptyMessage}</p>
          ) : (
            <div className="flex flex-col divide-y divide-border">
              {section.items.map((playlist) => (
                <PlaylistListRow
                  key={playlist.id}
                  id={playlist.id}
                  title={playlist.title}
                  coverImageUrl={playlist.coverImageUrl}
                  tracks={playlist.tracks}
                  trackCount={playlist.trackCount}
                  owner={playlist.owner}
                />
              ))}
            </div>
          )}
        </section>
      ))}
    </div>
  );
}
