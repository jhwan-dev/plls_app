import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updatePlaylistDescriptionSchema } from "@/lib/validations/playlist";

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

  const parsed = updatePlaylistDescriptionSchema.safeParse(json);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "요청이 올바르지 않습니다." },
      { status: 400 },
    );
  }

  try {
    const updated = await prisma.playlist.update({
      where: { id },
      data: { description: parsed.data.description },
      select: { description: true },
    });

    return NextResponse.json({ description: updated.description });
  } catch (error) {
    console.error("Failed to update playlist description:", error);
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
