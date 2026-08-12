import { Check, Music2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TrackRow } from "@/components/search/track-row";
import { usePlaylistDraftStore } from "@/store/playlist-draft-store";
import { cn } from "@/lib/utils";
import type { DeezerTrack } from "@/types/deezer";

function TrackRowSkeleton() {
  return (
    <div className="flex items-center gap-3 p-2">
      <Skeleton className="size-9 shrink-0 rounded-full" />
      <Skeleton className="size-12 shrink-0 rounded-md" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
  );
}

function AddableTrackList({
  tracks,
  onAddTrack,
}: {
  tracks: DeezerTrack[];
  onAddTrack: (track: DeezerTrack) => void;
}) {
  // Only used to show "already added" feedback in the key point color — the
  // draft still allows the same track twice, this is just a visual cue.
  const draftTracks = usePlaylistDraftStore((state) => state.tracks);
  const addedIds = new Set(draftTracks.map((track) => track.deezerTrackId));

  return (
    <div className="flex flex-col gap-1">
      {tracks.map((track) => {
        const isAdded = addedIds.has(track.id);
        return (
          <TrackRow
            key={track.id}
            track={track}
            action={
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className={cn("size-9 shrink-0", isAdded && "text-primary hover:text-primary")}
                aria-label={isAdded ? "플레이리스트에 추가됨" : "플레이리스트에 추가"}
                onClick={() => onAddTrack(track)}
              >
                {isAdded ? <Check className="size-4" /> : <Plus className="size-4" />}
              </Button>
            }
          />
        );
      })}
    </div>
  );
}

interface SearchResultsProps {
  tracks: DeezerTrack[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  hasQuery: boolean;
  onAddTrack: (track: DeezerTrack) => void;
  chartTracks: DeezerTrack[];
  isChartLoading: boolean;
}

export function SearchResults({
  tracks,
  isLoading,
  isError,
  errorMessage,
  hasQuery,
  onAddTrack,
  chartTracks,
  isChartLoading,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-1">
        {Array.from({ length: 8 }).map((_, index) => (
          <TrackRowSkeleton key={index} />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-2 py-16 text-center text-sm text-destructive">
        <p>{errorMessage ?? "검색 중 오류가 발생했습니다."}</p>
      </div>
    );
  }

  if (!hasQuery) {
    if (isChartLoading) {
      return (
        <div className="flex flex-col gap-1">
          {Array.from({ length: 8 }).map((_, index) => (
            <TrackRowSkeleton key={index} />
          ))}
        </div>
      );
    }

    if (chartTracks.length === 0) {
      return (
        <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
          <Music2 className="size-8" />
          <p className="text-sm">곡, 아티스트, 앨범을 검색해 보세요.</p>
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-4">
        <h2 className="font-display border-b border-border pb-3 text-2xl tracking-tight text-foreground">
          Trending Now
        </h2>
        <AddableTrackList tracks={chartTracks} onAddTrack={onAddTrack} />
      </div>
    );
  }

  if (tracks.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-16 text-center text-muted-foreground">
        <Music2 className="size-8" />
        <p className="text-sm">검색 결과가 없습니다.</p>
      </div>
    );
  }

  return <AddableTrackList tracks={tracks} onAddTrack={onAddTrack} />;
}
