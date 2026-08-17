"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TrackRow } from "@/components/search/track-row";
import { searchTracks } from "@/lib/api/itunes-client";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import type { Track } from "@/types/track";

interface TrackSearchAddProps {
  onAdd: (track: Track) => void;
}

/** Compact inline search used inside the playlist editor to add tracks to
 * an already-saved playlist — same iTunes search as the main search page,
 * just scoped to this one editing session instead of the global draft. */
export function TrackSearchAdd({ onAdd }: TrackSearchAddProps) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 400);
  const hasQuery = debouncedQuery.length > 0;

  const { data, isLoading } = useQuery({
    queryKey: ["itunes-search", debouncedQuery],
    queryFn: () => searchTracks(debouncedQuery),
    enabled: hasQuery,
  });

  const tracks = data ?? [];

  return (
    <div className="flex flex-col gap-2">
      <div className="relative w-full">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="곡, 아티스트 검색해서 추가..."
          className="h-10 pl-10 text-sm"
        />
      </div>

      {hasQuery && (
        <div className="flex max-h-64 flex-col gap-1 overflow-y-auto rounded-lg border border-border p-1">
          {isLoading ? (
            <p className="py-4 text-center text-sm text-muted-foreground">검색 중...</p>
          ) : tracks.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">검색 결과가 없어요.</p>
          ) : (
            tracks.map((track) => (
              <TrackRow
                key={track.id}
                track={track}
                action={
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="size-9 shrink-0"
                    aria-label="곡 추가"
                    onClick={() => onAdd(track)}
                  >
                    <Plus className="size-4" />
                  </Button>
                }
              />
            ))
          )}
        </div>
      )}
    </div>
  );
}
