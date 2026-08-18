"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SortableDraftTrackRow } from "@/components/playlist/sortable-draft-track-row";
import { PlaylistCoverEditor } from "@/components/playlist/playlist-cover-editor";
import { usePlaylistDraftStore } from "@/store/playlist-draft-store";
import { createPlaylist, uploadDraftCover } from "@/lib/api/playlist-client";

interface PlaylistDraftPanelProps {
  isAuthenticated: boolean;
  isCurator: boolean;
}

export function PlaylistDraftPanel({ isAuthenticated, isCurator }: PlaylistDraftPanelProps) {
  const router = useRouter();
  const title = usePlaylistDraftStore((state) => state.title);
  const description = usePlaylistDraftStore((state) => state.description);
  const genre = usePlaylistDraftStore((state) => state.genre);
  const tracks = usePlaylistDraftStore((state) => state.tracks);
  const coverImageUrl = usePlaylistDraftStore((state) => state.coverImageUrl);
  const setTitle = usePlaylistDraftStore((state) => state.setTitle);
  const setDescription = usePlaylistDraftStore((state) => state.setDescription);
  const setGenre = usePlaylistDraftStore((state) => state.setGenre);
  const setCoverImageUrl = usePlaylistDraftStore((state) => state.setCoverImageUrl);
  const removeTrack = usePlaylistDraftStore((state) => state.removeTrack);
  const reorderTracks = usePlaylistDraftStore((state) => state.reorderTracks);
  const clear = usePlaylistDraftStore((state) => state.clear);

  const mutation = useMutation({
    mutationFn: createPlaylist,
    onSuccess: (result) => {
      clear();
      router.push(`/playlist/${result.id}`);
    },
  });

  const isSaving = mutation.isPending;

  // Mouse for desktop drag, Touch with a hold delay + move tolerance so a
  // tap-and-scroll on mobile isn't mistaken for the start of a drag.
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorderTracks(String(active.id), String(over.id));
    }
  }

  const canSave = isAuthenticated && title.trim().length > 0 && tracks.length > 0 && !isSaving;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-baseline justify-between gap-4 border-b border-border pb-3">
        <h2 className="font-display text-2xl tracking-tight text-foreground">My PLLS</h2>
        <span className="font-mono text-xs text-muted-foreground">{tracks.length}곡</span>
      </div>

      <PlaylistCoverEditor
        coverImageUrl={coverImageUrl}
        onUpload={async (file) => {
          const result = await uploadDraftCover(file);
          setCoverImageUrl(result.coverImageUrl);
          return result.coverImageUrl;
        }}
        onRemove={() => setCoverImageUrl(null)}
        tracks={tracks.map((track) => ({ title: track.title, artist: track.artist }))}
        alt={title || "새 플레이리스트"}
        className="aspect-[4/5] w-full max-w-[180px]"
      />

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="playlist-title" className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
          제목
        </Label>
        <Input
          id="playlist-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          disabled={isSaving}
          maxLength={200}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label
          htmlFor="playlist-description"
          className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
        >
          설명
        </Label>
        <Textarea
          id="playlist-description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          disabled={isSaving}
          maxLength={1000}
          rows={3}
        />
      </div>

      {isCurator && (
        <div className="flex flex-col gap-1.5">
          <Label
            htmlFor="playlist-genre"
            className="text-xs font-semibold tracking-wide text-muted-foreground uppercase"
          >
            장르 · Curator&apos;s PLLS
          </Label>
          <Input
            id="playlist-genre"
            value={genre}
            onChange={(event) => setGenre(event.target.value)}
            placeholder="예: 인디락, Lo-fi, K-Pop"
            disabled={isSaving}
            maxLength={50}
          />
        </div>
      )}

      {tracks.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          검색 결과에서 곡을 추가해 보세요.
        </p>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext
            items={tracks.map((track) => track.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex max-h-[420px] flex-col gap-1 overflow-y-auto">
              {tracks.map((track) => (
                <SortableDraftTrackRow
                  key={track.id}
                  track={track}
                  onRemove={removeTrack}
                  disabled={isSaving}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}

      {!isAuthenticated && (
        <p className="text-sm text-muted-foreground">저장하려면 먼저 로그인해 주세요.</p>
      )}

      {mutation.isError && (
        <p className="text-sm text-destructive">{mutation.error.message}</p>
      )}

      <Button
        type="button"
        disabled={!canSave}
        onClick={() => mutation.mutate({ title, description, genre, tracks, coverImageUrl })}
      >
        {isSaving ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            저장 중...
          </>
        ) : (
          "PLLS로 저장하고 공유하기"
        )}
      </Button>
    </div>
  );
}
