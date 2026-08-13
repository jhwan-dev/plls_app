import { z } from "zod";

export const playlistTrackInputSchema = z.object({
  deezerTrackId: z.number().int().positive(),
  title: z.string().trim().min(1),
  artist: z.string().trim().min(1),
  album: z.string().trim().min(1),
  coverUrl: z.string().url(),
  previewUrl: z.string().url(),
  duration: z.number().int().nonnegative(),
});

export const createPlaylistSchema = z.object({
  title: z.string().trim().min(1, "제목을 입력해 주세요.").max(200, "제목이 너무 길어요."),
  description: z
    .string()
    .trim()
    .max(1000, "설명이 너무 길어요.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  // Only persisted server-side when the creator is a curator — see
  // /api/playlists. Accepted here regardless so validation stays generic.
  genre: z
    .string()
    .trim()
    .max(50, "장르가 너무 길어요.")
    .optional()
    .transform((value) => (value ? value : undefined)),
  tracks: z
    .array(playlistTrackInputSchema)
    .min(1, "최소 1개 이상의 트랙을 추가해 주세요."),
});

export type CreatePlaylistInput = z.infer<typeof createPlaylistSchema>;

// All fields optional — the PATCH route applies whichever are present, so
// EditableDescription (description only) and the title/track-list editor
// (title + tracks) can share one endpoint without stepping on each other.
export const updatePlaylistSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "제목을 입력해 주세요.")
    .max(200, "제목이 너무 길어요.")
    .optional(),
  // Unlike create, an empty string here means "clear the description"
  // (-> null), not "field omitted" — omission is what .optional() catches;
  // an empty *value* still runs the transform below.
  description: z
    .string()
    .trim()
    .max(1000, "설명이 너무 길어요.")
    .optional()
    .transform((value) => (value === undefined ? undefined : value ? value : null)),
  tracks: z
    .array(playlistTrackInputSchema)
    .min(1, "최소 1개 이상의 트랙이 있어야 해요.")
    .optional(),
});

export type UpdatePlaylistInput = z.infer<typeof updatePlaylistSchema>;
