"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { SearchBar } from "@/components/search/search-bar";
import { SearchResults } from "@/components/search/search-results";
import { getChartTracks, searchTracks } from "@/lib/api/deezer-client";
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
    queryKey: ["deezer-search", debouncedQuery],
    queryFn: () => searchTracks(debouncedQuery),
    enabled: hasQuery,
    placeholderData: (previousData) => previousData,
  });

  // Fills the empty state before a search with something to browse, instead
  // of a blank "type something" prompt.
  const { data: chartData, isLoading: isChartLoading } = useQuery({
    queryKey: ["deezer-chart"],
    queryFn: getChartTracks,
    enabled: !hasQuery,
    // Kept short (not the usual long "chart barely changes" cache) because
    // each track's preview URL is a short-lived signed link from Deezer —
    // holding onto this response too long serves 403s on play.
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
        tracks={data?.data ?? []}
        isLoading={isLoading || (isFetching && !data)}
        isError={isError}
        errorMessage={error instanceof Error ? error.message : undefined}
        hasQuery={hasQuery}
        onAddTrack={addTrack}
        chartTracks={chartData?.data ?? []}
        isChartLoading={isChartLoading}
      />
    </div>
  );
}
