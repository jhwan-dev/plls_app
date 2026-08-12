import { create } from "zustand";

export interface PlayerTrackInfo {
  trackId: number;
  previewUrl: string;
  title: string;
  artist: string;
  coverUrl: string;
}

interface PlayerState {
  currentTrackId: number | null;
  previewUrl: string | null;
  title: string | null;
  artist: string | null;
  coverUrl: string | null;
  isPlaying: boolean;
  /** Plays the given track's preview, replacing whatever is currently playing. */
  play: (track: PlayerTrackInfo) => void;
  pause: () => void;
  resume: () => void;
  /** Starts playing `track` if it isn't the active one, otherwise toggles play/pause. */
  toggle: (track: PlayerTrackInfo) => void;
  reset: () => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  currentTrackId: null,
  previewUrl: null,
  title: null,
  artist: null,
  coverUrl: null,
  isPlaying: false,

  play: (track) =>
    set({
      currentTrackId: track.trackId,
      previewUrl: track.previewUrl,
      title: track.title,
      artist: track.artist,
      coverUrl: track.coverUrl,
      isPlaying: true,
    }),

  pause: () => set({ isPlaying: false }),

  resume: () => set({ isPlaying: true }),

  toggle: (track) => {
    const { currentTrackId, isPlaying } = get();
    if (currentTrackId === track.trackId) {
      set({ isPlaying: !isPlaying });
    } else {
      set({
        currentTrackId: track.trackId,
        previewUrl: track.previewUrl,
        title: track.title,
        artist: track.artist,
        coverUrl: track.coverUrl,
        isPlaying: true,
      });
    }
  },

  reset: () => set({ currentTrackId: null, previewUrl: null, title: null, artist: null, coverUrl: null, isPlaying: false }),
}));
