import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPlaylistById } from "@/lib/playlists";
import { displayName } from "@/lib/user-display";
import { PlaylistTrackRow } from "@/components/playlist/playlist-track-row";
import { PlaylistCoverCollage } from "@/components/playlist/playlist-cover-collage";
import { ShareButton } from "@/components/playlist/share-button";
import { InstagramStoryShareButton } from "@/components/playlist/instagram-story-share-button";
import { LikeButton } from "@/components/playlist/like-button";
import { EditableDescription } from "@/components/playlist/editable-description";
import { DeletePlaylistButton } from "@/components/playlist/delete-playlist-button";
import { UserAvatar } from "@/components/brand/user-avatar";

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
  const coverUrls = playlist.tracks.slice(0, 4).map((track) => track.coverUrl);

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-10 px-4 pt-10 pb-8">
      {/* Mobile: cover on top, then editorial credit block below.
          sm+: cover on the left, credit block beside it — a magazine spread. */}
      <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:gap-8 sm:text-left">
        <PlaylistCoverCollage
          covers={coverUrls}
          alt={playlist.title}
          className="aspect-[4/5] w-full max-w-[280px] shrink-0 rounded-[3px] sm:w-64"
          sizes="(max-width: 640px) 280px, 256px"
        />

        <div className="flex flex-1 flex-col items-center gap-4 sm:items-start">
          <div className="flex flex-col gap-1.5">
            {playlist.genre && (
              <p className="font-mono text-xs tracking-[0.15em] text-primary uppercase">{playlist.genre}</p>
            )}
            <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-5xl">
              {playlist.title}
            </h1>
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
            <EditableDescription playlistId={playlist.id} initialDescription={playlist.description} />
          ) : (
            playlist.description && (
              <p className="text-base leading-relaxed text-muted-foreground">{playlist.description}</p>
            )
          )}

          <p className="font-mono text-xs text-muted-foreground">{playlist.tracks.length}곡</p>

          <div className="flex items-center justify-center gap-3 sm:justify-start">
            <LikeButton
              playlistId={playlist.id}
              initialLiked={!!viewerLike}
              initialCount={playlist._count.likes}
              isAuthenticated={!!userId}
            />
            <ShareButton title={playlist.title} />
            <InstagramStoryShareButton
              playlistId={playlist.id}
              title={playlist.title}
              coverUrls={coverUrls}
              tracks={playlist.tracks.slice(0, 4).map((track) => ({ title: track.title, artist: track.artist }))}
            />
            {isOwner && (
              <DeletePlaylistButton playlistId={playlist.id} redirectTo={`/profile/${userId}`} />
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col border-t border-border">
        {playlist.tracks.map((track) => (
          <PlaylistTrackRow
            key={track.id}
            deezerTrackId={Number(track.deezerTrackId)}
            title={track.title}
            artist={track.artist}
            album={track.album}
            coverUrl={track.coverUrl}
            previewUrl={track.previewUrl}
            duration={track.duration}
          />
        ))}
      </div>
    </div>
  );
}
