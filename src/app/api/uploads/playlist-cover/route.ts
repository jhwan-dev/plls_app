import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_SIZE_BYTES, saveImageUpload } from "@/lib/uploads";

/**
 * Uploads a playlist cover with no playlist record involved — used while
 * still building a draft (see playlist-draft-panel.tsx), before a playlist
 * id exists to attach it to. The returned URL is submitted along with the
 * rest of the draft when the playlist is actually created.
 */
export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

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
    const filename = `${session.user.id}-${Date.now()}.${extension}`;
    const coverImageUrl = await saveImageUpload("playlist-covers", filename, file.type, buffer);

    return NextResponse.json({ coverImageUrl });
  } catch (err) {
    console.error("Failed to upload draft playlist cover:", err);
    return NextResponse.json(
      { error: "커버 이미지 업로드 중 오류가 발생했습니다." },
      { status: 500 },
    );
  }
}
