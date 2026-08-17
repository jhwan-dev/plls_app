"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";
import { getTrendingTracks, searchTracks } from "@/lib/api/itunes-client";
import { useDebouncedValue } from "@/hooks/use-debounced-value";
import { usePlaylistDraftStore } from "@/store/playlist-draft-store";

export function SearchView() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query.trim(), 400);
  const addTrack = usePlaylistDraftStore((state) => state.addTrack);
  const hasQuery = debouncedQuery.length > 0;

  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
  } = useQuery({
    queryKey: ["itunes-search", debouncedQuery],
    queryFn: () => searchTracks(debouncedQuery),
    enabled: hasQuery,
    placeholderData: (previousData) => previousData,
  });

  // Fills the empty state before a search with something to browse, instead
  // of a blank "type something" prompt — backed by PLLS's own most-added
  // tracks rather than an external trending API.
  const { data: trendingData, isLoading: isTrendingLoading } = useQuery({
    queryKey: ["trending-tracks"],
    queryFn: getTrendingTracks,
    enabled: !hasQuery,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="flex w-full flex-col gap-4">
      <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
        당신의 사운드를
        <br />
        만들어보세요.
      </h1>

      <SearchBar value={query} onChange={setQuery} />

      <SearchResults
        tracks={data ?? []}
        isLoading={isLoading || (isFetching && !data)}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        hasQuery={hasQuery}
        onAddTrack={addTrack}
        trendingTracks={trendingData ?? []}
        isTrendingLoading={isTrendingLoading}
      />
    </div>
  );
}
