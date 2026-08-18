"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Check, Loader2, Pencil, X } from "lucide-react";
import { nanoid } from "nanoid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/brand/user-avatar";
import { PlaylistCover } from "@/components/playlist/playlist-cover";
import { PlaylistCoverEditor } from "@/components/playlist/playlist-cover-editor";
import { PlaylistTrackRow } from "@/components/playlist/playlist-track-row";
import { SortableDraftTrackRow } from "@/components/playlist/sortable-draft-track-row";
import { TrackSearchAdd } from "@/components/playlist/track-search-add";
import { LikeButton } from "@/components/playlist/like-button";
import { ShareButton } from "@/components/playlist/share-button";
import { PlaylistPlayButton } from "@/components/playlist/playlist-play-button";
import { InstagramStoryShareButton } from "@/components/playlist/instagram-story-share-button";
import { DeletePlaylistButton } from "@/components/playlist/delete-playlist-button";
import { EditableDescription } from "@/components/playlist/editable-description";
import { updatePlaylist, updatePlaylistCover, removePlaylistCover } from "@/lib/api/playlist-client";
import type { DraftTrack } from "@/types/playlist";
import type { Track } from "@/types/track";

interface PlaylistDetailBodyProps {
  playlistId: string;
  initialTitle: string;
  genre: string | null;
  initialDescription: string | null;
  initialTracks: DraftTrack[];
  coverImageUrl: string | null;
  owner: { id: string; image: string | null; name: string } | null;
  isOwner: boolean;
  isAuthenticated: boolean;
  initialLiked: boolean;
  likeCount: number;
}

export function PlaylistDetailBody({
  playlistId,
  initialTitle,
  genre,
  initialDescription,
  initialTracks,
  coverImageUrl: initialCoverImageUrl,
  owner,
  isOwner,
  isAuthenticated,
  initialLiked,
  likeCount,
}: PlaylistDetailBodyProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [tracks, setTracks] = useState(initialTracks);
  const [coverImageUrl, setCoverImageUrl] = useState(initialCoverImageUrl);
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(initialTitle);
  const [draftTracks, setDraftTracks] = useState(initialTracks);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 5 } }),
  );

  function startEditing() {
    setDraftTitle(title);
    setDraftTracks(tracks);
    setError(null);
    setIsEditing(true);
  }

  function cancelEditing() {
    setIsEditing(false);
    setError(null);
  }

  function handleAddTrack(track: Track) {
    setDraftTracks((prev) => [
      ...prev,
      {
        id: nanoid(),
        itunesTrackId: track.id,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
      },
    ]);
  }

  function handleRemoveTrack(id: string) {
    setDraftTracks((prev) => prev.filter((track) => track.id !== id));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setDraftTracks((prev) => {
      const oldIndex = prev.findIndex((track) => track.id === active.id);
      const newIndex = prev.findIndex((track) => track.id === over.id);
      if (oldIndex === -1 || newIndex === -1) return prev;
      return arrayMove(prev, oldIndex, newIndex);
    });
  }

  async function handleSave() {
    if (draftTitle.trim().length === 0) {
      setError("제목을 입력해 주세요.");
      return;
    }
    if (draftTracks.length === 0) {
      setError("최소 1개 이상의 트랙이 있어야 해요.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      await updatePlaylist(playlistId, { title: draftTitle, tracks: draftTracks });
      setTitle(draftTitle);
      setTracks(draftTracks);
      setIsEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  }

  const trackSeeds = (isEditing ? draftTracks : tracks).map((track) => ({
    title: track.title,
    artist: track.artist,
  }));
  const ownerName = owner?.name ?? null;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 pt-10 pb-8">
      {/* Mobile: cover on top, then editorial credit block below.
          sm+: cover on the left, credit block beside it — a magazine spread. */}
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
        {isOwner && isEditing ? (
          <PlaylistCoverEditor
            coverImageUrl={coverImageUrl}
            onUpload={async (file) => {
              const result = await updatePlaylistCover(playlistId, file);
              setCoverImageUrl(result.coverImageUrl);
              return result.coverImageUrl;
            }}
            onRemove={async () => {
              await removePlaylistCover(playlistId);
              setCoverImageUrl(null);
            }}
            tracks={trackSeeds}
            alt={title}
            className="aspect-[4/5] w-full max-w-[280px] shrink-0 sm:w-64"
          />
        ) : (
          <PlaylistCover
            coverImageUrl={coverImageUrl}
            tracks={trackSeeds}
            alt={title}
            className="aspect-[4/5] w-full max-w-[280px] shrink-0 rounded-[3px] sm:w-64"
            sizes="(max-width: 640px) 280px, 256px"
          />
        )}

        <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
          <div className="flex w-full flex-col gap-1.5">
            {genre && <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase">{genre}</p>}
            {isEditing ? (
              <Input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                disabled={isSaving}
                maxLength={200}
                autoFocus
                // Matches the display h1's typography so editing feels like
                // typing directly over the title, not a small form field.
                className="font-display h-auto w-full rounded-none border-0 border-b-2 border-foreground/30 bg-transparent px-0 py-0 text-4xl text-foreground shadow-none focus-visible:border-primary focus-visible:ring-0 sm:text-5xl"
              />
            ) : (
              <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">{title}</h1>
            )}
          </div>

          {owner && (
            <Link
              href={`/profile/${owner.id}`}
              className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            >
              <UserAvatar image={owner.image} name={ownerName ?? ""} className="size-7" />
              <span className="text-xs font-semibold tracking-wide uppercase">Curated by {ownerName}</span>
            </Link>
          )}

          {isOwner ? (
            <EditableDescription playlistId={playlistId} initialDescription={initialDescription} />
          ) : (
            initialDescription && (
              <p className="text-base leading-relaxed text-muted-foreground">{initialDescription}</p>
            )
          )}

          <p className="font-mono text-xs text-muted-foreground">{(isEditing ? draftTracks : tracks).length}곡</p>

          <div className="flex w-full flex-col gap-2">
            {error && <p className="text-sm text-destructive">{error}</p>}
            <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              {isEditing ? (
                <>
                  <Button type="button" size="sm" onClick={handleSave} disabled={isSaving}>
                    {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                    저장
                  </Button>
                  <Button type="button" size="sm" variant="outline" onClick={cancelEditing} disabled={isSaving}>
                    <X className="size-4" />
                    취소
                  </Button>
                </>
              ) : (
                <>
                  <PlaylistPlayButton tracks={tracks.map((track) => ({ youtubeUrl: track.youtubeUrl ?? null }))} />
                  <LikeButton
                    playlistId={playlistId}
                    initialLiked={initialLiked}
                    initialCount={likeCount}
                    isAuthenticated={isAuthenticated}
                  />
                  <ShareButton title={title} />
                  <InstagramStoryShareButton
                    playlistId={playlistId}
                    title={title}
                    coverImageUrl={coverImageUrl}
                    tracks={tracks.slice(0, 4).map((track) => ({ title: track.title, artist: track.artist }))}
                  />
                  {isOwner && (
                    <>
                      <Button type="button" variant="outline" size="icon" aria-label="플레이리스트 수정" onClick={startEditing}>
                        <Pencil className="size-4" />
                      </Button>
                      <DeletePlaylistButton playlistId={playlistId} redirectTo={`/profile/${owner?.id ?? ""}`} />
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {isEditing ? (
        <div className="flex flex-col gap-6">
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={draftTracks.map((track) => track.id)} strategy={verticalListSortingStrategy}>
              <div className="flex flex-col gap-1">
                {draftTracks.map((track) => (
                  <SortableDraftTrackRow
                    key={track.id}
                    track={track}
                    onRemove={handleRemoveTrack}
                    disabled={isSaving}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          <TrackSearchAdd onAdd={handleAddTrack} />
        </div>
      ) : (
        <div className="flex flex-col border-t border-border">
          {tracks.map((track) => (
            <PlaylistTrackRow
              key={track.id}
              title={track.title}
              artist={track.artist}
              album={track.album}
              duration={track.duration}
              youtubeUrl={track.youtubeUrl ?? null}
            />
          ))}
        </div>
      )}
    </div>
  );
}
