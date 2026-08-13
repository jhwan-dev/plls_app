import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlaylistById } from "@/lib/playlists";
import { displayName } from "@/lib/user-display";
import { PlaylistDetailBody } from "@/components/playlist/playlist-detail-body";

function summarize(playlist: NonNullable<Awaited<ReturnType<typeof getPlaylistById>>>) {
  return playlist.description?.trim() || `${playlist.tracks.length}곡의 플레이리스트`;
}

export async function generateMetadata({
  params,
}: PageProps<"/playlist/[id]">): Promise<Metadata> {
  const { id } = await params;
  const playlist = await getPlaylistById(id);

  if (!playlist) {
    return { title: "플레이리스트를 찾을 수 없습니다" };
  }

  const description = summarize(playlist);
  const coverUrl = playlist.tracks[0]?.coverUrl;

  return {
    title: playlist.title,
    description,
    openGraph: {
      title: playlist.title,
      description,
      url: `/playlist/${playlist.id}`,
      type: "music.playlist",
      images: coverUrl ? [{ url: coverUrl, width: 500, height: 500 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: playlist.title,
      description,
      images: coverUrl ? [coverUrl] : undefined,
    },
  };
}

export default async function PlaylistPage({ params }: PageProps<"/playlist/[id]">) {
  const { id } = await params;
  const playlist = await getPlaylistById(id);

  if (!playlist) {
    notFound();
  }

  const session = await auth();
  const userId = session?.user?.id;
  const isOwner = !!userId && userId === playlist.userId;
  const viewerLike = userId
    ? await prisma.like.findUnique({ where: { userId_playlistId: { userId, playlistId: id } } })
    : null;

  const owner = playlist.user;
  const ownerName = owner ? displayName(owner) : null;

  return (
    <PlaylistDetailBody
      playlistId={playlist.id}
      initialTitle={playlist.title}
      genre={playlist.genre}
      initialDescription={playlist.description}
      initialTracks={playlist.tracks.map((track) => ({
        id: track.id,
        deezerTrackId: Number(track.deezerTrackId),
        title: track.title,
        artist: track.artist,
        album: track.album,
        coverUrl: track.coverUrl,
        previewUrl: track.previewUrl,
        duration: track.duration,
      }))}
      owner={owner ? { id: owner.id, image: owner.image, name: ownerName ?? "" } : null}
      isOwner={isOwner}
      isAuthenticated={!!userId}
      initialLiked={!!viewerLike}
      likeCount={playlist._count.likes}
    />
  );
}
