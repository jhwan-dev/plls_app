import { parseJsonResponse } from "@/lib/api/http";
import type { DraftTrack } from "@/types/playlist";

interface CreatePlaylistPayload {
  title: string;
  description: string;
  genre?: string;
  tracks: DraftTrack[];
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
        deezerTrackId: track.deezerTrackId,
        title: track.title,
        artist: track.artist,
        album: track.album,
        coverUrl: track.coverUrl,
        previewUrl: track.previewUrl,
        duration: track.duration,
      })),
    }),
  });

  return parseJsonResponse<CreatePlaylistResponse>(response);
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
        deezerTrackId: track.deezerTrackId,
        title: track.title,
        artist: track.artist,
        album: track.album,
        coverUrl: track.coverUrl,
        previewUrl: track.previewUrl,
        duration: track.duration,
      })),
    }),
  });

  await parseJsonResponse<{ title: string; description: string | null }>(response);
}
