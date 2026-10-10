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
import { RepostButton } from "@/components/playlist/repost-button";
import { PlaylistPlayButton } from "@/components/playlist/playlist-play-button";
import { InstagramStoryShareButton } from "@/components/playlist/instagram-story-share-button";
import { DeletePlaylistButton } from "@/components/playlist/delete-playlist-button";
import { EditableDescription } from "@/components/playlist/editable-description";
import { ScreenHeader } from "@/components/layout/screen-header";
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
  initialReposted: boolean;
  likeCount: number;
  createdAt: string;
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
  initialReposted,
  likeCount: initialLikeCount,
  createdAt,
}: PlaylistDetailBodyProps) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [tracks, setTracks] = useState(initialTracks);
  const [coverImageUrl, setCoverImageUrl] = useState(initialCoverImageUrl);
  const [likeCount, setLikeCount] = useState(initialLikeCount);
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
  const visibleTracks = isEditing ? draftTracks : tracks;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col">
      {/* The design doc's header names the screen you came *from* ("< Browse")
          — this page can be reached from several different lists, so "Back"
          stands in generically rather than naming one of them. */}
      <ScreenHeader title="Back" useHistoryBack meta={`${visibleTracks.length} tracks`} />

      <div className="flex flex-col px-3">
        {/* Always a side-by-side hero — PLLS Redesign's cover+info row
            (turn 7, 7c) doesn't restack on narrow viewports; the mock's own
            frame *is* the narrow viewport. */}
        <div className="flex gap-3.5 py-3.5">
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
              className="aspect-square w-36 shrink-0 sm:w-40"
            />
          ) : (
            <PlaylistCover
              coverImageUrl={coverImageUrl}
              seed={playlistId}
              tracks={trackSeeds}
              alt={title}
              className="aspect-square w-36 shrink-0 rounded-[2px] sm:w-40"
              sizes="160px"
            />
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-0.5">
            {genre && (
              <span className="font-pixel text-[10px] tracking-wider text-primary uppercase">{genre}</span>
            )}
            {isEditing ? (
              <Input
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                disabled={isSaving}
                maxLength={200}
                autoFocus
                className="font-display h-auto w-full rounded-none border-0 border-b-2 border-foreground/30 bg-transparent px-0 py-0 text-xl font-semibold text-foreground shadow-none focus-visible:border-primary focus-visible:ring-0"
              />
            ) : (
              <h1 className="font-display text-xl leading-tight font-semibold text-foreground">{title}</h1>
            )}

            {owner && (
              <Link
                href={`/profile/${owner.id}`}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
              >
                <UserAvatar image={owner.image} name={ownerName ?? ""} className="size-5" />
                <span>{ownerName}</span>
              </Link>
            )}

            {isOwner ? (
              <EditableDescription playlistId={playlistId} initialDescription={initialDescription} />
            ) : (
              initialDescription && (
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {initialDescription}
                </p>
              )
            )}

            <span className="font-pixel mt-auto flex gap-3 text-xs tracking-wider text-muted-foreground uppercase">
              <span>{visibleTracks.length} tracks</span>
              {!isEditing && <span>{likeCount} likes</span>}
            </span>
          </div>
        </div>

        {(error || isEditing) && (
          <div className="flex flex-col gap-2 pb-3">
            {error && <p className="text-sm text-destructive">{error}</p>}
            {isEditing && (
              <div className="flex items-center gap-3">
                <Button type="button" size="sm" onClick={handleSave} disabled={isSaving}>
                  {isSaving ? <Loader2 className="size-4 animate-spin" /> : <Check className="size-4" />}
                  저장
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={cancelEditing} disabled={isSaving}>
                  <X className="size-4" />
                  취소
                </Button>
              </div>
            )}
          </div>
        )}
      </div>

      {!isEditing && (
        <>
          {/* Like / Repost / Play / Share — icon-only, in that order (PLLS
              Redesign, turn 7). No button block, no divider: just the icons
              sitting on the screen. */}
          <div className="flex items-center gap-6 px-3 py-3">
            <LikeButton
              playlistId={playlistId}
              initialLiked={initialLiked}
              currentCount={likeCount}
              isAuthenticated={isAuthenticated}
              onToggled={(_liked, count) => setLikeCount(count)}
            />
            <RepostButton
              playlistId={playlistId}
              initialReposted={initialReposted}
              isAuthenticated={isAuthenticated}
              isOwnPlaylist={isOwner}
            />
            <PlaylistPlayButton tracks={tracks.map((track) => ({ youtubeUrl: track.youtubeUrl ?? null }))} />
            <InstagramStoryShareButton
              playlistId={playlistId}
              title={title}
              description={initialDescription}
              coverImageUrl={coverImageUrl}
              tracks={tracks.map((track) => ({ title: track.title, artist: track.artist, duration: track.duration }))}
              curatorName={ownerName ?? "익명"}
              createdAt={createdAt}
              likeCount={likeCount}
            />

            {isOwner && (
              <div className="ml-auto flex items-center gap-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="플레이리스트 수정"
                  onClick={startEditing}
                  className="size-8 text-muted-foreground hover:text-foreground"
                >
                  <Pencil className="size-4" />
                </Button>
                <DeletePlaylistButton playlistId={playlistId} redirectTo={`/profile/${owner?.id ?? ""}`} />
              </div>
            )}
          </div>
        </>
      )}

      <div className="px-3">
        {isEditing ? (
          <div className="flex flex-col gap-6 pb-8">
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
          <>
            <div className="flex items-baseline justify-between border-b border-border pt-4 pb-2">
              <h2 className="font-display text-base text-foreground">Tracklist</h2>
              <span className="font-pixel text-[10px] text-muted-foreground uppercase">{tracks.length}</span>
            </div>
            <div className="flex flex-col divide-y divide-border pb-8">
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
          </>
        )}
      </div>
    </div>
  );
}
