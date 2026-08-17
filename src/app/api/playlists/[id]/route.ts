import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePlaylistSchema } from "@/lib/validations/playlist";
import { resolveYoutubeUrl } from "@/lib/track-link";

export async function PATCH(request: Request, { params }: RouteContext<"/api/playlists/[id]">) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  const playlist = await prisma.playlist.findUnique({ where: { id }, select: { userId: true } });

  if (!playlist) {
    return NextResponse.json({ error: "플레이리스트를 찾을 수 없습니다." }, { status: 404 });
  }

  if (playlist.userId !== session.user.id) {
    return NextResponse.json({ error: "수정 권한이 없습니다." }, { status: 403 });
  }

  const json = await request.json().catch(() => null);

  if (json === null) {
    return NextResponse.json({ error: "요청 본문을 읽을 수 없습니다." }, { status: 400 });
  }

  const parsed = updatePlaylistSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "요청이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const { title, description, tracks } = parsed.data;

  try {
    // Resolved outside the transaction — these are network calls to YouTube
    // (cache-first, see resolveYoutubeUrl), not something that belongs
    // inside a short-lived DB transaction.
    const youtubeUrls = tracks
      ? await Promise.all(
          tracks.map((track) =>
            resolveYoutubeUrl(track.itunesTrackId, track.title, track.artist),
          ),
        )
      : null;

    const updated = await prisma.$transaction(async (tx) => {
      // Full replace, not a diff — simplest way to apply add/remove/reorder
      // together in one write. Track ids aren't referenced anywhere else
      // (Like points at Playlist, not PlaylistTrack), so this is safe.
      if (tracks) {
        await tx.playlistTrack.deleteMany({ where: { playlistId: id } });
      }

      return tx.playlist.update({
        where: { id },
        data: {
          ...(title !== undefined && { title }),
          ...(description !== undefined && { description }),
          ...(tracks && {
            tracks: {
              create: tracks.map((track, index) => ({
                position: index,
                itunesTrackId: track.itunesTrackId,
                title: track.title,
                artist: track.artist,
                album: track.album,
                duration: track.duration,
                youtubeUrl: youtubeUrls![index]!,
              })),
            },
          }),
        },
        select: { title: true, description: true },
      });
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update playlist:", error);
    return NextResponse.json(
      { error: "플레이리스트 수정 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/playlists/[id]">) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;

  const playlist = await prisma.playlist.findUnique({ where: { id }, select: { userId: true } });

  if (!playlist) {
    return NextResponse.json({ error: "플레이리스트를 찾을 수 없습니다." }, { status: 404 });
  }

  if (playlist.userId !== session.user.id) {
    return NextResponse.json({ error: "삭제 권한이 없습니다." }, { status: 403 });
  }

  try {
    // PlaylistTrack and Like both cascade on Playlist delete (see schema).
    await prisma.playlist.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Failed to delete playlist:", error);
    return NextResponse.json(
      { error: "플레이리스트 삭제 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
