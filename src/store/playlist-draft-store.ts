import { create } from "zustand";
import { persist } from "zustand/middleware";
import { nanoid } from "nanoid";
import { arrayMove } from "@dnd-kit/sortable";
import type { DraftTrack } from "@/types/playlist";
import type { DeezerTrack } from "@/types/deezer";

interface PlaylistDraftState {
  title: string;
  description: string;
  genre: string;
  tracks: DraftTrack[];
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setGenre: (genre: string) => void;
  addTrack: (track: DeezerTrack) => void;
  removeTrack: (id: string) => void;
  reorderTracks: (activeId: string, overId: string) => void;
  clear: () => void;
}

export const usePlaylistDraftStore = create<PlaylistDraftState>()(
  persist(
    (set) => ({
      title: "",
      description: "",
      genre: "",
      tracks: [],

      setTitle: (title) => set({ title }),

      setDescription: (description) => set({ description }),

      setGenre: (genre) => set({ genre }),

      addTrack: (track) =>
        set((state) => ({
          tracks: [
            ...state.tracks,
            {
              id: nanoid(),
              deezerTrackId: track.id,
              title: track.title,
              artist: track.artist.name,
              album: track.album.title,
              coverUrl: track.album.cover_medium,
              previewUrl: track.preview,
              duration: track.duration,
            },
          ],
        })),

      removeTrack: (id) =>
        set((state) => ({ tracks: state.tracks.filter((track) => track.id !== id) })),

      reorderTracks: (activeId, overId) =>
        set((state) => {
          if (activeId === overId) return state;
          const oldIndex = state.tracks.findIndex((track) => track.id === activeId);
          const newIndex = state.tracks.findIndex((track) => track.id === overId);
          if (oldIndex === -1 || newIndex === -1) return state;
          return { tracks: arrayMove(state.tracks, oldIndex, newIndex) };
        }),

      clear: () => set({ title: "", description: "", genre: "", tracks: [] }),
    }),
    {
      // Keeps an in-progress playlist across accidental refreshes/tab closes;
      // cleared explicitly once the draft is saved (see `clear()` above).
      name: "plls-playlist-draft",
    },
  ),
);
