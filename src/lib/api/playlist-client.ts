import { parseJsonResponse } from "@/lib/api/http";
import type { DraftTrack } from "@/types/playlist";

interface CreatePlaylistPayload {
  title: string;
  description: string;
  genre?: string;
  tracks: DraftTrack[];
  coverImageUrl?: string | null;
}

interface CreatePlaylistResponse {
  id: string;
}

export async function createPlaylist(payload: CreatePlaylistPayload): Promise<CreatePlaylistResponse> {
  const response = await fetch("/api/playlists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: payload.title,
      description: payload.description,
      genre: payload.genre,
      tracks: payload.tracks.map((track) => ({
        itunesTrackId: track.itunesTrackId,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
      })),
      coverImageUrl: payload.coverImageUrl ?? undefined,
    }),
  });

  return parseJsonResponse<CreatePlaylistResponse>(response);
}

export async function uploadDraftCover(file: File): Promise<{ coverImageUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("/api/uploads/playlist-cover", {
    method: "POST",
    body: formData,
  });

  return parseJsonResponse<{ coverImageUrl: string }>(response);
}

export async function deletePlaylist(id: string): Promise<void> {
  const response = await fetch(`/api/playlists/${id}`, { method: "DELETE" });
  await parseJsonResponse<null>(response);
}

interface UpdatePlaylistPayload {
  title: string;
  tracks: DraftTrack[];
}

export async function updatePlaylist(id: string, payload: UpdatePlaylistPayload): Promise<void> {
  const response = await fetch(`/api/playlists/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: payload.title,
      tracks: payload.tracks.map((track) => ({
        itunesTrackId: track.itunesTrackId,
        title: track.title,
        artist: track.artist,
        album: track.album,
        duration: track.duration,
      })),
    }),
  });

  await parseJsonResponse<{ title: string; description: string | null }>(response);
}

export async function updatePlaylistCover(id: string, file: File): Promise<{ coverImageUrl: string }> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`/api/playlists/${id}/cover`, {
    method: "POST",
    body: formData,
  });

  return parseJsonResponse<{ coverImageUrl: string }>(response);
}

export async function removePlaylistCover(id: string): Promise<void> {
  const response = await fetch(`/api/playlists/${id}/cover`, { method: "DELETE" });
  await parseJsonResponse<null>(response);
}
