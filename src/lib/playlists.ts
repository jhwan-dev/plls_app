import "server-only";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

// Wrapped in React's `cache()` so `generateMetadata` and the page component
// share one DB query per request instead of fetching the playlist twice.
export const getPlaylistById = cache((id: string) =>
  prisma.playlist.findUnique({
    where: { id },
    include: {
      tracks: { orderBy: { position: "asc" } },
      _count: { select: { likes: true } },
      user: { select: { id: true, name: true, nickname: true, image: true } },
    },
  }),
);

export type PlaylistWithTracks = NonNullable<Awaited<ReturnType<typeof getPlaylistById>>>;
