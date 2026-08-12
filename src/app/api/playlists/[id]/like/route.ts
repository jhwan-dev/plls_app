import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toggleUniqueRelation } from "@/lib/toggle-relation";

export async function POST(_request: Request, { params }: RouteContext<"/api/playlists/[id]/like">) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id: playlistId } = await params;
  const userId = session.user.id;

  try {
    const liked = await toggleUniqueRelation({
      create: () => prisma.like.create({ data: { userId, playlistId } }),
      deleteRow: () => prisma.like.delete({ where: { userId_playlistId: { userId, playlistId } } }),
    });

    const count = await prisma.like.count({ where: { playlistId } });

    return NextResponse.json({ liked, count });
  } catch (error) {
    console.error("Failed to toggle like:", error);
    return NextResponse.json({ error: "좋아요 처리 중 오류가 발생했습니다." }, { status: 500 });
  }
}
