import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createPlaylistSchema } from "@/lib/validations/playlist";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const json = await request.json().catch(() => null);

  if (json === null) {
    return NextResponse.json({ error: "요청 본문을 읽을 수 없습니다." }, { status: 400 });
  }

  const parsed = createPlaylistSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "요청이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  const { title, description, genre, tracks } = parsed.data;

  try {
    const playlist = await prisma.playlist.create({
      data: {
        title,
        description,
        // Trust the client's `isCurator` for UX only — re-check server-side
        // so a non-curator can't set genre by calling the API directly.
        genre: session.user.isCurator ? genre : undefined,
        userId: session.user.id,
        tracks: {
          create: tracks.map((track, index) => ({
            position: index,
            deezerTrackId: BigInt(track.deezerTrackId),
            title: track.title,
            artist: track.artist,
            album: track.album,
            coverUrl: track.coverUrl,
            previewUrl: track.previewUrl,
            duration: track.duration,
          })),
        },
      },
      select: { id: true },
    });

    return NextResponse.json({ id: playlist.id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create playlist:", error);
    return NextResponse.json(
      { error: "플레이리스트 저장 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
