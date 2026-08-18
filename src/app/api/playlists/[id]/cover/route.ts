import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE_BYTES, saveImageUpload } from "@/lib/uploads";

async function requireOwnedPlaylist(playlistId: string, userId: string) {
  const playlist = await prisma.playlist.findUnique({ where: { id: playlistId }, select: { userId: true } });
  if (!playlist) return { error: NextResponse.json({ error: "플레이리스트를 찾을 수 없습니다." }, { status: 404 }) };
  if (playlist.userId !== userId) {
    return { error: NextResponse.json({ error: "수정 권한이 없습니다." }, { status: 403 }) };
  }
  return { error: null };
}

export async function POST(request: Request, { params }: RouteContext<"/api/playlists/[id]/cover">) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await requireOwnedPlaylist(id, session.user.id);
  if (error) return error;

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "이미지 파일을 선택해 주세요." }, { status: 400 });
  }

  const extension = ALLOWED_IMAGE_TYPES[file.type];
  if (!extension) {
    return NextResponse.json(
      { error: "jpg, png, webp 형식의 이미지만 업로드할 수 있어요." },
      { status: 400 },
    );
  }

  if (file.size > MAX_UPLOAD_SIZE_BYTES) {
    return NextResponse.json({ error: "이미지는 5MB 이하여야 해요." }, { status: 400 });
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `${id}-${Date.now()}.${extension}`;
    const coverImageUrl = await saveImageUpload("playlist-covers", filename, file.type, buffer);

    await prisma.playlist.update({ where: { id }, data: { coverImageUrl } });

    return NextResponse.json({ coverImageUrl });
  } catch (err) {
    console.error("Failed to upload playlist cover:", err);
    return NextResponse.json(
      { error: "커버 이미지 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext<"/api/playlists/[id]/cover">) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const { id } = await params;
  const { error } = await requireOwnedPlaylist(id, session.user.id);
  if (error) return error;

  try {
    await prisma.playlist.update({ where: { id }, data: { coverImageUrl: null } });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("Failed to remove playlist cover:", err);
    return NextResponse.json(
      { error: "커버 이미지 제거 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
