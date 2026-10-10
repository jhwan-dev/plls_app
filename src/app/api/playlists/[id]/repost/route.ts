import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toggleUniqueRelation } from "@/lib/toggle-relation";

export async function POST(_request: Request, { params }: RouteContext<"/api/playlists/[id]/repost">) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id: playlistId } = await params;
  const userId = session.user.id;

  const playlist = await prisma.playlist.findUnique({ where: { id: playlistId }, select: { userId: true } });
  if (!playlist) {
    return NextResponse.json({ error: "플레이리스트를 찾을 수 없습니다." }, { status: 404 });
  }
  // Reposting your own playlist would just duplicate it into your own "My
  // Sound" — the distinction the Reposts section exists to draw.
  if (playlist.userId === userId) {
    return NextResponse.json({ error: "본인 플레이리스트는 리포스트할 수 없습니다." }, { status: 400 });
  }

  try {
    const reposted = await toggleUniqueRelation({
      create: () => prisma.repost.create({ data: { userId, playlistId } }),
      deleteRow: () => prisma.repost.delete({ where: { userId_playlistId: { userId, playlistId } } }),
    });

    const count = await prisma.repost.count({ where: { playlistId } });

    return NextResponse.json({ reposted, count });
  } catch (error) {
    console.error("Failed to toggle repost:", error);
    return NextResponse.json({ error: "리포스트 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
